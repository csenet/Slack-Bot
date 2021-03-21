import pymysql
import config

#全てのユーザのユーザ情報を取得する関数(テスト用)
def get_user():

	connector = pymysql.connect(
		host = config.host,
		user = config.user,
		passwd = config.passwd,
		db = config.db,
		charset = config.charset,
		cursorclass = pymysql.cursors.DictCursor)

	with connector.cursor() as cursor:

		#全てのユーザのユーザ情報を取得する
		sql = 'select * from users;'
		cursor.execute(sql)
		sql_result = cursor.fetchall()

	json_response = { "users" : sql_result }
	return json_response

#ユーザ情報の登録を行う関数
def add_user(user):

	connector = pymysql.connect(
		host = config.host,
		user = config.user,
		passwd = config.passwd,
		db = config.db,
		charset = config.charset,
		cursorclass = pymysql.cursors.DictCursor)

	with connector.cursor() as cursor:

		#アカウント名,githubのcoutribution数,希望の役割をDBに保存
		sql = 'insert into users (account_name, contributions,  role, slack_id) values (%s, %s, %s, %s);'
		cursor.execute(sql, (user.account_name, user.contribution, user.role, user.slack_id))
		connector.commit()

		#DBに保存したユーザのユーザIDを返す
		sql = 'select max(user_id) from users;'
		cursor.execute(sql)
		sql_result = cursor.fetchall()
		dict = sql_result[0]

	json_response = { "user_id" : dict["max(user_id)"] }
	return json_response


