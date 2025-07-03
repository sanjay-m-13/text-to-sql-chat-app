'use client';

import {
  Paper,
  Box,
  Avatar,
  Typography,
  CircularProgress,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export default function LoadingMessage() {
  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 3,
        mr: 6,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          sx={{
            bgcolor: "secondary.main",
            width: 40,
            height: 40,
          }}
        >
          <SmartToyIcon />
        </Avatar>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CircularProgress size={20} />
          <Typography variant="body1" color="text.secondary">
            Generating SQL query...
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
