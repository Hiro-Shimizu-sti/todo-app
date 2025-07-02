import React from 'react';
import { 
  Box, 
  Chip,
  Typography
} from '@mui/material';

/**
 * TODO統計表示コンポーネント
 * 
 * @param {Object} props
 * @param {number} props.totalCount - 全TODO数
 * @param {number} props.filteredCount - フィルター済みTODO数
 * @param {string} props.statusFilter - 現在のステータスフィルター
 * @param {string} props.searchTerm - 現在の検索キーワード
 */
function TodoStats({ totalCount, filteredCount, statusFilter, searchTerm }) {
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '未着手';
      case 'in_progress': return '進行中';
      case 'completed': return '完了';
      default: return status;
    }
  };

  return (
    <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
      <Typography variant="body2" color="text.secondary">
        表示中のTODO: <strong>{filteredCount}件</strong> (全{totalCount}件中)
        {statusFilter !== 'all' && (
          <Chip 
            label={`ステータス: ${getStatusText(statusFilter)}`}
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
  );
}

export default TodoStats;
