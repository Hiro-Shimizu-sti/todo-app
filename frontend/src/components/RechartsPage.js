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
    { name: 'PC関連', value: 405000, color: '#FF6384' },
    { name: '周辺機器', value: 99000, color: '#36A2EB' },
    { name: 'ディスプレイ', value: 235000, color: '#FFCE56' },
    { name: 'プリンター', value: 50000, color: '#4BC0C0' },
    { name: 'その他', value: 25000, color: '#9966FF' }
];
const totalValue = salesData.reduce((sum, entry) => sum + entry.value, 0);

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value, label }) => {
    const RADIAN = Math.PI / 180;
    // ラベルを配置する半径を計算 (パイの中央に配置)
    const radius = outerRadius + 30; // ここで半径を調整
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            <tspan x={x}>{name}</tspan>
            <tspan x={x} dy="1.2em">{value}</tspan>
        </text>
    );
};

const RechartsPage = () => {
    return (
        <PieChart width={600} height={600} margin={{ top: 40, right: 40, left: 40, bottom: 40 }}>
            <Pie
                data={salesData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={100}
                outerRadius={150}
                fill="#8884d8"
                labelLine={true}
                label={renderCustomizedLabel}
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
                style={{ fontSize: '24px', fontWeight: 'bold' }}
            >
                {`合計: ${totalValue}`}
            </text>
        </PieChart>
    );
};

export default RechartsPage;
