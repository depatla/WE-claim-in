"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import ShieldIcon from "@mui/icons-material/Security";
import Autocomplete from "@mui/material/Autocomplete";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";

import { useDashboardSidebar } from "../sidebarStore";
import styles from "./DashboardHeader.module.css";

/* ---------------- TYPES ---------------- */
type SearchUser = {
  id: number;
  fullName: string;
  mobile: string;
};

export default function DashboardHeader() {
  const { toggleSidebar } = useDashboardSidebar();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- SEARCH (DEBOUNCED) ---------------- */
  useEffect(() => {
    if (query.length < 3) {
      setOptions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/dashboard/api/users/search?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setOptions(data.users || []);
      } catch (error) {
        console.error("User search failed:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300); // Google-style debounce

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <AppBar position="fixed" elevation={3} className={styles.header}>
      <Toolbar className={styles.toolbar}>
        {/* LEFT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <IconButton className={styles.menuButton} onClick={toggleSidebar}>
            <MenuIcon sx={{ color: "white" }} />
          </IconButton>

          <ShieldIcon sx={{ fontSize: 36, color: "white" }} />

          <Typography variant="h6" className={styles.logo}>
            We<span className={styles.logoAccent}>Claim</span>
          </Typography>
        </Box>

        {/* 🔍 GOOGLE-STYLE USER SEARCH */}
        <Box className={styles.searchWrap}>
          <Autocomplete
            freeSolo
            loading={loading}
            options={options}
            popupIcon={null}
            filterOptions={(x) => x} // disable client filtering
            getOptionLabel={(o) =>
              typeof o === "string" ? o : o.fullName
            }
            onInputChange={(_, value) => setQuery(value)}
            onChange={(_, value: any) => {
              if (value?.id) {
                router.push(`/dashboard/users/${value.id}/insurances`);
              }
            }}
            PaperComponent={(props) => (
              <Paper {...props} className={styles.autocompletePaper} />
            )}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                className={styles.optionRow}
              >
                <Typography className={styles.optionName}>
                  {option.fullName}
                </Typography>

                <Typography className={styles.optionMobile}>
                  {option.mobile}
                </Typography>
              </Box>
            )}
            renderInput={(params) => (
              <Box
                ref={params.InputProps.ref}
                className={styles.searchInner}
              >
                <SearchIcon sx={{ color: "#7b8aa0" }} />

                <InputBase
                  {...params.inputProps}
                  placeholder="Search user by name or mobile"
                />

                {loading && (
                  <CircularProgress
                    size={18}
                    className={styles.searchLoader}
                  />
                )}
              </Box>
            )}
          />
        </Box>

        {/* RIGHT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Badge badgeContent={4} color="error">
            <NotificationsIcon sx={{ color: "white" }} />
          </Badge>

          <IconButton>
            <AccountCircle sx={{ color: "white", fontSize: 28 }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
