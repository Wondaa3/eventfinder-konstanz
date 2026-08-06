import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// Gemeinsamer Rahmen für alle Seiten. Die aktive Route landet im <Outlet />.
function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <>
      <header>
        <h1>LatePass</h1>
        <nav>
          <Link to="/">Events</Link>
          <Link to="/neu">Event eintragen</Link>
          {isAuthenticated ? (
            <>
              <span>Hi, {user?.name}</span>
              <a href="#" onClick={handleLogout}>Logout</a>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Registrieren</Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>2026 LatePass</p>
        <nav>
          <a href="#">Impressum</a>
          <a href="#">Datenschutz</a>
        </nav>
      </footer>
    </>
  );
}

export default Layout;
