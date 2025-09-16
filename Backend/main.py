import sys
print("Python version:")
print(sys.version)
print("\nVersion info:")
print(sys.version_info)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from uuid import uuid4
from typing import Dict, List, Optional
import random

app = FastAPI(title="Snakes & Ladders API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static board definition ----------------------------------------------------
SNAKES = {12: 3,
  15: 7,
  20: 5,
  37: 17,
  45: 27,
  50: 36,
  67: 42,
  70:23,
  86:56,
  98:65,
  92:61,
  83: 53,}
LADDERS = {13: 33,
  19: 39,
  34:63,
  48:77,
  43:75,
  51:65,
  8:11,
  64: 86,
  78: 89,
  72: 94,
}
BOARD_SIZE = 100

# Data models ----------------------------------------------------------------
class GameState(BaseModel):
    id: str
    players: List[int]      # current square of each player (0‑based means off‑board)
    current_turn: int       # 0 or 1
    winner: Optional[int]   # None or index of winner

# In‑memory store of games ----------------------------------------------------
GAMES: Dict[str, GameState] = {}

# Helpers --------------------------------------------------------------------

def apply_snakes_ladders(square: int) -> int:
    """Return new square after falling down a snake or climbing a ladder."""
    if square in SNAKES:
        return SNAKES[square]
    return LADDERS.get(square, square)

# Routes ---------------------------------------------------------------------

@app.post("/new", response_model=GameState)
def new_game():
    """Create a new four‑player game and return initial state."""
    gid = uuid4().hex
    state = GameState(id=gid, players=[0, 0, 0, 0], current_turn=0, winner=None)
    GAMES[gid] = state
    return state

@app.get("/state/{gid}", response_model=GameState)
def get_state(gid: str):
    if gid not in GAMES:
        raise HTTPException(status_code=404, detail="Game not found")
    return GAMES[gid]

class RollResult(BaseModel):
    dice: int
    state: GameState

@app.post("/roll/{gid}", response_model=RollResult)
def roll_dice(gid: str):
    if gid not in GAMES:
        raise HTTPException(status_code=404, detail="Game not found")
    state = GAMES[gid]
    if state.winner is not None:
        return RollResult(dice=0, state=state)  # game already finished

    dice = random.randint(1, 6)
    player = state.current_turn

    # Special rule: if player is at 99, only a roll of 1 allows them to win
    if state.players[player] == 99:
        if dice == 1:
            pos = 100
            state.players[player] = pos
            state.winner = player
        else:
            # Stay at 99, just pass turn
            pos = 99
            state.players[player] = pos
            state.current_turn = (player + 1) % 4
        return RollResult(dice=dice, state=state)

    pos = state.players[player] + dice
    if pos > BOARD_SIZE:
        # If overshoot, stay in place and just pass turn
        pos = state.players[player]
        state.players[player] = pos
        state.current_turn = (player + 1) % 4
        return RollResult(dice=dice, state=state)
    if pos <= BOARD_SIZE:
        pos = apply_snakes_ladders(pos)
    state.players[player] = pos

    if pos == BOARD_SIZE:
        state.winner = player
    else:
        # Move to next player (0 → 1 → 2 → 3 → 0)
        state.current_turn = (player + 1) % 4

    return RollResult(dice=dice, state=state)