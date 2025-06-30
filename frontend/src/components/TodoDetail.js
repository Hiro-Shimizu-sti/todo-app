import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../api';

function TodoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    status: 'pending'
  });

  const fetchTodoDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.readTodo(id);
      setTodo(response.data);
      setEditForm({
        title: response.data.title,
        description: response.data.description || '',
        status: response.data.status
      });
      setError(null);
    } catch (error) {
      console.error('Error fetching todo detail:', error);
      setError('TODOの詳細を取得できませんでした。');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTodoDetail();
  }, [fetchTodoDetail]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      title: todo.title,
      description: todo.description || '',
      status: todo.status
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.updateTodo(id, editForm);
      setTodo({ ...todo, ...editForm });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('TODOの更新に失敗しました。');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('このTODOを削除しますか？')) {
      try {
        await api.deleteTodo(id);
        navigate('/');
      } catch (error) {
        console.error('Error deleting todo:', error);
        setError('TODOの削除に失敗しました。');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return { backgroundColor: '#d4edda', color: '#155724' };
      case 'in_progress':
        return { backgroundColor: '#fff3cd', color: '#856404' };
      default:
        return { backgroundColor: '#f8d7da', color: '#721c24' };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return '未着手';
      case 'in_progress':
        return '進行中';
      case 'completed':
        return '完了';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>
        <button onClick={() => navigate('/')}>一覧に戻る</button>
      </div>
    );
  }

  if (!todo) {
    return (
      <div style={{ padding: '20px' }}>
        <p>TODOが見つかりませんでした。</p>
        <button onClick={() => navigate('/')}>一覧に戻る</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => navigate('/')} style={{ marginRight: '10px' }}>
          ← 一覧に戻る
        </button>
        {!isEditing && (
          <>
            <button onClick={handleEdit} style={{ marginRight: '10px' }}>
              編集
            </button>
            <button onClick={handleDelete} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px' }}>
              削除
            </button>
          </>
        )}
      </div>

      {isEditing ? (
        <div>
          <h2>TODO編集</h2>
          <form onSubmit={handleSaveEdit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                タイトル:
              </label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', fontSize: '16px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                詳細:
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows="5"
                style={{ width: '100%', padding: '8px', fontSize: '16px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                ステータス:
              </label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                style={{ padding: '8px', fontSize: '16px' }}
              >
                <option value="pending">未着手</option>
                <option value="in_progress">進行中</option>
                <option value="completed">完了</option>
              </select>
            </div>

            <div>
              <button type="submit" style={{ marginRight: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', padding: '8px 16px' }}>
                保存
              </button>
              <button type="button" onClick={handleCancelEdit} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '8px 16px' }}>
                キャンセル
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <h2 style={{ marginBottom: '20px' }}>TODO詳細</h2>
          
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f9f9f9' }}>
            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{todo.title}</h3>
              <span style={{ 
                padding: '5px 12px', 
                borderRadius: '15px',
                fontSize: '14px',
                fontWeight: 'bold',
                ...getStatusColor(todo.status)
              }}>
                {getStatusText(todo.status)}
              </span>
            </div>

            {todo.description && (
              <div style={{ marginBottom: '15px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>詳細:</h4>
                <div style={{ 
                  backgroundColor: 'white', 
                  padding: '15px', 
                  borderRadius: '5px', 
                  border: '1px solid #e0e0e0',
                  whiteSpace: 'pre-wrap'
                }}>
                  {todo.description}
                </div>
              </div>
            )}

            {todo.created_at && (
              <div style={{ marginBottom: '15px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>作成日時:</h4>
                <span>{new Date(todo.created_at).toLocaleString('ja-JP')}</span>
              </div>
            )}

            {todo.updated_at && (
              <div>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>更新日時:</h4>
                <span>{new Date(todo.updated_at).toLocaleString('ja-JP')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoDetail;
