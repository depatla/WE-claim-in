"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DateTime } from "luxon";

import {
  Box,
  Typography,
  Paper,
  IconButton,
  Collapse,
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Divider,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import NomineeSection, { Nominee } from "../../../components/NomineeSection";

import styles from "./InsuranceList.module.css";

/* ================= TYPES ================= */

type Insurance = {
  id: number;
  companyName: string;
  insuranceNumber: string;
  insuranceType: string;
  insuranceFromDate: string;
  insuranceToDate: string;
  insuranceAmount?: number;
  nominees: Nominee[];
};

type User = {
  id: number;
  fullName: string;
  mobile: string;
};

/* ================= HELPERS ================= */

const formatIndianDate = (date: string) =>
  DateTime.fromISO(date).setZone("Asia/Kolkata").toFormat("dd LLL yyyy");

const getInsuranceStatus = (toDate: string) => {
  const today = DateTime.now().setZone("Asia/Kolkata").startOf("day");

  const endDate = DateTime.fromISO(toDate).startOf("day");

  return endDate < today
    ? { label: "Expired", color: "error.main" }
    : { label: "Active", color: "success.main" };
};
const toDateInputValue = (date: string) =>
  DateTime.fromISO(date)
    .setZone("Asia/Kolkata")
    .toFormat("yyyy-MM-dd");

/* ================= COMPONENT ================= */

export default function InsurancePage() {
  const { userId } = useParams<{ userId: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [user, setUser] = useState<User | null>(null);
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedInsurance, setSelectedInsurance] = useState<Insurance | null>(
    null
  );

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  /* -------- FORM STATE -------- */

  const [form, setForm] = useState({
    companyName: "",
    insuranceNumber: "",
    insuranceType: "",
    insuranceFromDate: "",
    insuranceToDate: "",
    insuranceAmount: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  /* ================= FETCH ================= */

  const fetchData = async () => {
    const res = await fetch(`/dashboard/api/users/${userId}/insurances`);
    const data = await res.json();
    setUser(data.user);
    setInsurances(data.insurances || []);
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  /* ================= VALIDATION ================= */

  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.companyName.trim()) e.companyName = "Required";
    if (!form.insuranceNumber.trim()) e.insuranceNumber = "Required";
    if (!form.insuranceType.trim()) e.insuranceType = "Required";
    if (!form.insuranceFromDate) e.insuranceFromDate = "Required";
    if (!form.insuranceToDate) e.insuranceToDate = "Required";

    if (
      form.insuranceFromDate &&
      form.insuranceToDate &&
      new Date(form.insuranceToDate) <= new Date(form.insuranceFromDate)
    ) {
      e.insuranceToDate = "Must be after From Date";
    }

    if (form.insuranceAmount && Number(form.insuranceAmount) <= 0) {
      e.insuranceAmount = "Must be greater than 0";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= CREATE ================= */

  const saveInsurance = async () => {
    if (!validate()) return;

    await fetch(`/dashboard/api/users/${userId}/insurances`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        userId: Number(userId),
      }),
    });

    setOpenAdd(false);
    resetForm();
    fetchData();

    setSnackbar({
      open: true,
      message: "Insurance added successfully",
      severity: "success",
    });
  };

  /* ================= UPDATE ================= */

  const updateInsurance = async () => {
    if (!selectedInsurance || !validate()) return;

    await fetch(`/dashboard/api/users/${userId}/insurances/${selectedInsurance.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setOpenEdit(false);
    setSelectedInsurance(null);
    resetForm();
    fetchData();

    setSnackbar({
      open: true,
      message: "Insurance updated successfully",
      severity: "success",
    });
  };

  /* ================= DELETE ================= */

  const deleteInsurance = async () => {
    if (!selectedInsurance) return;

    await fetch(`/dashboard/api/users/${userId}/insurances/${selectedInsurance.id}`, {
      method: "DELETE",
    });

    setOpenDelete(false);
    setSelectedInsurance(null);
    fetchData();

    setSnackbar({
      open: true,
      message: "Insurance deleted successfully",
      severity: "success",
    });
  };

  const resetForm = () => {
    setForm({
      companyName: "",
      insuranceNumber: "",
      insuranceType: "",
      insuranceFromDate: "",
      insuranceToDate: "",
      insuranceAmount: "",
    });
    setErrors({});
  };

  /* ================= UI ================= */

  return (
    <Box className={styles.container}>
      {/* HEADER */}
      <Box className={styles.header}>
        <Typography variant="h5">Insurances</Typography>
        {user && (
          <Typography variant="body2">
            {user.fullName} · {user.mobile}
          </Typography>
        )}
      </Box>

      {/* CONTENT */}
      <Box className={styles.content}>
        {insurances.map((ins) => (
          <Paper key={ins.id} className={styles.insuranceCard}>
            <Box className={styles.insuranceHeader}>
              <Box>
                <Typography variant="h6">{ins.companyName}</Typography>

                <Typography variant="body2">
                  {ins.insuranceNumber} · {ins.insuranceType}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {formatIndianDate(ins.insuranceFromDate)} →{" "}
                    {formatIndianDate(ins.insuranceToDate)}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: getInsuranceStatus(ins.insuranceToDate).color,
                    }}
                  >
                    • {getInsuranceStatus(ins.insuranceToDate).label}
                  </Typography>
                </Box>

                {ins.insuranceAmount && (
                  <Typography variant="caption" color="text.secondary">
                    Amount: ₹{ins.insuranceAmount}
                  </Typography>
                )}
              </Box>

              <Box>
                <IconButton
                  onClick={() =>
                    setExpandedId(expandedId === ins.id ? null : ins.id)
                  }
                >
                  <ExpandMoreIcon />
                </IconButton>

                <IconButton
                  onClick={(e) => {
                    setMenuAnchor(e.currentTarget);
                    setSelectedInsurance(ins);
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Box>

            <Divider />

            <Collapse in={expandedId === ins.id}>
              <NomineeSection
                insuranceId={ins.id}
                userId={Number(userId)}
                nominees={ins.nominees}
                onRefresh={fetchData}
              />
            </Collapse>
          </Paper>
        ))}
      </Box>

      {/* MENU */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            if (!selectedInsurance) return;

            setForm({
              companyName: selectedInsurance.companyName,
              insuranceNumber: selectedInsurance.insuranceNumber,
              insuranceType: selectedInsurance.insuranceType,
              insuranceFromDate: toDateInputValue(selectedInsurance.insuranceFromDate),
              insuranceToDate: toDateInputValue(selectedInsurance.insuranceToDate),
              insuranceAmount:
                selectedInsurance.insuranceAmount?.toString() || "",
            });

            setOpenEdit(true);
            setMenuAnchor(null);
          }}
        >
          Edit
        </MenuItem>

        <MenuItem
          sx={{ color: "error.main" }}
          onClick={() => {
            setOpenDelete(true);
            setMenuAnchor(null);
          }}
        >
          Delete
        </MenuItem>
      </Menu>

      {/* ADD FAB */}
      <Fab className={styles.fab} onClick={() => setOpenAdd(true)}>
        <AddIcon />
      </Fab>

      {/* ADD / EDIT DIALOG */}
      <Dialog
        open={openAdd || openEdit}
        onClose={() => {
          setOpenAdd(false);
          setOpenEdit(false);
          resetForm();
        }}
        fullScreen={isMobile}
        fullWidth
      >
        <DialogTitle>
          {openEdit ? "Edit Insurance" : "Add Insurance"}
        </DialogTitle>

        <DialogContent>
          {[
            ["Company", "companyName"],
            ["Insurance Number", "insuranceNumber"],
            ["Insurance Type", "insuranceType"],
          ].map(([label, key]) => (
            <TextField
              key={key}
              label={label}
              fullWidth
              sx={{ mb: 2 }}
              error={!!errors[key]}
              helperText={errors[key]}
              value={(form as any)[key]}
              onChange={(e) =>
                setForm({
                  ...form,
                  [key]: e.target.value,
                })
              }
            />
          ))}

          <TextField
            label="From Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
            error={!!errors.insuranceFromDate}
            helperText={errors.insuranceFromDate}
            value={form.insuranceFromDate}
            onChange={(e) =>
              setForm({
                ...form,
                insuranceFromDate: e.target.value,
              })
            }
          />

          <TextField
            label="To Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
            error={!!errors.insuranceToDate}
            helperText={errors.insuranceToDate}
            value={form.insuranceToDate}
            onChange={(e) =>
              setForm({
                ...form,
                insuranceToDate: e.target.value,
              })
            }
          />

          <TextField
            label="Insurance Amount (Optional)"
            type="number"
            fullWidth
            error={!!errors.insuranceAmount}
            helperText={errors.insuranceAmount}
            value={form.insuranceAmount}
            onChange={(e) =>
              setForm({
                ...form,
                insuranceAmount: e.target.value,
              })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpenAdd(false);
              setOpenEdit(false);
              resetForm();
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={openEdit ? updateInsurance : saveInsurance}
          >
            {openEdit ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRM */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Insurance</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this insurance? This will also
            delete all nominees.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={deleteInsurance}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
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
