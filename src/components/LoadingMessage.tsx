"use client";

import {
  Paper,
  Box,
  Avatar,
  Typography,
  CircularProgress,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";

export default function LoadingMessage() {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          bgcolor: "grey.700",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <SmartToyIcon sx={{ fontSize: 18, color: "white" }} />
      </Box>

      {/* Loading Content */}
      <Box sx={{ flex: 1, minWidth: 0, pt: 0.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CircularProgress size={16} sx={{ color: "primary.main" }} />
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: "16px" }}
          >
            Analyzing your query and generating results...
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
