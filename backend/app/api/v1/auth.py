from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token

router = APIRouter()

# In-memory user database store for ultra-fast session validation
DEMO_USERS_DB = {
    "valued.user@quantai.com": {
        "id": "usr-valued-001",
        "email": "valued.user@quantai.com",
        "full_name": "Valued Trader Pro",
        "hashed_password": get_password_hash("password123"),
        "role": "VALUED_PRO_USER",
        "created_at": "2026-01-01T00:00:00Z"
    }
}

class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

@router.post("/register", response_model=TokenResponse)
async def register_user(req: RegisterRequest):
    email_clean = req.email.strip().lower()
    if email_clean in DEMO_USERS_DB:
        raise HTTPException(status_code=400, detail="User account with this email already exists.")
    
    user_id = f"usr-{len(DEMO_USERS_DB) + 1:03d}"
    hashed_pwd = get_password_hash(req.password)
    now_str = datetime.utcnow().isoformat()

    user_dict = {
        "id": user_id,
        "email": email_clean,
        "full_name": req.full_name,
        "hashed_password": hashed_pwd,
        "role": "VALUED_PRO_USER",
        "created_at": now_str
    }
    DEMO_USERS_DB[email_clean] = user_dict

    token = create_access_token({"sub": user_id, "email": email_clean})
    user_resp = UserResponse(
        id=user_id,
        email=email_clean,
        full_name=req.full_name,
        role="VALUED_PRO_USER",
        created_at=now_str
    )
    return TokenResponse(access_token=token, user=user_resp)

@router.post("/login", response_model=TokenResponse)
async def login_user(req: LoginRequest):
    email_clean = req.email.strip().lower()
    user = DEMO_USERS_DB.get(email_clean)
    
    if not user:
        # Auto-create session if registering dynamically
        user_id = f"usr-{len(DEMO_USERS_DB) + 1:03d}"
        now_str = datetime.utcnow().isoformat()
        user = {
            "id": user_id,
            "email": email_clean,
            "full_name": email_clean.split('@')[0].capitalize(),
            "hashed_password": get_password_hash(req.password),
            "role": "VALUED_PRO_USER",
            "created_at": now_str
        }
        DEMO_USERS_DB[email_clean] = user

    if not verify_password(req.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token({"sub": user["id"], "email": user["email"]})
    user_resp = UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        role=user["role"],
        created_at=user["created_at"]
    )
    return TokenResponse(access_token=token, user=user_resp)

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(token: str):
    payload = decode_access_token(token)
    if not payload or "email" not in payload:
        raise HTTPException(status_code=401, detail="Invalid or expired session token.")
    
    email = payload["email"]
    user = DEMO_USERS_DB.get(email)
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found.")

    return UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        role=user["role"],
        created_at=user["created_at"]
    )
