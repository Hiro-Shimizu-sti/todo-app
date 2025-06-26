from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import text

from . import crud, models, schemas, database

app = FastAPI(title="Todo API", description="シンプルなTodo管理API", version="1.0.0")

# CORSミドルウェアの設定（Reactからのアクセスを許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# データベースの初期化
models.Base.metadata.create_all(bind=database.engine)


# ルートエンドポイント
@app.get("/")
def read_root():
    return {"message": "Todo API is running!"}


# データベース接続確認
@app.get("/api/health")
def health_check(db: Session = Depends(database.get_db)):
    try:
        # 簡単なクエリを実行してDB接続を確認
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Database connection failed: {str(e)}"
        )


# === Todo CRUD エンドポイント ===


# 1. Todo作成
@app.post("/api/todos/", response_model=schemas.TodoInDB)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(database.get_db)):
    """新しいTodoを作成する"""
    return crud.create_todo(db=db, todo=todo)


# 2. Todo一覧取得
@app.get("/api/todos/", response_model=List[schemas.TodoInDB])
def read_todos(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    """Todo一覧を取得する（ページネーション対応）"""
    todos = crud.get_todos(db, skip=skip, limit=limit)
    return todos


# 3. Todo単体取得
@app.get("/api/todos/{todo_id}", response_model=schemas.TodoInDB)
def read_todo(todo_id: int, db: Session = Depends(database.get_db)):
    """IDでTodoを1件取得する"""
    db_todo = crud.get_todo(db, todo_id=todo_id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return db_todo


# 4. Todo更新
@app.put("/api/todos/{todo_id}", response_model=schemas.TodoInDB)
def update_todo(
    todo_id: int, todo: schemas.TodoUpdate, db: Session = Depends(database.get_db)
):
    """Todoを更新する"""
    db_todo = crud.update_todo(db, todo_id=todo_id, todo_update=todo)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return db_todo


# 5. Todo削除
@app.delete("/api/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(database.get_db)):
    """Todoを削除する"""
    success = crud.delete_todo(db, todo_id=todo_id)
    if not success:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo deleted successfully"}


# === 追加機能のエンドポイント ===


# 6. ステータス別Todo取得
@app.get("/api/todos/status/{status}", response_model=List[schemas.TodoInDB])
def read_todos_by_status(
    status: models.TodoStatus, db: Session = Depends(database.get_db)
):
    """指定したステータスのTodoを取得する"""
    todos = crud.get_todos_by_status(db, status=status)
    return todos


# 7. Todo検索
@app.get("/api/todos/search/{search_term}", response_model=List[schemas.TodoInDB])
def search_todos(search_term: str, db: Session = Depends(database.get_db)):
    """タイトルまたは説明でTodoを検索する"""
    todos = crud.search_todos(db, search_term=search_term)
    return todos


# 8. 統計情報取得
@app.get("/api/todos/stats/count")
def get_todo_stats(db: Session = Depends(database.get_db)):
    """Todo統計情報を取得する"""
    total_count = crud.get_todos_count(db)
    status_counts = crud.get_todos_count_by_status(db)

    return {"total": total_count, "by_status": status_counts}
