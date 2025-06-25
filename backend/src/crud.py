from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional, Dict


# Create - Todo作成
def create_todo(db: Session, todo: schemas.TodoCreate) -> models.Todo:
    """新しいTodoを作成する"""
    db_todo = models.Todo(
        title=todo.title, description=todo.description, status=todo.status
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)  # DBから最新データを取得（id, created_at, updated_atを含む）
    return db_todo


# Read - 単体取得
def get_todo(db: Session, todo_id: int) -> Optional[models.Todo]:
    """IDでTodoを1件取得する"""
    return db.query(models.Todo).filter(models.Todo.id == todo_id).first()


# Read - 一覧取得
def get_todos(db: Session, skip: int = 0, limit: int = 100) -> List[models.Todo]:
    """Todoの一覧を取得する（ページネーション対応）"""
    return db.query(models.Todo).offset(skip).limit(limit).all()


# Read - ステータス絞り込み
def get_todos_by_status(db: Session, status: models.TodoStatus) -> List[models.Todo]:
    """指定したステータスのTodoを取得する"""
    return db.query(models.Todo).filter(models.Todo.status == status).all()


# Update - Todo更新
def update_todo(
    db: Session, todo_id: int, todo_update: schemas.TodoUpdate
) -> Optional[models.Todo]:
    """Todoを更新する"""
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if db_todo is None:
        return None

    # 送信されたフィールドのみ更新
    update_data = todo_update.model_dump(
        exclude_unset=True
    )  # Noneでないフィールドのみ取得
    for field, value in update_data.items():
        setattr(db_todo, field, value)

    db.commit()
    db.refresh(db_todo)
    return db_todo


# Delete - Todo削除
def delete_todo(db: Session, todo_id: int) -> bool:
    """Todoを削除する"""
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if db_todo is None:
        return False

    db.delete(db_todo)
    db.commit()
    return True


# その他の便利な関数


# 検索機能
def search_todos(db: Session, search_term: str) -> List[models.Todo]:
    """タイトルまたは説明で検索する"""
    return (
        db.query(models.Todo)
        .filter(
            (models.Todo.title.contains(search_term))
            | (models.Todo.description.contains(search_term))
        )
        .all()
    )


# 件数取得
def get_todos_count(db: Session) -> int:
    """Todoの総件数を取得する"""
    return db.query(models.Todo).count()


# ステータス別件数
def get_todos_count_by_status(db: Session) -> Dict[str, int]:
    """ステータス別の件数を取得する"""
    from sqlalchemy import func

    result = (
        db.query(models.Todo.status, func.count(models.Todo.id).label("count"))
        .group_by(models.Todo.status)
        .all()
    )

    return {status.value: count for status, count in result}
