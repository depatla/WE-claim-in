"use client";

import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { useState } from "react";
import styles from "./NomineeSection.module.css";

/* ================= TYPES ================= */

export type Nominee = {
  id: number;
  nomineeName: string;
  mobile: string;
  relation: string;
};

type Props = {
  insuranceId: number;
  userId: number;
  nominees: Nominee[];
  onRefresh: () => void;
};

/* ================= COMPONENT ================= */

export default function NomineeSection({
  insuranceId,
  userId,
  nominees,
  onRefresh,
}: Props) {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    nomineeName: "",
    mobile: "",
    relation: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  /* ================= VALIDATION ================= */

  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.nomineeName.trim()) e.nomineeName = "Required";

    if (!/^[6-9]\d{9}$/.test(form.mobile))
      e.mobile = "Enter valid 10-digit mobile";

    if (!form.relation.trim()) e.relation = "Required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= SAVE ================= */

  const addNominee = async () => {
    if (!validate()) return;

    try {
      await fetch(
        `/dashboard/api/users/${userId}/insurances/${insuranceId}/nominees`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      setOpen(false);
      setForm({ nomineeName: "", mobile: "", relation: "" });
      setErrors({});
      onRefresh();

      setSnackbar({
        open: true,
        message: "Nominee added successfully",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to add nominee",
        severity: "error",
      });
    }
  };

  /* ================= UI ================= */

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="subtitle1">Nominees</Typography>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Nominee
        </Button>
      </Box>

      {nominees.map((n) => (
        <Paper key={n.id} className={styles.card} elevation={0}>
          <Box className={styles.row}>
            <Box>
              <Typography fontWeight={500}>{n.nomineeName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {n.relation} · {n.mobile}
              </Typography>
            </Box>

            <IconButton size="small">
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Paper>
      ))}

      {/* ===== ADD DIALOG ===== */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Add Nominee</DialogTitle>
        <DialogContent>
          <TextField
            label="Nominee Name"
            fullWidth
            error={!!errors.nomineeName}
            helperText={errors.nomineeName}
            sx={{ mb: 2 }}
            value={form.nomineeName}
            onChange={(e) =>
              setForm({ ...form, nomineeName: e.target.value })
            }
          />

          <TextField
            label="Mobile Number"
            fullWidth
            error={!!errors.mobile}
            helperText={errors.mobile}
            sx={{ mb: 2 }}
            value={form.mobile}
            onChange={(e) =>
              setForm({ ...form, mobile: e.target.value })
            }
          />

          <TextField
            label="Relation"
            fullWidth
            error={!!errors.relation}
            helperText={errors.relation}
            value={form.relation}
            onChange={(e) =>
              setForm({ ...form, relation: e.target.value })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={addNominee}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
