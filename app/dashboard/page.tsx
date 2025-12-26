"use client";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  HourglassTop as HourglassTopIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Folder as FolderIcon,
} from "@mui/icons-material";
import { GlassCard } from "./components/GlassCard";

export default function DashboardPage() {
  return (
    <Box sx={{ maxWidth: "1400px", mx: "auto", mt: 2 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 700,
          color: "#1A1A1A",
        }}
      >
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <GlassCard title="Total Users" value="1200" icon={<PeopleIcon />} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <GlassCard
            title="Claims Submitted"
            value="380"
            icon={<AssignmentIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <GlassCard
            title="Claims In Progress"
            value="92"
            icon={<HourglassTopIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <GlassCard
            title="Approved Claims"
            value="210"
            icon={<CheckCircleIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <GlassCard
            title="Rejected Claims"
            value="45"
            icon={<CancelIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <GlassCard
            title="Pending Documents"
            value="33"
            icon={<FolderIcon />}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
