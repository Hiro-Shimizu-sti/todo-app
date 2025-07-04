import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Slider
} from '@mui/material';
import { Circle } from '@mui/icons-material';

// サンプルデータ
const chartData = [
  { label: 'PC関連', value: 405000, color: '#FF6384' },
  { label: '周辺機器', value: 99000, color: '#36A2EB' },
  { label: 'ディスプレイ', value: 235000, color: '#FFCE56' },
  { label: 'プリンター', value: 50000, color: '#4BC0C0' },
  { label: 'その他', value: 25000, color: '#9966FF' }
];

// SVGで円グラフを描画するコンポーネント
function CustomPieChart({ data, size = 300, showLabels = true, animationSpeed = 1 }) {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  
  const radius = size / 2 - 20;
  const centerX = size / 2;
  const centerY = size / 2;
  
  // 合計値を計算
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // 各セグメントの角度を計算
  let currentAngle = -90; // 12時の位置から開始
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    // SVGパス用の座標計算
    const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    // ラベル位置（セグメントの中央）
    const labelAngle = startAngle + angle / 2;
    const labelRadius = radius * 0.7;
    const labelX = centerX + labelRadius * Math.cos((labelAngle * Math.PI) / 180);
    const labelY = centerY + labelRadius * Math.sin((labelAngle * Math.PI) / 180);
    
    currentAngle += angle;
    
    return {
      ...item,
      index,
      pathData,
      percentage,
      angle,
      labelX,
      labelY,
      startAngle,
      endAngle
    };
  });
  
  return (
    <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        📊 売上構成比
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <svg width={size} height={size} style={{ overflow: 'visible' }}>
          {/* ドロップシャドウフィルター */}
          <defs>
            <filter id="dropshadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>
          
          {/* 円グラフのセグメント */}
          {segments.map((segment) => (
            <g key={segment.index}>
              <path
                d={segment.pathData}
                fill={segment.color}
                stroke="white"
                strokeWidth="2"
                filter="url(#dropshadow)"
                style={{
                  cursor: 'pointer',
                  transition: `all ${animationSpeed * 0.3}s ease`,
                  transform: hoveredSegment === segment.index ? 'scale(1.05)' : 'scale(1)',
                  transformOrigin: `${centerX}px ${centerY}px`,
                  opacity: hoveredSegment !== null && hoveredSegment !== segment.index ? 0.7 : 1
                }}
                onMouseEnter={() => setHoveredSegment(segment.index)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
              
              {/* ラベル */}
              {showLabels && segment.percentage > 5 && (
                <g>
                  <text
                    x={segment.labelX}
                    y={segment.labelY - 5}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="bold"
                    fill="white"
                    style={{ pointerEvents: 'none' }}
                  >
                    {segment.label}
                  </text>
                  <text
                    x={segment.labelX}
                    y={segment.labelY + 10}
                    textAnchor="middle"
                    fontSize="11"
                    fill="white"
                    style={{ pointerEvents: 'none' }}
                  >
                    {segment.percentage.toFixed(1)}%
                  </text>
                </g>
              )}
            </g>
          ))}
          
          {/* 中央の円（ドーナツ型にする場合） */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius * 0.4}
            fill="white"
            stroke="#e0e0e0"
            strokeWidth="2"
          />
          
          {/* 中央のテキスト */}
          <text
            x={centerX}
            y={centerY - 10}
            textAnchor="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#333"
          >
            総売上
          </text>
          <text
            x={centerX}
            y={centerY + 10}
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#2196F3"
          >
            ¥{total.toLocaleString()}
          </text>
        </svg>
      </Box>
      
      {/* ホバー時の詳細情報 */}
      {hoveredSegment !== null && (
        <Box sx={{ 
          mt: 2, 
          p: 2, 
          backgroundColor: '#f5f5f5', 
          borderRadius: 2,
          transition: 'all 0.3s ease'
        }}>
          <Typography variant="h6" color="primary">
            {segments[hoveredSegment].label}
          </Typography>
          <Typography variant="body1">
            売上: ¥{segments[hoveredSegment].value.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            構成比: {segments[hoveredSegment].percentage.toFixed(1)}%
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

// 凡例コンポーネント
function ChartLegend({ data, onItemClick, selectedItems = [] }) {
  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        📋 凡例
      </Typography>
      <List dense>
        {data.map((item, index) => (
          <ListItem
            key={index}
            button
            onClick={() => onItemClick && onItemClick(index)}
            sx={{
              opacity: selectedItems.length === 0 || selectedItems.includes(index) ? 1 : 0.5,
              transition: 'opacity 0.3s ease'
            }}
          >
            <ListItemIcon>
              <Circle sx={{ color: item.color }} />
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              secondary={`¥${item.value.toLocaleString()} (${((item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%)`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

// メインコンポーネント
function PieChartPage() {
  const [chartSize, setChartSize] = useState(300);
  const [showLabels, setShowLabels] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  
  const handleLegendClick = (index) => {
    setSelectedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };
  
  const filteredData = selectedItems.length === 0 
    ? chartData 
    : chartData.filter((_, index) => selectedItems.includes(index));
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ページヘッダー */}
      <Typography variant="h3" component="h1" gutterBottom align="center">
        📊 MUI カスタム円グラフ
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        MUI基本コンポーネント + SVGで作成したインタラクティブな円グラフです
      </Typography>

      {/* コントロールパネル */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🎛️ 設定
        </Typography>
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Typography gutterBottom>チャートサイズ</Typography>
            <Slider
              value={chartSize}
              onChange={(_, value) => setChartSize(value)}
              min={200}
              max={500}
              step={50}
              marks={[
                { value: 200, label: '小' },
                { value: 350, label: '中' },
                { value: 500, label: '大' }
              ]}
              valueLabelDisplay="auto"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>ラベル表示</InputLabel>
              <Select
                value={showLabels}
                onChange={(e) => setShowLabels(e.target.value)}
                label="ラベル表示"
              >
                <MenuItem value={true}>表示</MenuItem>
                <MenuItem value={false}>非表示</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography gutterBottom>アニメーション速度</Typography>
            <Slider
              value={animationSpeed}
              onChange={(_, value) => setAnimationSpeed(value)}
              min={0.5}
              max={2}
              step={0.5}
              marks={[
                { value: 0.5, label: '遅' },
                { value: 1, label: '標準' },
                { value: 2, label: '速' }
              ]}
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* チャートとデータ */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CustomPieChart 
            data={filteredData}
            size={chartSize}
            showLabels={showLabels}
            animationSpeed={animationSpeed}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <ChartLegend 
            data={chartData}
            onItemClick={handleLegendClick}
            selectedItems={selectedItems}
          />
          
          {/* 統計情報 */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 統計情報
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>項目数:</strong> {filteredData.length}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>最大値:</strong> ¥{Math.max(...filteredData.map(d => d.value)).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>最小値:</strong> ¥{Math.min(...filteredData.map(d => d.value)).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <strong>平均値:</strong> ¥{Math.round(filteredData.reduce((sum, d) => sum + d.value, 0) / filteredData.length).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 機能説明 */}
      <Paper elevation={1} sx={{ p: 3, mt: 3, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom>
          ✨ 実装された機能
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>SVG描画:</strong> 純粋なSVGによる円グラフ
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>ホバー効果:</strong> マウスオーバーで拡大・詳細表示
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>ドーナツ型:</strong> 中央に統計情報表示
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>カスタマイズ:</strong> サイズ・ラベル・速度調整
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>インタラクティブ凡例:</strong> クリックでフィルタリング
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>統計表示:</strong> リアルタイム計算
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>レスポンシブ:</strong> 画面サイズに対応
              </Typography>
              <Typography component="li" variant="body2">
                <strong>無料実装:</strong> 外部ライブラリ不要
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default PieChartPage;
