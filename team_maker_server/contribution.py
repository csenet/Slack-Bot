import requests
import sys
from bs4 import BeautifulSoup
import re

#githubからaccount_nameのcontribution数を取得する関数
def get_users_contribution(account_name):

	#アクセスするURLを作成
	url = 'https://github.com/users/' + account_name + '/contributions'
	site = requests.get(url)

	#h2タグ内のcontribution数を取得し、クライアントに返す
	soup = BeautifulSoup(site.text, "html.parser")
	elems = soup.find('h2')
	result = re.sub(r"\D", "", elems.text)

	contri_list = []
	contri_list.append(result)

	json_response = { "contributions" : contri_list }
	return json_response

