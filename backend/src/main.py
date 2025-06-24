from fastapi import FastAPI
import mysql.connector
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORSミドルウェアの設定（Reactからのアクセスを許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    # 環境変数からデータベース接続情報を取得
    db_url = os.environ.get("DATABASE_URL")
    # mysqlconnectorのURL形式に合わせる
    # "mysql+mysqlconnector://user:password@host:port/database"
    # ここでは単純化のため直接記述
    try:
        conn = mysql.connector.connect(
            user="root",
            password="password",
            host="db", # docker-compose.ymlで定義したサービス名
            port=3306,
            database="mydatabase"
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

@app.get("/api/db-check")
def db_check():
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute("SELECT VERSION();")
        db_version = cursor.fetchone()
        cursor.close()
        conn.close()
        return {"db_status": "connected", "db_version": db_version[0]}
    else:
        return {"db_status": "connection_failed"}
