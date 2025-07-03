import React from 'react';
import {
    Box,
    Typography,
    Button,
    Stack,
    ButtonGroup,
} from '@mui/material';
import {
    Delete,
    ArrowBack,
    Edit,
    Assignment,
} from '@mui/icons-material';

function TodoDetailHeader({navigate, isEditing, handleEdit, handleDelete}) {
    return (
        <Box elevation={1} sx={{ p: 2 }}>
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
    )
}

export default TodoDetailHeader;