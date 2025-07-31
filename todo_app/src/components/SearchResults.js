// src/components/SearchResults.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AxiosInstance from "./AxiosIntance"; // Import your Axios instance
import { Box, Typography, Paper, Alert, Chip, Button } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#81d199de",
    },
  },
});

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const query = searchParams.get("description");

  useEffect(() => {
    // setTimeout(() => {
    if (query) {
      AxiosInstance.get(`/todos?description=${encodeURIComponent(query)}`)
        .then((res) => {
          setResults(res.data);
          console.log(res.data);
          setError("");
        })
        .catch((err) => {
          setError("No matching todos found.");
          setResults([]);
        });
    } else {
      // If query is empty, clear results and error
      setResults([]);
      setError("");
    }
  // },2000);
  }, [query]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: 4, minWidth: 350, width: "100%", maxWidth: 600 }}
        >
          <Typography variant="h5" gutterBottom>
            Search Results for "{query}"
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {results.length === 0 ? (
              <Alert severity="info">No todos found.</Alert>
            ) : (
              results.map((todo) => (
                <Paper
                  key={todo.id}
                  elevation={2}
                  sx={{
                    p: 2,
                    bgcolor: todo.done ? "#e8f5e9" : "#fffde7",
                    borderLeft: `6px solid ${
                      todo.done ? "#43a047" : "#fbc02d"
                    }`,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {todo.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Target Date: {new Date(todo.targetDate).toLocaleString()}
                  </Typography>
                  <Chip
                    label={todo.done ? "Completed" : "Pending"}
                    color={todo.done ? "success" : "warning"}
                    variant="outlined"
                  />
                </Paper>
              ))
            )}
            {/* Home Button */}
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="primary"
                href="/todoshome"
              >
                Go To Home
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
