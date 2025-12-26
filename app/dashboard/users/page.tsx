"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  MenuItem,
  Button,
  Fab,
  Menu,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";

import styles from "./UsersList.module.css";

/* ---------------- TYPES ---------------- */
type User = {
  id: number;
  fullName: string;
  mobile: string;
  email?: string | null;
  proofType: "AADHAR" | "PAN";
  proofNumber: string;
};

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info";
};

/* ---------------- PAGE ---------------- */
export default function UsersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const [form, setForm] = useState<Omit<User, "id">>({
    fullName: "",
    mobile: "",
    email: "",
    proofType: "AADHAR",
    proofNumber: "",
  });

  /* ---------------- FETCH USERS ---------------- */
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/dashboard/api/users", {
          credentials: "include",
        });
        const data = await res.json();

        if (active) setUsers(data.users || []);
      } catch (err) {
        console.error("FETCH_USERS_ERROR", err);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const refreshUsers = async () => {
    const res = await fetch("/dashboard/api/users", {
      credentials: "include",
    });
    const data = await res.json();
    setUsers(data.users || []);
  };

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase();

    return (
      user.fullName.toLowerCase().includes(q) ||
      user.mobile.includes(q) ||
      (user.email ?? "").toLowerCase().includes(q) ||
      user.proofNumber.toLowerCase().includes(q)
    );
  });

  /* ---------------- MENU ---------------- */
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  /* ---------------- CREATE ---------------- */
  const handleOpenCreate = () => {
    setEditingUser(null);
    setForm({
      fullName: "",
      mobile: "",
      email: "",
      proofType: "AADHAR",
      proofNumber: "",
    });
    setOpen(true);
  };

  /* ---------------- EDIT ---------------- */
  const handleOpenEdit = () => {
    if (!selectedUser) return;

    setEditingUser(selectedUser);
    setForm({
      fullName: selectedUser.fullName,
      mobile: selectedUser.mobile,
      email: selectedUser.email || "",
      proofType: selectedUser.proofType,
      proofNumber: selectedUser.proofNumber,
    });
    setOpen(true);
    handleMenuClose();
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    try {
      if (!form.fullName || !form.mobile || !form.proofNumber) {
        setSnackbar({
          open: true,
          message: "Please fill all required fields",
          severity: "error",
        });
        return;
      }

      if (editingUser) {
        await fetch(`/dashboard/api/users/${editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        });

        setSnackbar({
          open: true,
          message: "User updated successfully",
          severity: "success",
        });
      } else {
        await fetch("/dashboard/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        });

        setSnackbar({
          open: true,
          message: "User created successfully",
          severity: "success",
        });
      }

      setOpen(false);
      refreshUsers();
    } catch {
      setSnackbar({
        open: true,
        message: "Something went wrong",
        severity: "error",
      });
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async () => {
    if (!selectedUser) return;

    await fetch(`/dashboard/api/users/${selectedUser.id}`, {
      method: "DELETE",
      credentials: "include",
    });

    setDeleteOpen(false);
    handleMenuClose();
    refreshUsers();

    setSnackbar({
      open: true,
      message: "User deleted successfully",
      severity: "success",
    });
  };

  /* ---------------- RENDER ---------------- */
  return (
    <Box className={styles.container}>
      {/* HEADER */}
      <Box
        className={styles.header}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="h5">Users</Typography>

        <TextField
          size="small"
          placeholder="Search name, mobile, email, Aadhar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ width: isMobile ? "100%" : 320 }}
        />
      </Box>

      {/* TABLE */}
      <Box className={styles.tableWrapper}>
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table stickyHeader size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Full Name</TableCell>
                {!isMobile && (
                  <TableCell sx={{ fontWeight: 600 }}>Mobile</TableCell>
                )}
                {!isMobile && (
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                )}
                <TableCell sx={{ fontWeight: 600 }}>Proof</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {!loading &&
                filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.fullName}</TableCell>
                    {!isMobile && <TableCell>{user.mobile}</TableCell>}
                    {!isMobile && <TableCell>{user.email || "-"}</TableCell>}
                    <TableCell>{user.proofType}</TableCell>

                    <TableCell align="center">
                      {!isMobile ? (
                        <>
                          <IconButton
                            size="small"
                            onClick={() =>
                              router.push(
                                `/dashboard/users/${user.id}/insurances`
                              )
                            }
                          >
                            <VisibilityIcon />
                          </IconButton>

                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, user)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </>
                      ) : (
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, user)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* ACTION MENU */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            if (!selectedUser) return;
            router.push(`/dashboard/users/${selectedUser.id}/insurances`);
            handleMenuClose();
          }}
        >
          Insurances
        </MenuItem>

        <MenuItem onClick={handleOpenEdit}>Edit</MenuItem>

        <MenuItem
          onClick={() => setDeleteOpen(true)}
          sx={{ color: "error.main" }}
        >
          Delete
        </MenuItem>
      </Menu>

      {/* FAB */}
      <Fab className={styles.fab} onClick={handleOpenCreate}>
        <AddIcon />
      </Fab>

      {/* CREATE / EDIT DIALOG */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen={isMobile}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingUser ? "Edit User" : "Create User"}</DialogTitle>

        <DialogContent className={styles.dialogContent}>
          <TextField
            label="Full Name"
            fullWidth
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />

          <TextField
            label="Mobile Number"
            fullWidth
            required
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          />

          <TextField
            label="Email (Optional)"
            fullWidth
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <TextField
            select
            label="Proof Type"
            fullWidth
            required
            value={form.proofType}
            onChange={(e) =>
              setForm({
                ...form,
                proofType: e.target.value as any,
              })
            }
          >
            <MenuItem value="AADHAR">Aadhar</MenuItem>
            <MenuItem value="PAN">PAN</MenuItem>
          </TextField>

          <TextField
            label="Proof Number"
            fullWidth
            required
            value={form.proofNumber}
            onChange={(e) => setForm({ ...form, proofNumber: e.target.value })}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRM */}
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

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
