import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    CircularProgress,
    Stack
} from '@mui/material';
import {
    Save,
    Cancel,
    Assignment,
    Description
} from '@mui/icons-material';

function TodoDetailEdit({editForm,saving, setEditForm, handleSaveEdit, handleCancelEdit}) {
    return (
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
    )
}

export default TodoDetailEdit;