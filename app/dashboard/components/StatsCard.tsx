"use client";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function StatsCard({ title, value, color, glassy }) {
  return (
    <Paper
      elevation={glassy ? 0 : 4}
      sx={{
        borderRadius: 3,
        p: 3,
        background: glassy
          ? "linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0.15))"
          : "white",
        backdropFilter: glassy ? "blur(12px)" : "none",
        boxShadow: glassy
          ? "0 12px 25px rgba(0,0,0,0.12)"
          : "0 4px 12px rgba(0,0,0,0.08)",
        border: glassy ? "1px solid rgba(255,255,255,0.4)" : "none",
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Box mt={1}>
        <Typography variant="h4" sx={{ fontWeight: 700, color }}>
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}
