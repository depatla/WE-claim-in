import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ReactElement } from "react";

type GlassCardProps = {
  title: string;
  value: string | number;
  icon: ReactElement;
};

export function GlassCard({ title, value, icon }: GlassCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: 150,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",

        /* WHITE GLASS EFFECT */
        background: "rgba(255, 255, 255, 0.65)",
        backdropFilter: "blur(18px)",
        border: "1px solid rgba(0, 0, 0, 0.06)",

        /* SOFT SHADOW */
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: "#1A1A1A",
          }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, rgba(26,184,122,0.15), rgba(25,118,210,0.15))",
            color: "#1976D2",
          }}
        >
          {icon}
        </Box>
      </Box>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#1A1A1A",
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
}
