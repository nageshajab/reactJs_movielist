import { Link, useNavigate, Outlet } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";
import { toast } from "react-toastify";
import { Dropdown, NavDropdown } from "react-bootstrap";
import { useMsal } from "@azure/msal-react";

const Layout = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const handleOnIdle = () => {
    handleLogout();
    toast.success("User is idle for more than 5 minutes. Logging out!", {
      position: "top-right",
      autoClose: 2000,
    });
    window.location.href = "/login";
  };

  const {} = useIdleTimer({
    timeout: 5 * 60 * 1000, // 5 minutes
    onIdle: handleOnIdle,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    if (instance) instance.logoutPopup();
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            MyApp
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/movielist">
                  Movies
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/mytravel">
                  My Travel
                </Link>
              </li>
            </ul>
            <div className="d-flex">
              {token ? (
                <Dropdown>
                  <Dropdown.Toggle
                    variant="outline-secondary"
                    id="dropdown-basic"
                  >
                    Welcome, {username}!
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/changepassword">
                      Change Password
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Link className="btn btn-outline-primary" to="/login">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="container mt-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
