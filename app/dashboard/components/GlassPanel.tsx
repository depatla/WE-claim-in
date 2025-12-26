import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export function GlassPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        height: "100%",
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(0, 0, 0, 0.06)",
        boxShadow: "0 10px 28px rgba(0, 0, 0, 0.08)",
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 600, color: "#1A1A1A" }}
      >
        {title}
      </Typography>

      {children}
    </Paper>
  );
}
