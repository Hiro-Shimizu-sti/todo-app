import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';

// カスタムコンポーネント
import SearchAndFilter from './SearchAndFilter';
import TodoForm from './TodoForm';
import TodoStats from './TodoStats';
import TodoListView from './TodoListView';

// カスタムフック
import { useTodos, useTodoFilters } from '../hooks/useTodos';

/**
 * TODOリストのメインコンポーネント
 * 各子コンポーネントを組み合わせて全体のレイアウトを管理
 */
function TodoList() {
  const navigate = useNavigate();
  
  // カスタムフックでデータとロジックを管理
  const {
    todos,
    loading,
    error,
    setError,
    addTodo,
    deleteTodo,
    updateTodoStatus
  } = useTodos();

  const {
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    filteredTodos,
    clearFilters
  } = useTodoFilters(todos);

  // イベントハンドラー
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleTodoClick = (todoId) => {
    navigate(`/todo/${todoId}`);
  };

  const handleAddTodo = async (todoData) => {
    const result = await addTodo(todoData);
    if (!result.success) {
      throw result.error; // TodoFormでキャッチされる
    }
  };

  // ローディング状態
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          読み込み中...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* ページタイトル */}
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        TODO管理アプリ
      </Typography>
      
      {/* エラー表示 */}
      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError(null)} 
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}
      
      {/* 検索・フィルター */}
      <SearchAndFilter
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        onClear={clearFilters}
      />
      
      {/* TODO追加フォーム */}
      <TodoForm onAddTodo={handleAddTodo} />
      
      {/* 統計表示 */}
      <TodoStats
        totalCount={todos.length}
        filteredCount={filteredTodos.length}
        statusFilter={statusFilter}
        searchTerm={searchTerm}
      />

      {/* TODOリスト */}
      <TodoListView
        todos={filteredTodos}
        totalCount={todos.length}
        onStatusChange={updateTodoStatus}
        onDelete={deleteTodo}
        onItemClick={handleTodoClick}
      />
    </Container>
  );
}

export default TodoList;
