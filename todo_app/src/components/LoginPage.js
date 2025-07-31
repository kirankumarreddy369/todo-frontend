import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
// MUI imports
import { Box, TextField, Button, Typography, Alert, Paper } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Define a custom theme with a custom primary color
const theme = createTheme({
  palette: {
    primary: {
      main: "rgba(231, 212, 127, 1)", // Use 6-digit hex code for correct color rendering
    },
  },
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        form
      );
      const token = res.data.token;
      localStorage.setItem("username", form.username); // Save username
      localStorage.setItem("token", token);
      navigate("/todoshome");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Invalid username or password");
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
        <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
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
            {error && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {error}
              </Alert>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              <Link to="/register" style={{ textDecoration: "none" }}>
                Don't have an account? Register
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
