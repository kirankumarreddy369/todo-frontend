import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import LiveClock from "./LiveClock";
// MUI imports
import { Box, Button, Typography,TextField } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";


const theme = createTheme({
  palette: {
    primary: {
      main: "#81d199de",
    },
  },
});

export default function TodoLayout() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
        <Box
          component="header"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2,
            bgcolor: "primary.main",
            color: "#fff",
          }}
        >
          <LiveClock />
          <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }}>
            My Todo App
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {username}
            </Typography>
            <Button
              component={Link}
              to="/"
              variant="text"
              color="inherit"
              size="small"
              sx={{ mt: 0.5, textTransform: "none" }}
              title="Logout"
              onClick={()=>{
                localStorage.removeItem("token");
                localStorage.removeItem("username");
              }}
            >
              ⏻ Logout
            </Button>
          </Box>
        </Box>

        {/* Search bar and Create Todo button */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
            px: 3,
            py: 2,
            bgcolor: "#fafafa",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/todoshome/search?description=${search}`);
            }}
            sx={{ flex: 1, display: "flex", gap: 1 }}
          >
            <TextField
              size="small"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              variant="outlined"
            />
            <Button type="submit" variant="contained" color="primary">
              Search
            </Button>
          </Box>
          <Button
            component={Link}
            to="create"
            variant="contained"
            color="primary"
            sx={{ whiteSpace: "nowrap" }}
          >
            ➕ Create Todo
          </Button>
        </Box>
          <Outlet />
        </Box>
    </ThemeProvider>
  );
}

