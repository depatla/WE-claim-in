"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  MenuItem,
  Button,
  Switch,
  Snackbar,
  Alert,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import styles from "./SystemUsers.module.css";

/* ================= TYPES ================= */

type SystemUser = {
  id: number;
  name: string;
  email?: string | null;
  role: "ADMIN" | "AGENT" | "SUPER_ADMIN";
  status: "ACTIVE" | "INACTIVE";
};

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info";
};

/* ================= COMPONENT ================= */

export default function SystemUsersPage() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<SystemUser>>({});

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  /* ================= FETCH USERS (FIXED) ================= */

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await fetch("/dashboard/api/system-users");
        const data = await res.json();

        if (active) {
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error("FETCH_USERS_ERROR", err);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  /* ================= SAVE (CREATE / UPDATE) ================= */

  const handleSave = async () => {
    try {
      if (!form.name || !form.role) {
        setSnackbar({
          open: true,
          message: "Name and role are required",
          severity: "error",
        });
        return;
      }

      if (form.id) {
        await fetch(`/dashboard/api/system-users/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        setSnackbar({
          open: true,
          message: "User updated successfully",
          severity: "success",
        });
      } else {
        await fetch("/dashboard/api/system-users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        setSnackbar({
          open: true,
          message: "User created successfully",
          severity: "success",
        });
      }

      setOpen(false);
      setForm({});
      refreshUsers();
    } catch {
      setSnackbar({
        open: true,
        message: "Something went wrong",
        severity: "error",
      });
    }
  };

  /* ================= REFRESH USERS ================= */

  const refreshUsers = async () => {
    const res = await fetch("/dashboard/api/system-users");
    const data = await res.json();
    setUsers(data.users || []);
  };

  /* ================= STATUS TOGGLE ================= */

  const toggleStatus = async (id: number, active: boolean) => {
    await fetch(`/dashboard/api/system-users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });

    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: active ? "ACTIVE" : "INACTIVE" } : u
      )
    );

    setSnackbar({
      open: true,
      message: "Status updated successfully",
      severity: "success",
    });
  };

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    if (!deleteId) return;

    await fetch(`/dashboard/api/system-users/${deleteId}`, {
      method: "DELETE",
    });

    setDeleteOpen(false);
    setDeleteId(null);
    refreshUsers();

    setSnackbar({
      open: true,
      message: "User deleted successfully",
      severity: "success",
    });
  };

  /* ================= UI ================= */

  return (
    <Box className={styles.container}>
      <Typography variant="h5" className={styles.title}>
        System Users
      </Typography>

      <Paper className={styles.tableWrap}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email || "-"}</TableCell>
                <TableCell>
                  <Chip label={u.role} size="small" />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={u.status === "ACTIVE"}
                    onChange={() =>
                      toggleStatus(u.id, u.status !== "ACTIVE")
                    }
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => {
                      setForm(u);
                      setOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => {
                      setDeleteId(u.id);
                      setDeleteOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Fab
        className={styles.fab}
        onClick={() => {
          setForm({});
          setOpen(true);
        }}
      >
        <AddIcon />
      </Fab>

      {/* ===== ADD / EDIT ===== */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{form.id ? "Edit User" : "Add User"}</DialogTitle>

        <DialogContent className={styles.dialog}>
          <TextField
            label="Full Name"
            fullWidth
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            label="Email"
            fullWidth
            value={form.email || ""}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <TextField
            select
            label="Role"
            fullWidth
            value={form.role || ""}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value as any })
            }
          >
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="AGENT">Agent</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== DELETE CONFIRMATION ===== */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== SNACKBAR ===== */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
