from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import userdb
import user
import contribution
import making_team

app = FastAPI()

origins = [
	"http://localhost:3000"
]

app.add_middleware(
	CORSMiddleware,
	allow_origins = origins,
	allow_credentials = True,
	allow_methods = ["GET, POST, PUT, OPTIONS"],
	allow_headers = ["*"],
)

@app.get("/users")
async def get_users():
	return userdb.get_user()

@app.post("/users")
async def add_user(user: user.User):
	return userdb.add_user(user)

@app.get("/teams")
async def get_teams(team_members: int):
	return making_team.making_team(team_members)

@app.get("/users/{account_name}/contributions")
async def get_users_contributions(account_name: str):
	return contribution.get_users_contribution(account_name)

if __name__ == "__main__":
	uvicorn.run(app, host="0.0.0.0", port = 80)
