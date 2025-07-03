import React, { useState } from 'react';
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
  Button
} from '@mui/material';
import { 
  ExpandMore, 
  ExpandLess
} from '@mui/icons-material';

/**
 * TODO追加フォームコンポーネント
 * 
 * @param {Object} props
 * @param {Function} props.onAddTodo - TODO追加ハンドラ
 * @param {boolean} props.isLoading - 送信中フラグ（オプション）
 */
function TodoForm({ onAddTodo, isLoading = false }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      await onAddTodo(formData);
      // 成功時にフォームをリセット
      setFormData({
        title: '',
        description: '',
        status: 'pending'
      });
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error in TodoForm:', error);
      // エラーハンドリングは親コンポーネントで行う
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
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
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="タイトル"
              variant="outlined"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              disabled={isLoading}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="詳細"
              variant="outlined"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={isLoading}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>ステータス</InputLabel>
              <Select
                value={formData.status}
                label="ステータス"
                onChange={(e) => handleInputChange('status', e.target.value)}
                disabled={isLoading}
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
              disabled={isLoading || !formData.title.trim()}
              sx={{ mr: 1 }}
            >
              {isLoading ? '追加中...' : 'TODOを追加'}
            </Button>
            
            <Button 
              type="button" 
              variant="outlined" 
              color="error"
              onClick={() => setIsFormOpen(false)}
              disabled={isLoading}
            >
              キャンセル
            </Button>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}

export default TodoForm;
