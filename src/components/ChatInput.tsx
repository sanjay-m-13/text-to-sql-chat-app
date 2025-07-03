"use client";

import { Paper, Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { FormEvent } from "react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function ChatInput({
  input,
  isLoading,
  onInputChange,
  onSubmit,
}: ChatInputProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        m: 3,
        borderRadius: 3,
        bgcolor: "background.paper",
        boxShadow: "0 10px 25px rgb(0 0 0 / 0.1)",
      }}
    >
      <form onSubmit={onSubmit}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Describe the SQL query you need..."
            value={input}
            onChange={onInputChange}
            disabled={isLoading}
            multiline
            maxRows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "grey.50",
                "&:hover": {
                  bgcolor: "background.paper",
                },
                "&.Mui-focused": {
                  bgcolor: "background.paper",
                },
              },
            }}
          />
          <IconButton
            type="submit"
            disabled={isLoading || !input.trim()}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              width: 48,
              height: 48,
              "&:hover": {
                bgcolor: "primary.dark",
                transform: "scale(1.05)",
              },
              "&:disabled": {
                bgcolor: "grey.300",
                color: "grey.500",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </form>
    </Paper>
  );
}
