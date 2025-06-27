import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';

function TodoList() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoStatus, setNewTodoStatus] = useState('pending');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await api.readTodos();
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const fetchTodosByStatus = async (status) => {
    try {
      const response = await api.readTodoByStatus(status);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos by status:", error);
    }
  };

  const searchTodos = async (searchTerm) => {
    try {
      const response = await api.searchTodo(searchTerm);
      setTodos(response.data);
    } catch (error) {
      console.error("Error searching todos:", error);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      await api.createTodo({ 
        title: newTodoTitle, 
        description: newTodoDescription,
        status: newTodoStatus 
      });
      setNewTodoTitle('');
      setNewTodoDescription('');
      setNewTodoStatus('pending');
      fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await api.deleteTodo(id);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleToggleStatus = async (todo, newStatus) => {
    try {
      await api.updateTodo(todo.id, { ...todo, status: newStatus });
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleStatusFilterChange = (e) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);
    
    if (selectedStatus === 'all') {
      fetchTodos();
    } else {
      fetchTodosByStatus(selectedStatus);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchTodos();
      return;
    }
    await searchTodos(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setStatusFilter('all');
    fetchTodos();
  };

  const handleTodoClick = (todoId) => {
    navigate(`/todo/${todoId}`);
  };

  return (
    <div>
      <h1>TODO App</h1>
      
      {/* 検索・フィルター機能 */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        <h3>検索・フィルター</h3>
        
        {/* 検索フォーム */}
        <form onSubmit={handleSearch} style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="TODOを検索..."
            style={{ marginRight: '10px', padding: '5px', width: '300px' }}
          />
          <button type="button" onClick={handleClearSearch} style={{ marginLeft: '10px' }}>
            クリア
          </button>
        </form>

        {/* ステータスフィルター */}
        <div>
          <label style={{ marginRight: '10px' }}>ステータス：</label>
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            style={{ padding: '5px' }}
          >
            <option value="all">すべて</option>
            <option value="pending">未着手</option>
            <option value="in_progress">進行中</option>
            <option value="completed">完了</option>
          </select>
        </div>
      </div>
      
      {/* TODO追加フォーム */}
      <form onSubmit={handleAddTodo} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>新しいTODOを追加</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="タイトル"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <textarea
            value={newTodoDescription}
            onChange={(e) => setNewTodoDescription(e.target.value)}
            placeholder="詳細"
            rows="3"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <select
            value={newTodoStatus}
            onChange={(e) => setNewTodoStatus(e.target.value)}
            style={{ padding: '8px' }}
          >
            <option value="pending">未着手</option>
            <option value="in_progress">進行中</option>
            <option value="completed">完了</option>
          </select>
        </div>
        <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}>
          TODOを追加
        </button>
      </form>

      {/* TODOリスト表示数の情報 */}
      <div style={{ marginBottom: '10px', color: '#666' }}>
        表示中のTODO: {todos.length}件
        {statusFilter !== 'all' && (
          <span> (ステータス: {
            statusFilter === 'pending' ? '未着手' : 
            statusFilter === 'in_progress' ? '進行中' : '完了'
          })</span>
        )}
        {searchTerm && (
          <span> (検索: "{searchTerm}")</span>
        )}
      </div>

      {/* TODOリスト */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ marginBottom: '15px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#ffffff' }}>
            <div style={{ cursor: 'pointer' }} onClick={() => handleTodoClick(todo.id)}>
              <div style={{ marginBottom: '8px' }}>
                <strong style={{ fontSize: '18px', color: '#333' }}>{todo.title}</strong>
                <span style={{ 
                  marginLeft: '10px', 
                  padding: '4px 12px', 
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: 
                    todo.status === 'completed' ? '#d4edda' : 
                    todo.status === 'in_progress' ? '#fff3cd' : '#f8d7da',
                  color: 
                    todo.status === 'completed' ? '#155724' : 
                    todo.status === 'in_progress' ? '#856404' : '#721c24'
                }}>
                  {todo.status === 'pending' ? '未着手' : 
                   todo.status === 'in_progress' ? '進行中' : '完了'}
                </span>
              </div>
              {todo.description && (
                <div style={{ marginBottom: '10px', color: '#666', fontSize: '14px' }}>
                  {todo.description.length > 100 ? `${todo.description.substring(0, 100)}...` : todo.description}
                </div>
              )}
              <div style={{ fontSize: '12px', color: '#999' }}>
                クリックして詳細を表示
              </div>
            </div>
            <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <select
                value={todo.status}
                onChange={(e) => {
                  e.stopPropagation();
                  handleToggleStatus(todo, e.target.value);
                }}
                style={{ marginRight: '10px', padding: '4px' }}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="pending">未着手</option>
                <option value="in_progress">進行中</option>
                <option value="completed">完了</option>
              </select>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTodo(todo.id);
                }}
                style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px' }}
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          TODOが見つかりませんでした。
        </div>
      )}
    </div>
  );
}

export default TodoList;
