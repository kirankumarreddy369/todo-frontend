import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Box, TextField, Button, Typography, Alert, Paper } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Use the same custom theme as LoginPage
const theme = createTheme({
  palette: {
    primary: {
      main: "#d2cf19ff",
    },
  },
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (form.password === form.confirmPassword) {
        const res = await axios.post("http://localhost:8080/api/auth/register", form);
        const data = res.data;
        console.log(data);
        navigate("/");
      } else {
        setError("Passwords do not match");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.error || "Registration failed");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
        }}
      >
        <Paper elevation={3} sx={{ p: 3, minWidth: 350 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Register
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2}}
          >
            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              autoFocus
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              inputProps={{
                minLength: 6,
                pattern: "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}",
              }}
              fullWidth
            />
            <Typography variant="caption" color="text.secondary">
              Password must be at least 6 characters, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.
            </Typography>
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              inputProps={{
                minLength: 6,
                pattern: "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}",
              }}
              fullWidth
            />
            {error && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {error}
              </Alert>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Register
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              <Link to="/" style={{ textDecoration: "none" }}>
                Already Have an Account? Login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
