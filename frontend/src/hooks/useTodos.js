import { useState, useEffect, useMemo } from 'react';
import * as api from '../api';

/**
 * TODO管理のカスタムフック
 * ビジネスロジックとデータ操作を担当
 */
export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODOリストを取得
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.readTodos();
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setError("TODOの取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  // TODO追加
  const addTodo = async (todoData) => {
    try {
      await api.createTodo(todoData);
      await fetchTodos(); // リストを再取得
      return { success: true };
    } catch (error) {
      console.error("Error adding todo:", error);
      setError("TODOの追加に失敗しました。");
      return { success: false, error };
    }
  };

  // TODO削除
  const deleteTodo = async (id) => {
    try {
      await api.deleteTodo(id);
      await fetchTodos(); // リストを再取得
      return { success: true };
    } catch (error) {
      console.error("Error deleting todo:", error);
      setError("TODOの削除に失敗しました。");
      return { success: false, error };
    }
  };

  // TODOステータス更新
  const updateTodoStatus = async (todo, newStatus) => {
    try {
      await api.updateTodo(todo.id, { ...todo, status: newStatus });
      await fetchTodos(); // リストを再取得
      return { success: true };
    } catch (error) {
      console.error("Error updating todo:", error);
      setError("TODOの更新に失敗しました。");
      return { success: false, error };
    }
  };

  // 初回ロード
  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    loading,
    error,
    setError,
    addTodo,
    deleteTodo,
    updateTodoStatus,
    refetch: fetchTodos
  };
}

/**
 * TODO フィルタリング・検索のカスタムフック
 */
export function useTodoFilters(todos) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // フィルタリング・ソート済みのTODOリスト
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      // ステータスフィルター
      const statusMatch = statusFilter === 'all' || todo.status === statusFilter;
      
      // 検索フィルター（タイトルと説明文を対象）
      const searchMatch = !searchTerm.trim() || 
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return statusMatch && searchMatch;
    }).sort((a, b) => {
      // 更新日時優先、なければ作成日時
      const dateA = new Date(a.updated_at || a.created_at || 0);
      const dateB = new Date(b.updated_at || b.created_at || 0);
      return dateB - dateA; // 降順（新しい順）
    });
  }, [todos, statusFilter, searchTerm]);

  // 検索・フィルターのクリア
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return {
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    filteredTodos,
    clearFilters
  };
}
