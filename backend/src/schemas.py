from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional
from .model import TodoStatus


class TodoBase(BaseModel):
    title: str = Field(
        ...,
        min_length=1,
        max_length=255,
        strip_whitespace=True,  # 空文字列は許可しない
        description="タイトル（1文字以上255文字以内）",
    )
    description: Optional[str] = Field(
        None, max_length=1000, description="説明（1000文字以内）"
    )
    status: TodoStatus = Field(
        ..., description="ステータス（未着手/進行中/完了から選択）"
    )


class TodoCreate(TodoBase):
    pass


class TodoUpdate(BaseModel):
    title: Optional[str] = Field(
        None,
        min_length=1,
        max_length=255,
        strip_whitespace=True,
        description="タイトル（1文字以上255文字以内）",
    )
    description: Optional[str] = Field(
        None, max_length=1000, description="説明（1000文字以内）"
    )
    status: Optional[TodoStatus] = Field(
        None, description="ステータス（未着手/進行中/完了から選択）"
    )


class TodoInDB(TodoBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
