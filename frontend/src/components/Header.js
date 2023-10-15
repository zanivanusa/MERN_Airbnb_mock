import { useContext } from "react";
import { UserContext } from "../userContext";
import { Link } from "react-router-dom";

function Header(props) {
  const userContext = useContext(UserContext);

  return (
    <header className="bg-primary py-3">
      <div className="container d-flex justify-content-between align-items-center">
      <Link to="/" className="text-white text-decoration-none">
        <h1 className="text-white">Air bnb</h1>
      </Link>
        <nav>
          <ul className="list-unstyled mb-0">
            <li className="d-inline-block me-3">
              <Link to="/" className="btn btn-light text-primary">               
                Home
              </Link>
            </li>
            {userContext.user ? (
              <>               
                <li className="d-inline-block me-3">
                  <Link
                    to="/listing"
                    className="btn btn-light text-primary"
                  >
                    Listing
                  </Link>
                </li>
                <li className="d-inline-block me-3">
                  <Link
                    to="/profile"
                    className="btn btn-light text-primary"
                  >
                    Profile
                  </Link>
                </li>
                <li className="d-inline-block">
                  <Link
                    to="/logout"
                    className="btn btn-light text-primary"
                  >
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="d-inline-block me-3">
                  <Link
                    to="/login"
                    className="btn btn-light text-primary"
                  >
                    Login
                  </Link>
                </li>
                <li className="d-inline-block">
                  <Link
                    to="/register"
                    className="btn btn-light text-primary"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
