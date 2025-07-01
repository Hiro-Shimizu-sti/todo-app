import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
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
  Stack,
  ButtonGroup,
  Divider,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Fade
} from '@mui/material';
import { 
  Delete,
  ArrowBack,
  Edit,
  Save,
  Cancel,
  Schedule,
  Update,
  Assignment,
  Description
} from '@mui/icons-material';
import * as api from '../api';

function TodoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    
    // デバッグ用：ブラウザのタイムゾーン情報を表示
    console.log('=== ブラウザのタイムゾーン情報 ===');
    console.log('タイムゾーン:', Intl.DateTimeFormat().resolvedOptions().timeZone);
    console.log('現在時刻 (ローカル):', new Date().toString());
    console.log('現在時刻 (UTC):', new Date().toUTCString());
    console.log('現在時刻 (ISO):', new Date().toISOString());
    console.log('現在時刻 (ja-JP):', new Date().toLocaleString('ja-JP'));
    console.log('現在時刻 (ja-JP + Asia/Tokyo):', new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }));
  }, [fetchTodoDetail]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // 変更がある場合は確認ダイアログを表示
    const hasChanges = 
      editForm.title !== todo.title ||
      editForm.description !== (todo.description || '') ||
      editForm.status !== todo.status;

    if (hasChanges && !window.confirm('変更を破棄しますか？')) {
      return;
    }

    setIsEditing(false);
    setEditForm({
      title: todo.title,
      description: todo.description || '',
      status: todo.status
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) {
      setError('タイトルは必須です。');
      return;
    }

    try {
      setSaving(true);
      await api.updateTodo(id, editForm);
      setTodo({ ...todo, ...editForm, updated_at: new Date().toISOString() });
      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('TODOの更新に失敗しました。');
    } finally {
      setSaving(false);
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
        <Box elevation={1} sx={{ p: 2}}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assignment color="inherit" />
              TODO詳細
            </Typography>
            <ButtonGroup variant="outlined" size="medium">
              <Button onClick={() => navigate('/')} startIcon={<ArrowBack />}>
                一覧に戻る
              </Button>
              <Button 
                onClick={handleEdit} 
                disabled={isEditing} 
                startIcon={<Edit />}
                color="primary"
              >
                編集
              </Button>
              <Button 
                onClick={handleDelete} 
                color="error" 
                startIcon={<Delete />}
                disabled={isEditing}
              >
                削除
              </Button>
            </ButtonGroup>
          </Stack>
        </Box>

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
            <Fade in={isEditing}>
              <Box component="form" onSubmit={handleSaveEdit}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, color: '#1976d2' }}>
                  編集モード
                </Typography>
                
                <TextField
                  fullWidth
                  label="タイトル"
                  variant="outlined"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: <Assignment sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
                
                <TextField
                  fullWidth
                  label="詳細"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: <Description sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />
                  }}
                />
                
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <InputLabel>ステータス</InputLabel>
                  <Select
                    value={editForm.status}
                    label="ステータス"
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <MenuItem value="pending">未着手</MenuItem>
                    <MenuItem value="in_progress">進行中</MenuItem>
                    <MenuItem value="completed">完了</MenuItem>
                  </Select>
                </FormControl>
                
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    size="large"
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                    disabled={saving}
                    sx={{ minWidth: 120 }}
                  >
                    {saving ? '保存中...' : '保存'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outlined" 
                    onClick={handleCancelEdit}
                    size="large"
                    startIcon={<Cancel />}
                    disabled={saving}
                    sx={{ minWidth: 120 }}
                  >
                    キャンセル
                  </Button>
                </Stack>
              </Box>
            </Fade>
          ) : (
            // 表示モード
            <Stack spacing={3}>
              {/* タイトルとステータス */}
              <Box>
                <Typography variant="h4" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                  {todo.title}
                </Typography>
                <Chip 
                  label={getStatusText(todo.status)}
                  sx={{ 
                    ...getStatusColor(todo.status),
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: getStatusColor(todo.status).borderColor
                  }}
                  size="medium"
                />
              </Box>

              {/* 詳細 */}
              {todo.description && (
                <Card variant="outlined" sx={{ backgroundColor: '#f8f9fa' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Description color="inherit" />
                      詳細
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.7,
                        fontSize: '1.1rem'
                      }}
                    >
                      {todo.description}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              <Divider />

              {/* 日時情報 */}
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        作成日時
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {new Date(todo.created_at).toLocaleString('ja-JP', {
                          timeZone: 'Asia/Tokyo',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Update color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        更新日時
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {new Date(todo.updated_at).toLocaleString('ja-JP', {
                          timeZone: 'Asia/Tokyo',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          )}
        </Paper>
      </Stack>
    </Container>
  );
}

export default TodoDetail;
