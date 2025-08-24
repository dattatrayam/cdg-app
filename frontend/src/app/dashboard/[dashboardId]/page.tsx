"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ChartCard from "@/components/ChartCard";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import ChatInput from "@/components/ChatInput";
import api from "@/lib/axios";

interface ChartData {
  title: string;
  type: "line" | "bar" | "pie";
  data: any[];
  xKey?: string;
  yKey?: string;
}

interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

export default function DashboardDetailPage() {
  const params = useParams();
  const dashboardId = params.dashboardId;
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [dataSourceId, setDataSourceId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll chat to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get(`/api/dashboards/${dashboardId}`);
        const session = res.data;

        setDataSourceId(session.dataSourceId || null);

        setChatMessages(
          session.messages.map((m: any) => ({
            role: m.role,
            text: m.content,
          }))
        );

        if (session.lastChart) setCharts([session.lastChart]);
      } catch (err) {
        console.error("Failed to fetch dashboard session", err);
      }
    };

    fetchSession();
  }, [dashboardId]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const sendMessage = async () => {
      if (!input) return;
      console.log('sendMessage', input);
    const userMessage: ChatMessage = { role: "user", text: input };
    setChatMessages((prev) => [...prev, userMessage]);

    try {
      const res = await api.post(`/api/chat/${dashboardId}/messages`, {
        message: input,
      });

      const aiMessage: ChatMessage = {
        role: "ai",
        text: res.data.reply.content,
      };
      setChatMessages((prev) => [...prev, aiMessage]);

      if (res.data.chart) setCharts([res.data.chart]);
    } catch (err: any) {
      console.error("Chat API failed", err);
      const errorMsg: ChatMessage = {
        role: "ai",
        text: `Error: ${err.response?.data?.error || err.message}`,
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    }

    setInput("");
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* <Sidebar /> */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky" sx={{ zIndex: 1201 }}>
          <Toolbar>
            <Typography variant="h6">
              Dashboard: {dashboardId}{" "}
              {dataSourceId && `(Data Source: ${dataSourceId})`}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {charts.map((chart, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <ChartCard {...chart} />
              </Grid>
            ))}
          </Grid>

          <Paper sx={{ mt: 3, p: 2 }}>
            <Typography variant="h6">Chat with AI</Typography>
            <Box
              sx={{ maxHeight: 300, overflowY: "auto", mb: 2, px: 1 }}
            >
              {chatMessages.map((msg, idx) => (
                <Box
                  key={idx}
                  sx={{
                    textAlign: msg.role === "user" ? "right" : "left",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      display: "inline-block",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor:
                        msg.role === "user" ? "primary.light" : "grey.300",
                    }}
                  >
                    {msg.text}
                  </Typography>
                </Box>
              ))}
              <div ref={chatEndRef} />
            </Box>
            <ChatInput onSend={sendMessage} value={input} onChange={setInput} />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
