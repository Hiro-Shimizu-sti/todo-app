import React,{useState, useEffect} from "react";
import * as api from "./api";

function App() {
  const [todos, setTodos] = useState([]); // TODOリストの状態を管理
  const [newTodoTitle, setNewTodoTitle] = useState(''); // タイトル入力フォームの状態を管理
  const [newTodoDescription, setNewTodoDescription] = useState(''); // 詳細入力フォームの状態を管理
  const [newTodoStatus, setNewTodoStatus] = useState('pending'); // ステータス選択の状態を管理

  // このコンポーネントが最初に表示されたときに、APIからTODOリストを取得する
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await api.readTodos();
      setTodos(response.data); // 取得したデータで状態を更新
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // 新しいTODOを追加する処理
  const handleAddTodo = async (e) => {
    e.preventDefault(); // フォームのデフォルト送信を防ぐ
    if (!newTodoTitle.trim()) return; // 空の場合は何もしない

    try {
      await api.createTodo({ 
        title: newTodoTitle, 
        description: newTodoDescription,
        status: newTodoStatus 
      });
      setNewTodoTitle(''); // タイトル入力フォームを空にする
      setNewTodoDescription(''); // 詳細入力フォームを空にする
      setNewTodoStatus('pending'); // ステータスをデフォルトに戻す
      fetchTodos(); // TODOリストを再取得して画面を更新
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // TODOを削除する処理
  const handleDeleteTodo = async (id) => {
    try {
      await api.deleteTodo(id);
      fetchTodos(); // TODOリストを再取得
    } catch (error)
    {
      console.error("Error deleting todo:", error);
    }
  };

  // TODOの状態を更新する処理（ステータス選択）
  const handleToggleStatus = async (todo, newStatus) => {
      try {
          await api.updateTodo(todo.id, { ...todo, status: newStatus });
          fetchTodos(); // TODOリストを再取得
      } catch (error) {
          console.error("Error updating todo:", error);
      }
  };

  return (
    <div className="App">
      <h1>TODO App</h1>
      
      {/* TODO追加フォーム */}
      <form onSubmit={handleAddTodo}>
        <div>
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="タイトル"
            required
          />
        </div>
        <div>
          <textarea
            value={newTodoDescription}
            onChange={(e) => setNewTodoDescription(e.target.value)}
            placeholder="詳細"
            rows="3"
          />
        </div>
        <div>
          <select
            value={newTodoStatus}
            onChange={(e) => setNewTodoStatus(e.target.value)}
          >
            <option value="pending">未着手</option>
            <option value="in_progress">進行中</option>
            <option value="completed">完了</option>
          </select>
        </div>
        <button type="submit">TODOを追加</button>
      </form>

      {/* TODOリスト */}
      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <div>
              <strong>{todo.title}</strong>
              <span style={{ 
                marginLeft: '10px', 
                padding: '3px 8px', 
                borderRadius: '3px',
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
              <div style={{ marginTop: '5px', color: '#666' }}>
                {todo.description}
              </div>
            )}
            <div style={{ marginTop: '10px' }}>
              <select
                value={todo.status}
                onChange={(e) => handleToggleStatus(todo, e.target.value)}
                style={{ marginRight: '10px' }}
              >
                <option value="pending">未着手</option>
                <option value="in_progress">進行中</option>
                <option value="completed">完了</option>
              </select>
              <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;