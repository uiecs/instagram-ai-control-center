from typing import Any
import base64
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from openai import OpenAI
import httpx

app = FastAPI(title="Instagram AI Control Center API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class PromptRequest(BaseModel):
    prompt: str = Field(min_length=2, max_length=4000)
    language: str = "fa"

class PublishRequest(BaseModel):
    image_url: str
    caption: str = Field(max_length=2200)
    confirm: bool = False

class UsernameRequest(BaseModel):
    username: str = Field(min_length=1, max_length=64)


def client() -> OpenAI:
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        raise HTTPException(503, "OPENAI_API_KEY تنظیم نشده است")
    return OpenAI(api_key=key)

@app.get("/health")
def health():
    return {"ok": True, "ai_configured": bool(os.getenv("OPENAI_API_KEY")), "meta_configured": bool(os.getenv("META_ACCESS_TOKEN"))}

@app.post("/ai/chat")
def chat(req: PromptRequest):
    result = client().chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        messages=[
            {"role":"system","content":"تو دستیار فارسی یک داشبورد تولید محتوای اینستاگرام هستی. پاسخ کاربردی بده و هیچ عملیات انتشار را بدون تأیید صریح انجام نده."},
            {"role":"user","content":req.prompt},
        ], temperature=0.8,
    )
    return {"text": result.choices[0].message.content}

@app.post("/ai/content")
def content(req: PromptRequest):
    result = client().chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        response_format={"type":"json_object"},
        messages=[
            {"role":"system","content":"برای اینستاگرام فارسی خروجی JSON بساز با کلیدهای title, caption, hashtags, cta, alt_text. هشتگ‌ها مرتبط و غیرتکراری باشند؛ ادعای ترند بودن قطعی نکن."},
            {"role":"user","content":req.prompt},
        ], temperature=0.9,
    )
    import json
    return json.loads(result.choices[0].message.content)

@app.post("/ai/image")
def image(req: PromptRequest):
    result = client().images.generate(model=os.getenv("OPENAI_IMAGE_MODEL", "gpt-image-1"), prompt=req.prompt, size="1024x1024")
    item = result.data[0]
    if getattr(item, "b64_json", None):
        return {"data_url": "data:image/png;base64," + item.b64_json}
    return {"url": item.url}

@app.post("/search/username")
def username(req: UsernameRequest):
    # Instagram does not expose an official endpoint for exhaustive username discovery.
    # Return safe candidates based on public web search only when a provider is configured.
    token = os.getenv("BRAVE_SEARCH_API_KEY")
    if not token:
        return {"username": req.username, "results": [], "notice":"برای جست‌وجوی عمومی، BRAVE_SEARCH_API_KEY را تنظیم کنید. نتیجه کامل یا قطعی قابل تضمین نیست."}
    headers={"X-Subscription-Token":token,"Accept":"application/json"}
    with httpx.Client(timeout=15) as h:
        r=h.get("https://api.search.brave.com/res/v1/web/search", params={"q":f'site:instagram.com "{req.username}"'}, headers=headers)
    if r.status_code >= 400: raise HTTPException(r.status_code, "سرویس جست‌وجوی عمومی خطا داد")
    data=r.json()
    return {"username":req.username,"results":[{"title":x.get("title"),"url":x.get("url"),"description":x.get("description")} for x in data.get("web",{}).get("results",[])][:20],"notice":"این‌ها نتایج عمومی وب هستند، نه فهرست قطعی همه حساب‌ها."}

@app.post("/instagram/publish")
def publish(req: PublishRequest):
    if not req.confirm: return {"status":"preview","message":"برای انتشار، تأیید صریح لازم است.","payload":req.model_dump()}
    token=os.getenv("META_ACCESS_TOKEN"); user=os.getenv("META_IG_USER_ID")
    if not token or not user: raise HTTPException(503,"اتصال رسمی Meta تنظیم نشده است")
    # Official two-step Graph API image publishing.
    with httpx.Client(timeout=30) as h:
        c=h.post(f"https://graph.facebook.com/v20.0/{user}/media",params={"image_url":req.image_url,"caption":req.caption,"access_token":token})
        if c.status_code>=400: raise HTTPException(c.status_code,c.text)
        creation_id=c.json()["id"]
        p=h.post(f"https://graph.facebook.com/v20.0/{user}/media_publish",params={"creation_id":creation_id,"access_token":token})
        if p.status_code>=400: raise HTTPException(p.status_code,p.text)
    return {"status":"published","id":p.json().get("id")}
