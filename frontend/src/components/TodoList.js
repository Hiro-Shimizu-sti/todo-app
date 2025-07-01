import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Collapse, 
  IconButton, 
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Container,
  Paper,
  Chip,
  Divider,
  Alert,
  Stack
} from '@mui/material';
import { 
  ExpandMore, 
  ExpandLess, 
  Search, 
  Clear, 
  Delete
} from '@mui/icons-material';
import * as api from '../api';

function TodoList() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoStatus, setNewTodoStatus] = useState('pending');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false); // フォームの開閉状態

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
      setIsFormOpen(false); // フォームを閉じる
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
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  // フィルタリング＆ソートされたTODOリストを取得（シンプル版）
  const filteredTodos = todos.filter(todo => {
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

  const handleTodoClick = (todoId) => {
    navigate(`/todo/${todoId}`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        TODO管理アプリ
      </Typography>
      
      {/* 検索・フィルター機能 */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          検索・フィルター
        </Typography>
        
        <Stack spacing={2}>
          {/* 検索フォーム */}
          <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 1 }}>
            <TextField
              fullWidth
              label="TODOを検索"
              variant="outlined"
              //size="medium"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="リアルタイム検索"
              InputProps={{
                startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
              }}
            />
            <Button 
              variant="outlined" 
              onClick={handleClearSearch}
              startIcon={<Clear />}
              //size="medium"
              color = "error"
              sx={{ 
                whiteSpace: 'nowrap',
                minWidth: 'auto',
                px: 2
              }}
            >
              クリア
            </Button>
          </Box>

          {/* ステータスフィルター */}
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>ステータス</InputLabel>
            <Select
              value={statusFilter}
              label="ステータス"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="all">すべて</MenuItem>
              <MenuItem value="pending">未着手</MenuItem>
              <MenuItem value="in_progress">進行中</MenuItem>
              <MenuItem value="completed">完了</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>
      
      {/* TODO追加フォーム */}
      <Card sx={{ marginBottom: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="h3">
              新しいTODOを追加
            </Typography>
            <IconButton
              onClick={() => setIsFormOpen(!isFormOpen)}
              aria-expanded={isFormOpen}
              aria-label="フォームを開く"
            >
              {isFormOpen ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          
          <Collapse in={isFormOpen} timeout="auto" unmountOnExit>
            <Box component="form" onSubmit={handleAddTodo} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="タイトル"
                variant="outlined"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="詳細"
                variant="outlined"
                multiline
                rows={3}
                value={newTodoDescription}
                onChange={(e) => setNewTodoDescription(e.target.value)}
                sx={{ mb: 2 }}
              />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>ステータス</InputLabel>
                <Select
                  value={newTodoStatus}
                  label="ステータス"
                  onChange={(e) => setNewTodoStatus(e.target.value)}
                >
                  <MenuItem value="pending">未着手</MenuItem>
                  <MenuItem value="in_progress">進行中</MenuItem>
                  <MenuItem value="completed">完了</MenuItem>
                </Select>
              </FormControl>
              
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                sx={{ mr: 1 }}
              >
                TODOを追加
              </Button>
              
              <Button 
                type="button" 
                variant="outlined" 
                color = "error"
                onClick={() => setIsFormOpen(false)}
              >
                キャンセル
              </Button>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* TODOリスト表示数の情報 */}
      <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          表示中のTODO: <strong>{filteredTodos.length}件</strong> (全{todos.length}件中)
          {statusFilter !== 'all' && (
            <Chip 
              label={`ステータス: ${
                statusFilter === 'pending' ? '未着手' : 
                statusFilter === 'in_progress' ? '進行中' : '完了'
              }`}
              size="small"
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
          {searchTerm && (
            <Chip 
              label={`検索: "${searchTerm}"`}
              size="small"
              color="secondary"
              sx={{ ml: 1 }}
            />
          )}
        </Typography>
      </Box>

      {/* TODOリスト */}
      <Stack spacing={2}>
        {filteredTodos.map(todo => (
          <Card 
            key={todo.id} 
            elevation={2}
            sx={{ 
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                elevation: 4,
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardContent>
              <Box onClick={() => handleTodoClick(todo.id)}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
                    {todo.title}
                  </Typography>
                  <Chip
                    label={
                      todo.status === 'pending' ? '未着手' : 
                      todo.status === 'in_progress' ? '進行中' : '完了'
                    }
                    color={
                      todo.status === 'completed' ? 'success' : 
                      todo.status === 'in_progress' ? 'warning' : 'error'
                    }
                  />
                </Box>
                
                {todo.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {todo.description.length > 100 ? 
                      `${todo.description.substring(0, 100)}...` : 
                      todo.description
                    }
                  </Typography>
                )}
                
                <Typography variant="caption" color="text.secondary">
                  クリックして詳細を表示
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>ステータス</InputLabel>
                  <Select
                    value={todo.status}
                    label="ステータス"
                    onChange={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(todo, e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MenuItem value="pending">未着手</MenuItem>
                    <MenuItem value="in_progress">進行中</MenuItem>
                    <MenuItem value="completed">完了</MenuItem>
                  </Select>
                </FormControl>
                
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<Delete />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTodo(todo.id);
                  }}
                >
                  削除
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {filteredTodos.length === 0 && todos.length > 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          条件に一致するTODOが見つかりませんでした。
        </Alert>
      )}

      {todos.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          TODOがありません。新しいTODOを追加してください。
        </Alert>
      )}
    </Container>
  );
}

export default TodoList;
