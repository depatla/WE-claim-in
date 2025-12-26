"use client";

import {
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
  Button,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/Security";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Login.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * ✅ If user is already logged in,
   * middleware will redirect,
   * but this prevents UI flicker.
   */
  // useEffect(() => {
  //   fetch("/api/auth/me")
  //     .then((res) => {
  //       if (res.ok) {
  //         router.replace("/dashboard");
  //       }
  //     })
  //     .catch(() => {});
  // }, [router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }
      console.log("Login successful:", data);
      // ✅ Successful login → go to dashboard
      router.replace("/dashboard");
    } catch (err) {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container className={styles.container}>
      {/* LEFT SECTION */}
      <Grid
        component="div"
        size={{ xs: 12, md: 6 }}
        className={styles.leftSection}
        sx={{ bgcolor: "primary.main", color: "#fff" }}
      >
        <ShieldIcon sx={{ fontSize: 90, marginBottom: 2 }} />
        <Typography variant="h3" fontWeight={700}>
          WE CLAIM
        </Typography>
        <Typography
          variant="h6"
          sx={{ mt: 2, opacity: 0.9, maxWidth: 360 }}
        >
          Your trusted partner for seamless insurance processing
        </Typography>
      </Grid>

      {/* RIGHT SECTION */}
      <Grid
        component={Paper}
        elevation={0}
        square
        size={{ xs: 12, md: 6 }}
        className={styles.rightSection}
      >
        <Box
          component="form"
          onSubmit={handleLogin}
          className={styles.formWrapper}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            color="secondary"
            mb={3}
          >
            Welcome Back
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Stack spacing={2} mt={2}>
            <TextField
              label="Email Address"
              fullWidth
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              fullWidth
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                bgcolor: "secondary.main",
                color: "#fff",
                fontWeight: 700,
                py: 1.4,
                borderRadius: "12px",
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Log In"
              )}
            </Button>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
}
