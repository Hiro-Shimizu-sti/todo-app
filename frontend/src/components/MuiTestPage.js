import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  TextField,
  Divider
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp
} from '@mui/icons-material';

// Excelライクなテーブル用のデータ（階層構造対応）
const excelData = [
  { 
    id: 'A1', 
    A: 'ID', 
    B: '商品カテゴリ', 
    C: '単価', 
    D: '数量', 
    E: '合計', 
    F: '備考',
    isHeader: true,
    hasDetails: false,
    isExpanded: false,
    details: []
  },
  { 
    id: 'A2', 
    A: '001', 
    B: 'PC関連', 
    C: '0', 
    D: '0', 
    E: '=SUM(details)', 
    F: 'カテゴリ合計',
    isHeader: false,
    hasDetails: true,
    isExpanded: false,
    details: [
      { id: 'A2-1', A: '001-1', B: 'ノートPC', C: '120000', D: '2', E: '=C*D', F: '在庫あり' },
      { id: 'A2-2', A: '001-2', B: 'デスクトップPC', C: '80000', D: '1', E: '=C*D', F: '在庫少' },
      { id: 'A2-3', A: '001-3', B: 'タブレット', C: '45000', D: '3', E: '=C*D', F: '人気商品' }
    ]
  },
  { 
    id: 'A3', 
    A: '002', 
    B: '周辺機器', 
    C: '0', 
    D: '0', 
    E: '=SUM(details)', 
    F: 'カテゴリ合計',
    isHeader: false,
    hasDetails: true,
    isExpanded: false,
    details: [
      { id: 'A3-1', A: '002-1', B: 'マウス', C: '3000', D: '5', E: '=C*D', F: '在庫あり' },
      { id: 'A3-2', A: '002-2', B: 'キーボード', C: '8000', D: '3', E: '=C*D', F: '在庫少' },
      { id: 'A3-3', A: '002-3', B: 'Webカメラ', C: '12000', D: '2', E: '=C*D', F: '新商品' },
      { id: 'A3-4', A: '002-4', B: 'ヘッドセット', C: '15000', D: '4', E: '=C*D', F: '人気' }
    ]
  },
  { 
    id: 'A4', 
    A: '003', 
    B: 'ディスプレイ', 
    C: '0', 
    D: '0', 
    E: '=SUM(details)', 
    F: 'カテゴリ合計',
    isHeader: false,
    hasDetails: true,
    isExpanded: false,
    details: [
      { id: 'A4-1', A: '003-1', B: 'モニター24"', C: '45000', D: '2', E: '=C*D', F: '在庫あり' },
      { id: 'A4-2', A: '003-2', B: 'モニター27"', C: '60000', D: '1', E: '=C*D', F: '予約中' },
      { id: 'A4-3', A: '003-3', B: '4Kモニター', C: '85000', D: '1', E: '=C*D', F: '高級品' }
    ]
  },
  { 
    id: 'A5', 
    A: '004', 
    B: 'プリンター', 
    C: '25000', 
    D: '2', 
    E: '=C5*D5', 
    F: '在庫あり',
    isHeader: false,
    hasDetails: false,
    isExpanded: false,
    details: []
  }
];

// Excelライクなセルコンポーネント（折り畳み対応）
function ExcelCell({ 
  value, 
  isHeader = false, 
  isSelected = false, 
  onClick, 
  onDoubleClick, 
  isEditing, 
  onEdit, 
  cellKey,
  hasDetails = false,
  isExpanded = false,
  onToggleExpand,
  isDetailRow = false,
  indentLevel = 0
}) {
  const [editValue, setEditValue] = useState(value);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onEdit(cellKey, editValue);
    }
    if (e.key === 'Escape') {
      setEditValue(value);
      onEdit(cellKey, value);
    }
  };

  const cellStyle = {
    border: '1px solid #d0d7de',
    padding: '8px 12px',
    backgroundColor: isHeader ? '#f6f8fa' : 
                     isDetailRow ? '#f8f9fa' : 
                     isSelected ? '#e7f3ff' : 'white',
    fontWeight: isHeader ? 'bold' : 'normal',
    fontSize: '14px',
    minWidth: '100px',
    maxWidth: '200px',
    cursor: isHeader ? 'default' : 'cell',
    position: 'relative',
    paddingLeft: `${8 + (indentLevel * 20)}px`, // インデント
    '&:hover': {
      backgroundColor: isHeader ? '#f6f8fa' : isDetailRow ? '#f0f0f0' : '#f0f0f0'
    },
    // Excel風の選択時の境界線
    ...(isSelected && {
      border: '2px solid #4285f4',
      backgroundColor: '#e7f3ff'
    })
  };

  const handleCellClick = () => {
    if (!isHeader) {
      onClick(cellKey);
    }
  };

  const handleCellDoubleClick = () => {
    if (!isHeader) {
      onDoubleClick(cellKey);
    }
  };

  return (
    <TableCell
      sx={cellStyle}
      onClick={handleCellClick}
      onDoubleClick={handleCellDoubleClick}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* 折り畳みボタン（Aカラムのみ） */}
        {hasDetails && cellKey.startsWith('A') && !isHeader && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            sx={{ width: 20, height: 20, p: 0 }}
          >
            {isExpanded ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
          </IconButton>
        )}
        
        {/* セルの内容 */}
        <Box sx={{ flex: 1 }}>
          {isEditing ? (
            <TextField
              size="small"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={() => onEdit(cellKey, editValue)}
              autoFocus
              fullWidth
              variant="standard"
              InputProps={{
                disableUnderline: true,
                style: { fontSize: '14px' }
              }}
            />
          ) : (
            <span style={{ 
              fontFamily: 'monospace',
              color: isDetailRow ? '#666' : 'inherit',
              fontStyle: isDetailRow ? 'italic' : 'normal'
            }}>
              {value}
            </span>
          )}
        </Box>
      </Box>
    </TableCell>
  );
}

