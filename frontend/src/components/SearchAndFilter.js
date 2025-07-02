import React from 'react';
import { 
  Box, 
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack
} from '@mui/material';
import { Typography } from '@mui/material';
import { 
  Search, 
  Clear
} from '@mui/icons-material';

/**
 * 検索・フィルター機能コンポーネント
 * 
 * @param {Object} props
 * @param {string} props.searchTerm - 検索キーワード
 * @param {string} props.statusFilter - ステータスフィルター
 * @param {Function} props.onSearchChange - 検索キーワード変更ハンドラ
 * @param {Function} props.onStatusFilterChange - ステータスフィルター変更ハンドラ
 * @param {Function} props.onClear - クリアボタンハンドラ
 */
function SearchAndFilter({ 
  searchTerm, 
  statusFilter, 
  onSearchChange, 
  onStatusFilterChange, 
  onClear 
}) {
  return (
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
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="リアルタイム検索"
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
            }}
          />
          <Button 
            variant="outlined" 
            onClick={onClear}
            startIcon={<Clear />}
            color="error"
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
            onChange={onStatusFilterChange}
          >
            <MenuItem value="all">すべて</MenuItem>
            <MenuItem value="pending">未着手</MenuItem>
            <MenuItem value="in_progress">進行中</MenuItem>
            <MenuItem value="completed">完了</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
}

export default SearchAndFilter;
