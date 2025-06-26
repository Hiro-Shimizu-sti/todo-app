import React,{useState, useEffect} from "react";
import * as api from "./api";

function App() {
  const [todos, setTodos] = useState([]); // TODOリストの状態を管理
  const [newTodoTitle, setNewTodoTitle] = useState(''); // 入力フォームの状態を管理

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
      await api.createTodo({ title: newTodoTitle, status: false });
      setNewTodoTitle(''); // 入力フォームを空にする
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

  // TODOの状態を更新する処理（チェックボックス）
  const handleToggleStatus = async (todo) => {
      try {
          await api.updateTodo(todo.id, { ...todo, status: !todo.status });
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
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="New TODO"
        />
        <button type="submit">Add</button>
      </form>

      {/* TODOリスト */}
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input 
              type="checkbox"
              checked={todo.status}
              onChange={() => handleToggleStatus(todo)}
            />
            <span style={{ textDecoration: todo.status ? 'line-through' : 'none' }}>
              {todo.title}
            </span>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;