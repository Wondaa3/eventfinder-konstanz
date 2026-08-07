import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import EventDetailPage from "./pages/EventDetailPage";
import MapPage from "./pages/MapPage";
import FavoritesPage from "./pages/FavoritesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AddEventPage from "./pages/AddEventPage";
import EditEventPage from "./pages/EditEventPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="events/:id" element={<EventDetailPage />} />
        <Route path="karte" element={<MapPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="favoriten" element={<FavoritesPage />} />
          <Route path="neu" element={<AddEventPage />} />
          <Route path="events/:id/bearbeiten" element={<EditEventPage />} />
          <Route path="profil" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
