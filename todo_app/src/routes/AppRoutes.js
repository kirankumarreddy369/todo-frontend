import { BrowserRouter, Routes, Route } from "react-router-dom";
import TodoList from "../components/TodoList";
import LoginPage from "../components/LoginPage";
import RegisterPage from "../components/RegisterPage";
import TodoForm from "../components/TodoForm";
import SearchResults from "../components/SearchResults";
import TodoLayout from "../components/TodoLayout";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/todoshome" element={<TodoLayout />}>
            <Route index element={<TodoList />} />
            <Route path="create" element={<TodoForm />} />
            <Route path="edit/:id" element={<TodoForm />} />
            <Route path="search" element={<SearchResults />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
