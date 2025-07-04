import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import {
  PieChart
} from '@mui/x-charts';

// サンプルデータ
const salesData = [
  { id: 0, label: 'PC関連', value: 405000, color: '#FF6384' },
  { id: 1, label: '周辺機器', value: 99000, color: '#36A2EB' },
  { id: 2, label: 'ディスプレイ', value: 235000, color: '#FFCE56' },
  { id: 3, label: 'プリンター', value: 50000, color: '#4BC0C0' },
  { id: 4, label: 'その他', value: 25000, color: '#9966FF' }
];

function MuiChartsPage() {
  const [pieChartType, setPieChartType] = useState('pie');

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ページヘッダー */}
      <Typography variant="h3" component="h1" gutterBottom align="center">
        📊 MUI X Charts 円グラフデモ
      </Typography>
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        MUI X Chartsライブラリを使用したプロフェッショナルな円グラフ表示
      </Typography>

      {/* チャート選択 */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🎛️ 設定
        </Typography>
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>円グラフスタイル</InputLabel>
              <Select
                value={pieChartType}
                onChange={(e) => setPieChartType(e.target.value)}
                label="円グラフスタイル"
              >
                <MenuItem value="pie">通常の円グラフ</MenuItem>
                <MenuItem value="donut">ドーナツ型</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            MUI X ChartsのPieChartコンポーネントを使用。ホバー効果、ハイライト機能、凡例表示が自動で実装されます。
          </Typography>
        </Box>
      </Paper>

      {/* チャート表示エリア */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, height: 500 }}>
            <Typography variant="h6" gutterBottom align="center">
              📊 売上構成比（MUI X Charts）
            </Typography>
            <PieChart
              series={[
                {
                  data: salesData,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  innerRadius: pieChartType === 'donut' ? 80 : 0,
                  outerRadius: 120,
                  paddingAngle: 2,
                  cornerRadius: 5,
                  startAngle: 0,
                  endAngle: 360,
                  cx: 200,
                  cy: 200,
                }
              ]}
              width={400}
              height={400}
              slotProps={{
                legend: {
                  direction: 'column',
                  position: { vertical: 'top', horizontal: 'right' },
                  padding: 0,
                }
              }}
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* チャート情報 */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 チャート情報
              </Typography>
              <Stack spacing={1}>
                <Chip 
                  label="タイプ: PIE CHART" 
                  color="primary" 
                  size="small" 
                />
                <Chip 
                  label="MUI X Charts" 
                  color="secondary" 
                  size="small" 
                />
                <Chip 
                  label="レスポンシブ対応" 
                  color="success" 
                  size="small" 
                />
                <Chip 
                  label="アニメーション付き" 
                  color="info" 
                  size="small" 
                />
              </Stack>
            </CardContent>
          </Card>

          {/* データ詳細 */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 データ詳細
              </Typography>
              <Box>
                {salesData.map((item, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      <strong>{item.label}:</strong> ¥{item.value.toLocaleString()}
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  <strong>合計:</strong> ¥{salesData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* MUI X Charts の特徴 */}
      <Paper elevation={1} sx={{ p: 3, mt: 3, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom>
          ✨ MUI X Charts 円グラフの特徴
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>簡単実装:</strong> 数行のコードで高機能チャート
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>自動レスポンシブ:</strong> 画面サイズに自動調整
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>ビルトインアニメーション:</strong> スムーズな表示効果
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>豊富なオプション:</strong> 色・スタイル・レイアウト調整
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>ツールチップ:</strong> ホバー時の詳細情報表示
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>凡例:</strong> 自動生成・位置調整可能
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>ハイライト機能:</strong> セグメント選択時の視覚効果
              </Typography>
              <Typography component="li" variant="body2">
                <strong>カスタマイズ:</strong> 通常型・ドーナツ型切り替え
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default MuiChartsPage;
