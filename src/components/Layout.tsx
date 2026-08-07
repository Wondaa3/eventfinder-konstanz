import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useFavorites } from "../favorites/FavoritesContext";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "nav-link active" : "nav-link";

function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <>
      <header>
        <Link to="/" className="logo">
          LatePass
        </Link>

        <nav aria-label="Hauptnavigation">
          <NavLink to="/" end className={linkClass}>
            Events
          </NavLink>
          <NavLink to="/karte" className={linkClass}>
            Karte
          </NavLink>
          <NavLink to="/neu" className={linkClass}>
            Event eintragen
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/favoriten" className={linkClass}>
                Favoriten
                {favorites.length > 0 && <span className="count">{favorites.length}</span>}
              </NavLink>
              <NavLink to="/profil" className={linkClass}>
                {user?.name}
              </NavLink>
              <button type="button" className="link-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                Registrieren
              </NavLink>
            </>
          )}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>2026 LatePass · Events in ganz Deutschland</p>
        <nav aria-label="Rechtliches">
          <a href="#impressum">Impressum</a>
          <a href="#datenschutz">Datenschutz</a>
        </nav>
      </footer>
    </>
  );
}

export default Layout;
