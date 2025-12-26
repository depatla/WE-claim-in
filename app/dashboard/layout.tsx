"use client";

import Box from "@mui/material/Box";
import DashboardHeader from "./components/DashboardHeader";
import DashboardSidebar from "./components/DashboardSidebar";

const HEADER_HEIGHT = 72; // must match header height

export default function DashboardLayout({ children }) {
  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden", // ❗ prevent page scroll
        bgcolor: "#F6F9FC",
      }}
    >
      {/* HEADER */}
      <DashboardHeader />

      {/* BODY */}
      <Box
        sx={{
          display: "flex",
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          pt: `${HEADER_HEIGHT}px`,
        }}
      >
        {/* SIDEBAR (fixed height, no scroll) */}
        <Box
          sx={{
            height: "100%",
            flexShrink: 0,
          }}
        >
          <DashboardSidebar />
        </Box>

        {/* MAIN CONTENT (ONLY THIS SCROLLS) */}
        <Box
          sx={{
            flexGrow: 1,
            height: "100%",
            overflowY: "auto", // ✅ scroll here only
            p: { xs: 2, md: 4 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
