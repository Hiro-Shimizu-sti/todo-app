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
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// サンプルデータ（Recharts用に調整）
const salesData = [
    { name: '実行', value: 2863, color: '#C5DDFB' },
    { name: '保守', value: 1230, color: '#9CB1FF' },
    { name: '見込', value: 893, color: '#5F79CA' },
    { name: '共通', value: 520, color: '#1B458F' },
    { name: '大共PS', value: 1030, color: '#FFF287' },
    { name: '営支', value: 300, color: '#FFBA50' },
    { name: '調検', value: 50, color: '#FB8414' },
];
const totalValue = salesData.reduce((sum, entry) => sum + entry.value, 0);

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value, label }) => {
    const RADIAN = Math.PI / 180;
    // ラベルを配置する半径を計算 (パイの中央に配置)
    const radius = outerRadius + 30; // 半径を小さくして画面に収める
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12">
            <tspan x={x}>{name}</tspan>
            <tspan x={x} dy="1.2em">{value}</tspan>
        </text>
    );
};

const RechartsPage = () => {
    return (
        <Container maxWidth="xl" sx={{ py: 2 }}>
            {/* ページヘッダー */}
            <Typography variant="h4" component="h1" gutterBottom align="center">
                📊 Recharts ドーナツグラフデモ
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                Rechartsライブラリを使用したドーナツ型円グラフ表示
            </Typography>

            {/* チャート表示エリア */}
            <Grid container spacing={1}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ padding: 1, height: '100%' }}>
                        <Typography variant="h6" component="h2" gutterBottom align="center">
                            📊 ドーナツグラフ 1
                        </Typography>
                        <PieChart width={350} height={300} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                            <Pie
                                data={salesData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={90}
                                fill="#8884d8"
                                label={renderCustomizedLabel}
                                labelLine={true}
                                startAngle={90}
                                endAngle={-270}
                            >
                                {salesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                style={{ fontSize: '12px', fontWeight: 'bold' }}
                            >
                                {`合計: ${totalValue}`}
                            </text>
                            <Tooltip />
                        </PieChart>
                    </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ padding: 1, height: '100%' }}>
                        <Typography variant="h6" component="h2" gutterBottom align="center">
                            📊 ドーナツグラフ 2
                        </Typography>
                        <PieChart width={350} height={300} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                            <Pie
                                data={salesData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={90}
                                fill="#8884d8"
                                label={renderCustomizedLabel}
                                labelLine={true}
                                startAngle={90}
                                endAngle={-270}
                            >
                                {salesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                style={{ fontSize: '12px', fontWeight: 'bold' }}
                            >
                                {`合計: ${totalValue}`}
                            </text>
                            <Tooltip />
                        </PieChart>
                    </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ padding: 1, height: '100%' }}>
                        <Typography variant="h6" component="h2" gutterBottom align="center">
                            📊 ドーナツグラフ 3
                        </Typography>
                        <PieChart width={350} height={300} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                            <Pie
                                data={salesData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={90}
                                fill="#8884d8"
                                label={renderCustomizedLabel}
                                labelLine={true}
                                startAngle={90}
                                endAngle={-270}
                            >
                                {salesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                style={{ fontSize: '12px', fontWeight: 'bold' }}
                            >
                                {`合計: ${totalValue}`}
                            </text>
                            <Tooltip />
                        </PieChart>
                    </Paper>
                </Grid>
            </Grid>
        </Container>

    );
};

export default RechartsPage;
