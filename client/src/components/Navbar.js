import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css"; // ✅ Import custom CSS

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/">Panini8 Blogs</Link>
      </div>
      <div className="navbar__links">
        {user ? (
          <>
            <Link to="/create">Create Post</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={logout} className="navbar__button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
