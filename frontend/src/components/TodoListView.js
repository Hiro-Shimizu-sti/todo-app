import React from 'react';
import { 
  Stack,
  Alert
} from '@mui/material';
import TodoItem from './TodoItem';

/**
 * TODOリストコンポーネント
 * 
 * @param {Object} props
 * @param {Array} props.todos - TODOリスト
 * @param {number} props.totalCount - 全TODO数
 * @param {Function} props.onStatusChange - ステータス変更ハンドラ
 * @param {Function} props.onDelete - 削除ハンドラ
 * @param {Function} props.onItemClick - アイテムクリックハンドラ
 */
function TodoListView({ todos, totalCount, onStatusChange, onDelete, onItemClick }) {
  // 空の状態を表示
  if (todos.length === 0 && totalCount > 0) {
    return (
      <Alert severity="info" sx={{ mt: 3 }}>
        条件に一致するTODOが見つかりませんでした。
      </Alert>
    );
  }

  if (totalCount === 0) {
    return (
      <Alert severity="info" sx={{ mt: 3 }}>
        TODOがありません。新しいTODOを追加してください。
      </Alert>
    );
  }

  return (
    <Stack spacing={2}>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onClick={onItemClick}
        />
      ))}
    </Stack>
  );
}

export default TodoListView;
