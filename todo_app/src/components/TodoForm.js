// src/components/TodoForm.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AxiosInstance from "./AxiosIntance";
import { Box, TextField, Button, Typography, Alert, Paper } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Use the same custom theme as other pages
const theme = createTheme({
  palette: {
    primary: {
      main: "#81d199de",
    },
  },
});

export default function TodoForm() {
  const { id } = useParams(); // used for edit mode
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState("");

  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      AxiosInstance.get(`/todos/${id}`) // ✅ use GET to fetch existing todo
        .then((res) => {
          setDescription(res.data.description);
          setTargetDate(res.data.targetDate.slice(0, 16)); // for datetime-local input
        })
        .catch(() => setError("Todo not found or failed to fetch."));
    }
  }, [id, isEdit]);

  useEffect(() => {
    if(!isEdit){
      setDescription("");
      setTargetDate("");
      setError("");

    }
  },[isEdit])

  const handleSubmit = (e) => {
    e.preventDefault();

    const todoData = {
      description,
      targetDate, // ensure ISO format
    };

    const request = isEdit
      ? AxiosInstance.put(`/todos/${id}`, todoData) // ✅ PUT only when submitting edit
      : AxiosInstance.post("/todos", todoData);

    request
      .then(() => navigate("/todoshome"))
      .catch((err) => {
        const msg =
          err.response?.data?.error || // if backend returns { error: "..." }
          err.response?.data?.message || // if backend returns { message: "..." }
          (typeof err.response?.data === "string" ? err.response.data : null) || // if it's a plain string
          "Something went wrong.";

        setError(msg); // ✅ always a string now
      });
  };

  const getMinDateTime = () => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hour = pad(now.getHours());
    const minute = pad(now.getMinutes());
    return `${year}-${month}-${day}T${hour}:${minute}`;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          bgcolor: "#f5f5f5",
          pt:9,
        }}
      >
        <Paper elevation={3} sx={{ p: 3, minWidth: 350 }}>
          <Typography variant="h5" component="h2" align="center" gutterBottom>
            {isEdit ? "Edit Todo" : "Create New Todo"}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Target Date"
              type="datetime-local"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: getMinDateTime() }}
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {isEdit ? "Update" : "Create"}
            </Button>
            <Button
              component={Link}
              to="/todoshome"
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mt: 1 }}
            >
              Go to Home
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