// Excelライクなテーブルコンポーネント（折り畳み対応）
function ExcelTable() {
  const [data, setData] = useState(excelData);
  const [selectedCell, setSelectedCell] = useState(null);
  const [editingCell, setEditingCell] = useState(null);

  const handleCellClick = (cellKey) => {
    setSelectedCell(cellKey);
    setEditingCell(null);
  };

  const handleCellDoubleClick = (cellKey) => {
    setEditingCell(cellKey);
    setSelectedCell(cellKey);
  };

  const handleToggleExpand = (rowId) => {
    setData(prevData => 
      prevData.map(row => 
        row.id === rowId 
          ? { ...row, isExpanded: !row.isExpanded }
          : row
      )
    );
  };

  const calculateFormula = (formula, rowData, detailData = null) => {
    try {
      if (formula.includes('SUM(details)')) {
        // 詳細行の合計計算
        if (rowData.details && rowData.details.length > 0) {
          const total = rowData.details.reduce((sum, detail) => {
            const price = parseFloat(detail.C || 0);
            const quantity = parseFloat(detail.D || 0);
            return sum + (price * quantity);
          }, 0);
          return total.toString();
        }
        return '0';
      } else if (formula.includes('C*D')) {
        // 単価×数量の計算
        const targetData = detailData || rowData;
        const price = parseFloat(targetData.C || 0);
        const quantity = parseFloat(targetData.D || 0);
        return (price * quantity).toString();
      }
    } catch (error) {
      console.log('数式計算エラー:', error);
    }
    return formula;
  };

  const handleCellEdit = (cellKey, newValue) => {
    setEditingCell(null);
    
    // 簡単な数式計算
    let calculatedValue = newValue;
    if (newValue && newValue.startsWith('=')) {
      const formula = newValue.slice(1);
      
      // セルキーから行とカラムを特定
      const isDetailCell = cellKey.includes('-');
      
      if (isDetailCell) {
        // 詳細行のセル（例: "A2-1", "B2-1"）
        const match = cellKey.match(/([A-Z]+)(\d+)-(\d+)/);
        if (match) {
          const [, , parentRowNum, detailIndex] = match;
          const parentId = `A${parentRowNum}`;
          const parentRow = data.find(row => row.id === parentId);
          if (parentRow && parentRow.details[parseInt(detailIndex) - 1]) {
            const detailRow = parentRow.details[parseInt(detailIndex) - 1];
            calculatedValue = calculateFormula(formula, parentRow, detailRow);
          }
        }
      } else {
        // メイン行のセル
        const rowId = cellKey.match(/[A-Z]+(\d+)/)?.[0];
        const row = data.find(r => r.id === rowId);
        if (row) {
          calculatedValue = calculateFormula(formula, row);
        }
      }
    }

    setData(prevData => 
      prevData.map(row => {
        const isDetailCell = cellKey.includes('-');
        
        if (isDetailCell) {
          // 詳細行の更新（例: "A2-1", "B2-1"）
          const match = cellKey.match(/([A-Z]+)(\d+)-(\d+)/);
          if (match) {
            const [, column, parentRowNum, detailIndex] = match;
            const parentId = `A${parentRowNum}`;
            
            if (row.id === parentId) {
              const updatedDetails = [...row.details];
              const targetDetailIndex = parseInt(detailIndex) - 1;
              
              if (updatedDetails[targetDetailIndex]) {
                updatedDetails[targetDetailIndex] = {
                  ...updatedDetails[targetDetailIndex],
                  [column]: calculatedValue
                };
              }
              return { ...row, details: updatedDetails };
            }
          }
        } else {
          // メイン行の更新
          const [column, rowNum] = [cellKey.charAt(0), cellKey.slice(1)];
          if (row.id === `A${rowNum}`) {
            return { ...row, [column]: calculatedValue };
          }
        }
        return row;
      })
    );
  };

  // 表示用のフラット化されたデータを生成
  const flattenedData = [];
  data.forEach((row, index) => {
    flattenedData.push({ ...row, rowIndex: index + 1 });
    
    if (row.isExpanded && row.details) {
      row.details.forEach((detail, detailIndex) => {
        flattenedData.push({
          ...detail,
          isDetail: true,
          parentId: row.id,
          detailIndex: detailIndex + 1,
          rowIndex: `${index + 1}-${detailIndex + 1}`
        });
      });
    }
  });

  const columns = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        📊 階層対応Excelライクなテーブル
      </Typography>
      
      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader size="small" sx={{ borderCollapse: 'separate' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  backgroundColor: '#f6f8fa', 
                  border: '1px solid #d0d7de',
                  fontWeight: 'bold',
                  width: '60px',
                  textAlign: 'center'
                }}>
                  #
                </TableCell>
                {columns.map(col => (
                  <TableCell key={col} sx={{ 
                    backgroundColor: '#f6f8fa', 
                    border: '1px solid #d0d7de',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontFamily: 'monospace'
                  }}>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {flattenedData.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ 
                    backgroundColor: '#f6f8fa', 
                    border: '1px solid #d0d7de',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontFamily: 'monospace'
                  }}>
                    {row.rowIndex}
                  </TableCell>
                  {columns.map(col => {
                    const cellKey = row.isDetail 
                      ? `${col}${row.parentId.slice(1)}-${row.detailIndex}`
                      : `${col}${row.rowIndex}`;
                    
                    const hasDetails = col === 'A' && row.hasDetails && !row.isDetail;
                    
                    return (
                      <ExcelCell
                        key={cellKey}
                        value={row[col] || ''}
                        isHeader={row.isHeader}
                        isSelected={selectedCell === cellKey}
                        onClick={handleCellClick}
                        onDoubleClick={handleCellDoubleClick}
                        isEditing={editingCell === cellKey}
                        onEdit={handleCellEdit}
                        cellKey={cellKey}
                        hasDetails={hasDetails}
                        isExpanded={row.isExpanded}
                        onToggleExpand={() => handleToggleExpand(row.id)}
                        isDetailRow={row.isDetail}
                        indentLevel={row.isDetail ? 1 : 0}
                      />
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Excel風の情報バー */}
        <Box sx={{ 
          backgroundColor: '#f6f8fa', 
          borderTop: '1px solid #d0d7de',
          p: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          fontSize: '12px'
        }}>
          <Typography variant="caption">
            選択中のセル: <strong>{selectedCell || 'なし'}</strong>
          </Typography>
          <Divider orientation="vertical" flexItem />
          <Typography variant="caption">
            💡 ダブルクリックで編集、Enter で確定、Escape でキャンセル
          </Typography>
          <Divider orientation="vertical" flexItem />
          <Typography variant="caption">
            🧮 数式例: =C*D (単価×数量), =SUM(details) (詳細合計)
          </Typography>
          <Divider orientation="vertical" flexItem />
          <Typography variant="caption">
            📁 IDセルの▼で折り畳み切り替え
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

// 折り畳みテーブル用のサンプルデータ


// メインコンポーネント
function MuiTestPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ページヘッダー */}
      <Typography variant="h3" component="h1" gutterBottom align="center">
        🎨 MUI エクセルライクなテーブル
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        階層データの折り畳み・編集・数式計算が可能なエクセルライクなテーブルのデモです
      </Typography>

      {/* Excelライクなテーブル */}
      <ExcelTable />

      {/* 説明セクション */}
      <Paper elevation={1} sx={{ p: 3, mt: 3, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom>
          🚀 実装された機能
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>階層構造対応:</strong> カテゴリと詳細商品の2階層表示
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>折り畳み機能:</strong> IDセルの▼ボタンで詳細行の表示/非表示切り替え
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>セル編集:</strong> ダブルクリックで編集、Enter確定、Escape取消
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>詳細行編集:</strong> 折り畳まれた詳細行も個別に編集可能
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>インデント表示:</strong> 詳細行は視覚的にインデントされて表示
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>数式計算:</strong> =C*D（単価×数量）、=SUM(details)（詳細合計）
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Excel風デザイン:</strong> グリッド線・セル選択・固定ヘッダー
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>セル選択:</strong> メイン行・詳細行問わずクリックでセル選択
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>キーボード操作:</strong> Enter確定、Escape取消で直感的な操作
          </Typography>
          <Typography component="li" variant="body2">
            <strong>情報バー:</strong> 選択中のセル・操作方法・数式例を画面下部に表示
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default MuiTestPage;
