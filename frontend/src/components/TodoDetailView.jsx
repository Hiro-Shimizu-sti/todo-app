import React from 'react';
import {
    Box,
    Typography,
    Chip,
    Stack,
    Divider,
    Card,
    CardContent,
} from '@mui/material';
import {
    Schedule,
    Update,
    Description
} from '@mui/icons-material';

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

function TodoDetailView({ todo }) {
    return (
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
    )
}

export default TodoDetailView;