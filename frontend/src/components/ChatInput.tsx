"use client";

import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: (text: string) => void;
}

export default function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  const handleSend = () => {
    if (value.trim()) {
      onSend(value.trim());
    }
  };

  return (
    <Box display="flex" p={2} bgcolor="background.paper">
      <TextField
        fullWidth
        placeholder="Type your question..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <IconButton color="primary" onClick={handleSend}>
        <SendIcon />
      </IconButton>
    </Box>
  );
}
