from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, func
from sqlalchemy.ext.declarative import declarative_base
from enum import Enum as PyEnum


class TodoStatus(PyEnum):
    PENDING = "pending"  # 未着手
    IN_PROGRESS = "in_progress"  # 進行中
    COMPLETED = "completed"  # 完了


Base = declarative_base()


class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(TodoStatus), default=TodoStatus.PENDING)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )
