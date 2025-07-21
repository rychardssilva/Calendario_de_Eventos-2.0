import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./frontend/pages/LoginPage";
import RegisterPage from "./frontend/pages/RegisterPage";
import DashboardAdmin from "./frontend/pages/DashboardAdmin";
import DashboardUser from "./frontend/pages/DashboardUser";
import CreateEventPage from "./frontend/pages/CreateEventPage";
import EventDetailsPage from "./frontend/pages/EventDetailsPage";
import EditEventPage from "./frontend/pages/EditEventPage";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/user" element={<DashboardUser />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/event/:id" element={<EventDetailsPage />} />
        <Route path="/edit-event/:id" element={<EditEventPage />} />
      </Routes>
    </Router>
  );
}
