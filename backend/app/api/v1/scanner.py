from fastapi import APIRouter
from typing import List, Dict, Any
from app.ai.scanner import AIScannerEngine
from app.schemas.domain import OpportunitySignal, AIMarketSummary

router = APIRouter()

@router.get("/opportunities", response_model=List[OpportunitySignal])
async def get_opportunities():
    """
    Returns AI Scanner scanned opportunities with confidence scores, entry/invalidation levels, and technical factor reasoning.
    """
    return AIScannerEngine.get_all_opportunities()

@router.get("/summary", response_model=AIMarketSummary)
async def get_ai_summary():
    """
    Returns macro AI market condition summary.
    """
    return AIScannerEngine.get_ai_market_summary()
