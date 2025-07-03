import React from 'react';
import {
  Typography,
  Button,
  Container,
  Paper,
  Stack,
  Alert,
  CircularProgress,
  Fade
} from '@mui/material';
import {
  ArrowBack,
} from '@mui/icons-material';

import TodoDetailHeader from './TodoDetailHeader';
import TodoDetailEdit from './TodoDetailEdit';
import TodoDetailView from './TodoDetailView';
import { useTodoDetail } from '../hooks/useTodoDetail';

function TodoDetail() {
  const {
    todo,
    loading,
    saving,
    error,
    isEditing,
    editForm,
    setError,
    setEditForm,
    //fetchTodoDetail,
    handleEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleDelete,
    navigate
  } = useTodoDetail();
  // const { id } = useParams();
  // const navigate = useNavigate();
  // const [todo, setTodo] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [saving, setSaving] = useState(false);
  // const [error, setError] = useState(null);
  // const [isEditing, setIsEditing] = useState(false);
  // const [editForm, setEditForm] = useState({
  //   title: '',
  //   description: '',
  //   status: 'pending'
  // });

  // const fetchTodoDetail = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const response = await api.readTodo(id);
  //     setTodo(response.data);
  //     setEditForm({
  //       title: response.data.title,
  //       description: response.data.description || '',
  //       status: response.data.status
  //     });
  //     setError(null);
  //   } catch (error) {
  //     console.error('Error fetching todo detail:', error);
  //     setError('TODOの詳細を取得できませんでした。');
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [id]);

  // useEffect(() => {
  //   fetchTodoDetail();
  // }, [fetchTodoDetail]);

  // const handleEdit = () => {
  //   setIsEditing(true);
  // };

  // const handleCancelEdit = () => {
  //   // 変更がある場合は確認ダイアログを表示
  //   const hasChanges = 
  //     editForm.title !== todo.title ||
  //     editForm.description !== (todo.description || '') ||
  //     editForm.status !== todo.status;

  //   if (hasChanges && !window.confirm('変更を破棄しますか？')) {
  //     return;
  //   }

  //   setIsEditing(false);
  //   setEditForm({
  //     title: todo.title,
  //     description: todo.description || '',
  //     status: todo.status
  //   });
  // };

  // const handleSaveEdit = async (e) => {
  //   e.preventDefault();
  //   if (!editForm.title.trim()) {
  //     setError('タイトルは必須です。');
  //     return;
  //   }

  //   try {
  //     setSaving(true);
  //     await api.updateTodo(id, editForm);
  //     setTodo({ ...todo, ...editForm, updated_at: new Date().toISOString() });
  //     setIsEditing(false);
  //     setError(null);
  //   } catch (error) {
  //     console.error('Error updating todo:', error);
  //     setError('TODOの更新に失敗しました。');
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  // const handleDelete = async () => {
  //   if (window.confirm('このTODOを削除しますか？')) {
  //     try {
  //       await api.deleteTodo(id);
  //       navigate('/');
  //     } catch (error) {
  //       console.error('Error deleting todo:', error);
  //       setError('TODOの削除に失敗しました。');
  //     }
  //   }
  // };

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

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          startIcon={<ArrowBack />}
        >
          一覧に戻る
        </Button>
      </Container>
    );
  }

  if (!todo) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          TODOが見つかりませんでした。
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          startIcon={<ArrowBack />}
        >
          一覧に戻る
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* ヘッダーエリア */}
        <TodoDetailHeader
          navigate={navigate}
          isEditing={isEditing}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />

        {/* エラー表示 */}
        {error && (
          <Fade in={!!error}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Fade>
        )}

        {/* メインコンテンツ */}
        <Paper
          elevation={isEditing ? 4 : 2}
          sx={{
            p: 4,
            backgroundColor: isEditing ? '#fafafa' : 'white',
            border: isEditing ? '2px solid #1976d2' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          {isEditing ? (
            // 編集モード
            <TodoDetailEdit
              editForm={editForm}
              saving={saving}
              setEditForm={setEditForm}
              handleSaveEdit={handleSaveEdit}
              handleCancelEdit={handleCancelEdit}
            />
          ) : (
            // 表示モード
            <TodoDetailView todo={todo} />
          )}
        </Paper>
      </Stack>
    </Container>
  );
}

export default TodoDetail;
