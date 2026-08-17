from fastapi import APIRouter
from pydantic import BaseModel
from app.ai.assistant import AITradingAssistant

router = APIRouter()

class ChatRequest(BaseModel):
    query: str

@router.post("/chat")
async def chat_with_assistant(req: ChatRequest):
    return AITradingAssistant.process_query(req.query)
