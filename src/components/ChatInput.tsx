"use client";

import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { FormEvent, KeyboardEvent } from "react";

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
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        const form = e.currentTarget.closest("form");
        if (form) {
          const submitEvent = new Event("submit", {
            bubbles: true,
            cancelable: true,
          });
          form.dispatchEvent(submitEvent);
        }
      }
    }
  };

  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        bgcolor: "background.default",
        borderTop: "1px solid",
        borderColor: "grey.200",
        p: 3,
        zIndex: 1000,
      }}
    >
      <Box sx={{ maxWidth: "768px", mx: "auto" }}>
        <form onSubmit={onSubmit}>
          <TextField
            fullWidth
            multiline
            maxRows={6}
            placeholder="Message SQL Assistant..."
            value={input}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "24px",
                backgroundColor: "background.paper",
                paddingRight: "4px",
                minHeight: "56px",
                "& fieldset": {
                  borderColor: "grey.300",
                },
                "&:hover fieldset": {
                  borderColor: "grey.400",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                  borderWidth: 2,
                },
                "& .MuiInputBase-input": {
                  padding: "16px 20px",
                  fontSize: "16px",
                  lineHeight: 1.5,
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    sx={{
                      bgcolor:
                        input.trim() && !isLoading
                          ? "primary.main"
                          : "grey.200",
                      color: input.trim() && !isLoading ? "white" : "grey.500",
                      width: 40,
                      height: 40,
                      mr: 1,
                      "&:hover": {
                        bgcolor:
                          input.trim() && !isLoading
                            ? "primary.dark"
                            : "grey.300",
                      },
                      "&:disabled": {
                        bgcolor: "grey.200",
                        color: "grey.400",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <SendIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>

        {/* Helper text */}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Box
            component="span"
            sx={{
              fontSize: "12px",
              color: "text.secondary",
              bgcolor: "grey.50",
              px: 2,
              py: 0.5,
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            Press Enter to send, Shift + Enter for new line
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
