'use client';

import {
  Box,
  Typography,
  Stack,
  Chip,
  Fade,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export default function WelcomeScreen() {
  return (
    <Fade in timeout={800}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box
          sx={{
            p: 4,
            borderRadius: 4,
            bgcolor: "primary.50",
            border: "2px dashed",
            borderColor: "primary.200",
          }}
        >
          <SmartToyIcon sx={{ fontSize: 64, color: "primary.main" }} />
        </Box>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "grey.800" }}
          >
            Ready to help with SQL queries
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 500 }}
          >
            Ask me to convert natural language to SQL queries. I can help with
            SELECT statements, JOINs, aggregations, and more.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Chip
              label="Try: Find all users who registered last month"
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
            />
            <Chip
              label="Try: Show top 10 selling products"
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
            />
          </Box>
        </Stack>
      </Box>
    </Fade>
  );
}
