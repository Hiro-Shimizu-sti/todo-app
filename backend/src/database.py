from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# docker-compose.ymlで設定した環境変数を読み込む
DATABASE_URL = os.getenv(
    "DATABASE_URL", "mysql+mysqlconnector://root:password@db:3306/mydatabase"
)

# データベースエンジンを作成
engine = create_engine(DATABASE_URL)

# データベースセッションを作成するためのクラス
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# SQLAlchemyモデル（テーブル定義）の基底クラスを作成
Base = declarative_base()


# FastAPIのエンドポイントでDBセッションを取得するための依存関係
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
