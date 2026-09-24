## Safe implementation note

The requested unofficial `instagrapi` follow/unfollow automation was not added. A disabled, isolated status/guard module is included at `api/experimental_follow.py` so the UI or future integrations can show a clear warning without collecting Instagram passwords, session cookies, or evading platform controls.

Use the official Meta OAuth/Graph API integration for supported publishing, comments, messaging, and insights features.
