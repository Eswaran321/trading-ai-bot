from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.execution.paper import paper_account
from app.schemas.domain import OrderCreate, RiskProfileUpdate

router = APIRouter()

@router.get("/summary")
async def get_portfolio_summary():
    return paper_account.get_portfolio_summary()

@router.get("/orders")
async def get_orders():
    return paper_account.orders

@router.post("/orders")
async def submit_order(order_req: OrderCreate):
    res = paper_account.submit_order(order_req.model_dump())
    if res.get("status") == "REJECTED":
        return res
    return res

@router.put("/risk")
async def update_risk_settings(risk_req: RiskProfileUpdate):
    return paper_account.update_risk_profile(risk_req.model_dump(exclude_unset=True))
