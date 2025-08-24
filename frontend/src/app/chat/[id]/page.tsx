"use client";

import { useParams } from "next/navigation";
import { Box, Typography, Card, CardContent, TextField, IconButton, AppBar } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

const mockConversations: Record<string, string[]> = {
  "1": ["Hello AI, generate Sales Report Q1", "Here is your chart placeholder"],
  "2": ["Analyze Marketing Funnel", "Chart placeholder for funnel"],
};

export default function ChatPage() {
  const params = useParams();
  const conversationId = params.id as string;
  const initialMessages = mockConversations[conversationId] || [];
  const [messages, setMessages] = useState<string[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input) return;
    setMessages([...messages, input]);
    setInput("");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, minHeight: "100vh", p: 3, display: "flex", flexDirection: "column" }}>
       

        <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 2 }}>
          {messages.map((msg, idx) => (
            <Card key={idx} sx={{ mb: 1, borderRadius: 2 }}>
              <CardContent>
                <Typography>{msg}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Ask AI to generate a chart..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <IconButton color="primary" onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
