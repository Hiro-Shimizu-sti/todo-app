import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Divider
} from '@mui/material';
import { 
  Delete
} from '@mui/icons-material';

/**
 * 個別TODOアイテムコンポーネント
 * 
 * @param {Object} props
 * @param {Object} props.todo - TODOオブジェクト
 * @param {Function} props.onStatusChange - ステータス変更ハンドラ
 * @param {Function} props.onDelete - 削除ハンドラ
 * @param {Function} props.onClick - クリックハンドラ（詳細ページ遷移）
 */
function TodoItem({ todo, onStatusChange, onDelete, onClick }) {
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '未着手';
      case 'in_progress': return '進行中';
      case 'completed': return '完了';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'pending': return 'error';
      default: return 'default';
    }
  };

  const handleStatusChange = (e) => {
    e.stopPropagation();
    onStatusChange(todo, e.target.value);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`「${todo.title}」を削除しますか？`)) {
      onDelete(todo.id);
    }
  };

  const handleCardClick = () => {
    onClick(todo.id);
  };

  return (
    <Card 
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
        {/* クリック可能エリア（詳細画面遷移） */}
        <Box onClick={handleCardClick}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
              {todo.title}
            </Typography>
            <Chip
              label={getStatusText(todo.status)}
              color={getStatusColor(todo.status)}
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
        
        {/* 操作エリア（クリックイベント停止） */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>ステータス</InputLabel>
            <Select
              value={todo.status}
              label="ステータス"
              onChange={handleStatusChange}
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
            onClick={handleDelete}
          >
            削除
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default TodoItem;
