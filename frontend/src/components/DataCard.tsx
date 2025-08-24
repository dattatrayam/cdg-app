"use client";
import { Card, CardContent, Typography } from "@mui/material";

interface DataCardProps {
  title: string;
  value: string | number;
}

export default function DataCard({ title, value }: DataCardProps) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
