from pydantic import BaseModel

class User(BaseModel):
	account_name: str
	role: str
	contribution: int
	slack_id : str

