import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Tooltip,
  IconButton,
  Box,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import CircularProgress from "@mui/material/CircularProgress";

import AxiosInstance from "./AxiosIntance";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTodos = () => {
    setIsLoading(true);
    // setTimeout(() => {
    AxiosInstance.get("/todos")
      .then((res) => {
        const data = res.data;
        setTodos(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(
          "Failed to fetch todos:",
          err.response?.data || err.message
        );
        setTodos([]); // Optional: clear list on error
      })
      .finally(() => setIsLoading(false));
    //  }, 2000);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Delete todo by id
  const deleteTodo = (id) => {
    AxiosInstance.delete(`/todos/${id}`)
      .then(fetchTodos)
      .catch((err) => {
        console.error(
          "Failed to delete todo:",
          err.response?.data || err.message
        );
      });
  };

  // Mark todo as completed
  const markComplete = (todo) => {
    AxiosInstance.put(`todos/${todo.id}`, {
      ...todo,
      done: true,
    })
      .then(() => fetchTodos())
      .catch((err) => {
        console.error("Failed to mark todo as complete:", err);
      });
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        📋 All Todos
      </Typography>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            my: 4,
          }}
        >
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Page is loading...</Typography>
        </Box>
      ) : todos.length === 0 ? (
        <Typography>No todos found !</Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ maxWidth: 700, margin: "auto" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {todos.map((todo) => (
                <TableRow
                  key={todo.id}
                  sx={{
                    backgroundColor: todo.done ? "#e6ffe6" : "#fffbe6",
                  }}
                >
                  <TableCell>{todo.description}</TableCell>
                  <TableCell>
                    {new Date(todo.targetDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      if (todo.done) {
                        return (
                          <span style={{ color: "green", fontWeight: "bold" }}>
                            Completed
                          </span>
                        );
                      }
                      const dueDate = new Date(todo.targetDate);
                      const today = new Date();

                      if (dueDate < today) {
                        return (
                          <span
                            style={{ color: "#e53935", fontWeight: "bold" }}
                          >
                            Pending
                          </span>
                        );
                      }
                      return (
                        <span style={{ color: "#f39c12", fontWeight: "bold" }}>
                          In Progress
                        </span>
                      );
                    })()}
                  </TableCell>

                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        color="info"
                        size="small"
                        onClick={() => navigate(`/todoshome/edit/${todo.id}`)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => deleteTodo(todo.id)}
                        sx={{ mr: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>

                    {!todo.done && (
                      <Tooltip title="Mark as Complete">
                        <IconButton
                          color="success"
                          size="small"
                          onClick={() => markComplete(todo)}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
