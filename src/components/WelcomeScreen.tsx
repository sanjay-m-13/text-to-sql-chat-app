"use client";

import { Box, Typography, Stack, Chip, Fade } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";

export default function WelcomeScreen() {
  const examples = [
    "Show me all customers by status",
    "Find orders from the last 30 days",
    "Count products by category",
    "Display sales trends over time",
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        flexDirection: "column",
        maxWidth: "768px",
        mx: "auto",
        px: 3,
        py: 8,
      }}
    >
      <Fade in timeout={800}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 4,
            }}
          >
            <SmartToyIcon sx={{ fontSize: 40, color: "white" }} />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              mb: 2,
              fontSize: { xs: "1.75rem", md: "2.125rem" },
            }}
          >
            SQL Assistant
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.6,
              fontSize: "1.125rem",
            }}
          >
            Transform your natural language questions into SQL queries and get
            instant results with beautiful visualizations.
          </Typography>
        </Box>
      </Fade>

      <Fade in timeout={1200}>
        <Box sx={{ width: "100%", maxWidth: 600 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              color: "text.primary",
              mb: 3,
              textAlign: "center",
            }}
          >
            Try these examples
          </Typography>

          <Stack spacing={2}>
            {examples.map((example, index) => (
              <Box
                key={index}
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: "grey.200",
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "primary.50",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.primary",
                    fontWeight: 500,
                  }}
                >
                  {example}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Fade>
    </Box>
  );
}
