"""Safety boundary for the requested experimental follow module.

This module intentionally contains no Instagram login, session persistence, follow,
unfollow, scraping, or rate-limit evasion. The official Meta Graph API does not
provide those actions. Keeping this boundary explicit prevents accidental use of
unofficial automation against user accounts.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/experimental-follow", tags=["experimental-follow"])

class FollowRequest(BaseModel):
    target_username: str = Field(min_length=1, max_length=64)
    action: str = Field(pattern="^(follow|unfollow)$")
    acknowledge_risk: bool = False
    second_confirmation: bool = False

@router.get("/status")
def status():
    return {
        "enabled": False,
        "name": "Experimental Follow Module",
        "reason": "Follow/unfollow automation is not available through the official Meta Graph API.",
        "safe_alternative": "Use the official Instagram app or approved Meta API capabilities manually.",
    }

@router.post("/execute")
def execute(_: FollowRequest):
    raise HTTPException(
        status_code=501,
        detail="این ماژول عمداً غیرفعال است؛ API رسمی Meta عملیات follow/unfollow را ارائه نمی‌کند و اجرای خودکار غیررسمی می‌تواند به حساب آسیب بزند.",
    )
