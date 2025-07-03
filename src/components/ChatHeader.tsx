'use client';

import { Paper, Typography } from '@mui/material';

export default function ChatHeader() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderBottom: "1px solid",
        borderColor: "grey.200",
        bgcolor: "background.paper",
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: "grey.800", mb: 1 }}
      >
        Text to SQL Assistant
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Convert natural language to SQL queries with AI assistance
      </Typography>
    </Paper>
  );
}
