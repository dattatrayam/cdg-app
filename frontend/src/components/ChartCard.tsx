"use client";

import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type ChartType = "line" | "bar" | "pie";

interface ChartCardProps {
  title: string;
  type: ChartType;
  data: any[];
  xKey?: string;
  yKey?: string;
}

export default function ChartCard({
  title,
  type,
  data,
  xKey = "x",
  yKey = "y",
}: ChartCardProps) {
  let chartElement: JSX.Element | null = null;

  if (type === "line") {
    chartElement = (
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={yKey} stroke="#1976d2" />
      </LineChart>
    );
  } else if (type === "bar") {
    chartElement = (
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={yKey} fill="#1976d2" />
      </BarChart>
    );
  } else if (type === "pie") {
    chartElement = (
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
          {data.map((_, idx) => (
            <Cell key={idx} fill={["#1976d2", "#9c27b0", "#ff9800"][idx % 3]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    );
  }

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3, height: 360 }}>
      <CardHeader title={title} />
      <CardContent sx={{ height: 280, pt: 0 }}>
        {chartElement ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartElement}
          </ResponsiveContainer>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No chart available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
