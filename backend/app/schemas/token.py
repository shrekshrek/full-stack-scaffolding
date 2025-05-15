from pydantic import BaseModel
from typing import Optional # Ensure Optional is imported if needed for older Pydantic or specific use cases

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel): # Renamed from TokenData to TokenPayload for clarity with JWT standards
    sub: str | None = None # 'sub' (subject) is standard for user identifier in JWT
    # You can add other fields to the payload if necessary, e.g., username, roles
    # username: Optional[str] = None 