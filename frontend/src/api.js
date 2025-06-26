import axios from "axios";

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json'
    }
});

//TODOの作成
export const createTodo = (todoData) => {
    return apiClient.post('api/todos/',todoData);
}

//TODOの取得
export const readTodos = () => {
    return apiClient.get('/api/todos');
}

export const readTodo = (id) => {
    return apiClient.get(`/api/todos/${id}`);
}

//TODOの更新
export const updateTodo = (id,todoData) => {
    return apiClient.put(`/api/todos/${id}`,todoData);
}

//TODOの削除
export const deleteTodo = (id,todoData) => {
    return apiClient.delete(`/api/todos/${id}`,todoData);
}

//ステータス別TODO表示
export const readTodoByStatus = (todoStatus) => {
    return apiClient.get(`/api/todos/status/${todoStatus}`);
}

//Todo検索
export const searchTodo = (searchTerm) => {
    return apiClient.get(`/api/todos/search/${searchTerm}`);
}

//統計情報表示
export const getTodoStats = () => {
    return apiClient.get('/api/todos/stats/count');
}