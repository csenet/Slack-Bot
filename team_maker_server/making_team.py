import sys
import pymysql
import config

#1チームあたりteam_member人を指標としてチームの振り分けを行う関数
def making_team(team_member):

	#1チームあたり0人以下なら終了
	if team_member <= 0:
		sys.exit('1チームあたり1人以上のメンバーが必要です。')

	connector = pymysql.connect(
		host = config.host,
		user = config.user,
		passwd = config.passwd,
		db = config.db,
		charset = config.charset,
		cursorclass = pymysql.cursors.DictCursor)

	with connector.cursor() as cursor:

		#DBに登録されたユーザ全員のアカウント名,contribution数,希望の役割,Slack IDを取得
		sql = 'select account_name, contributions, role, slack_id from users;'
		cursor.execute(sql)
		sql_result = cursor.fetchall()

	#ユーザの総数が1チームあたりの人数より少なければ終了
	if(len(sql_result) < team_member):
		sys.exit('ユーザ数が足りません。もうしばらくお待ちください。')

	#ユーザをcontribution数の多い順にソート
	participations = sorted(sql_result, key=lambda x: x['contributions'], reverse = True)

	#総チーム数 = ユーザの総数 / 1チームあたりの人数
	teams = int(len(participations)/team_member)

	team_list = []

	#contribution数の多い人から順に各チームの代表に割り当て
	for i in range(teams):

		dict = {
			"name" : participations[0]['account_name'],
			"slack_id" : participations[0]['slack_id']
		}

		team_list.append([dict])
		participations.pop(0)

	#ユーザを希望の役割がfrontend, backend, anyの順番にソート
	participations = sorted(participations, key = lambda x: x['role'], reverse = True)

	#各役割ごとに順番に割り当て
	while len(participations) > 0:
		for i in range(teams):

			#途中で0人になったら割り当て終了
			if(len(participations) <= 0):
				break

			dict = {
				"name" : participations[0]['account_name'],
				"slack_id" : participations[0]['slack_id']
			}

			team_list[i].append(dict)
			participations.pop(0)

	json_response = {"teams" : team_list }
	return json_response
