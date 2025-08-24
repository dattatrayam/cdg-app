"use client";
import { Box, AppBar, Toolbar, Typography, Paper, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Sidebar from "@/components/Sidebar";

export default function ChatPage() {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* AppBar */}
        <AppBar position="sticky" sx={{ zIndex: 1201 }}>
          <Toolbar>
            <Typography variant="h6">Chat with AI</Typography>
          </Toolbar>
        </AppBar>

        {/* Chat Messages Area */}
        <Box sx={{ flex: 1, p: 2, overflowY: "auto", bgcolor: "#f9f9f9" }}>
          {/* Example messages */}
          <Paper sx={{ p: 2, mb: 2, maxWidth: "70%" }}>
            <Typography variant="body1">Hello! How can I help you today?</Typography>
          </Paper>
          <Paper sx={{ p: 2, mb: 2, ml: "auto", maxWidth: "70%", bgcolor: "#e3f2fd" }}>
            <Typography variant="body1">Show me sales trends by region.</Typography>
          </Paper>
        </Box>

        {/* Input Area */}
        <Box sx={{ display: "flex", p: 2, borderTop: "1px solid #ddd" }}>
          <TextField
            fullWidth
            placeholder="Type your message..."
            variant="outlined"
            size="small"
          />
          <IconButton color="primary" sx={{ ml: 1 }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
