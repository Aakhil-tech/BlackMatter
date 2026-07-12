""" Authentication schemas. """
from pydantic import BaseModel

class UserSignUp(BaseModel):
    name: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None
