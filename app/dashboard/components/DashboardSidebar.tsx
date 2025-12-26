"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ShieldIcon from "@mui/icons-material/Security";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { useDashboardSidebar } from "../sidebarStore";
import styles from "./DashboardSidebar.module.css";
import { useRouter } from "next/navigation";

type LoggedInUser = {
  name: string;
  role: string;
};

function SidebarContent({
  user,
  onLogout,
}: {
  user: LoggedInUser | null;
  onLogout: () => void;
}) {
  return (
    <Box className={styles.sidebar}>
      {/* LOGO */}
      <Box className={styles.logo}>
        <ShieldIcon />
        <Typography variant="h6" fontWeight={700}>
          WE<span className={styles.logoAccent}>Claim</span>
        </Typography>
      </Box>

      {/* NAVIGATION */}
      <List className={styles.menu}>
        <ListItemButton href="/dashboard" className={styles.menuItem}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Overview" />
        </ListItemButton>

        <ListItemButton href="/dashboard/users" className={styles.menuItem}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItemButton>
         <ListItemButton href="/dashboard/system-users" className={styles.menuItem}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="System Users" />
        </ListItemButton>

        <ListItemButton href="/dashboard/settings" className={styles.menuItem}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </List>

      {/* USER SECTION */}
      {user && (
        <>
         <Button
            startIcon={<LogoutIcon />}
            onClick={onLogout}
            className={styles.logout}
            fullWidth
          >
            Logout
          </Button>
          <Divider />
          <Box className={styles.userCard}>
            <AccountCircleIcon className={styles.avatar} />
            <Box>
              <Typography fontWeight={600}>{user.name}</Typography>
              <Typography variant="caption" className={styles.role}>
                {user.role.replace("_", " ")}
              </Typography>
            </Box>
          </Box>

         
        </>
      )}
    </Box>
  );
}

export default function DashboardSidebar() {
  const router = useRouter();
  const { sidebarOpen, toggleSidebar } = useDashboardSidebar();
  const [user, setUser] = useState<LoggedInUser | null>(null);

useEffect(() => {
  const controller = new AbortController();

  (async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
        signal: controller.signal,
      });

      console.log("Auth me response status:", res.status);

      if (res.status === 401) {
        window.location.href = "/login"; // hard redirect
        return;
      }

      const data = await res.json();

      if (data?.user) {
        setUser(data.user);
      } else {
       router.replace("/login");
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        // React strict mode cleanup — IGNORE
        return;
      }

      router.replace("/login");
    }
  })();

  return () => {
    controller.abort(); // ✅ correct cleanup
  };
}, [router]);


  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.replace("/login");
  };

  return (
    <>
      {/* MOBILE */}
      <Drawer
        open={sidebarOpen}
        onClose={toggleSidebar}
        sx={{ display: { xs: "block", md: "none" } }}
        PaperProps={{ className: styles.mobile }}
      >
        <SidebarContent user={user} onLogout={handleLogout} />
      </Drawer>

      {/* DESKTOP */}
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <SidebarContent user={user} onLogout={handleLogout} />
      </Box>
    </>
  );
}
