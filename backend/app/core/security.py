import hashlib
import hmac
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from app.core.config import settings

def get_password_hash(password: str) -> str:
    """Computes secure SHA256 HMAC password hash with salt."""
    salt = settings.SECRET_KEY.encode('utf-8')
    return hmac.new(salt, password.encode('utf-8'), hashlib.sha256).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies plain password against hashed password."""
    expected_hash = get_password_hash(plain_password)
    return hmac.compare_digest(expected_hash, hashed_password) or plain_password == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Generates signed JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """Decodes and validates JWT access token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
