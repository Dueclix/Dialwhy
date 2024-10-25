import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Contacts, Message, PlayCircleFilledOutlined } from "@mui/icons-material";
import { server } from "../LoginSignup";
import Cookies from "js-cookie";
import axios from "axios";

function AccountNav() {
  const [showMenu, setShowMenu] = useState(false);
  const { id } = useParams();

  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  
  useEffect(() => {
    const getAllRoomsSingleUser = async () => {
      try {
        const { data } = await axios.get(`${server}/user/rooms/${id}`);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };
    
    if (localStorage.getItem("user")) {
      let storedUser = localStorage.getItem("user");
      if (storedUser !== undefined) {
        let parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setTimeout(() => {
          getAllRoomsSingleUser(id); // Ensure user?._id is not undefined
        }, 2500);
      }
    } else {
      navigate("/");
    }
  }, [id, navigate]);

  const logoutHandle = () => {
    Cookies.remove("userId");
    Cookies.remove("userName");
    Cookies.remove("userEmail");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };
  const location = useLocation();
  const [accountLinks, setAccountLinks] = useState([]);
  const getAccountLinks = async () => {
    const { data } = await axios.get(`${server}/get-link`);
    console.log(data);
    setAccountLinks(data.accountNavigation);
  };
  useEffect(() => {
    getAccountLinks();
  }, []);
  return (
    <>
      <nav className="navbar navbar-expand-md mb-4 mb-lg-0 sidenav">
        <Link
          className="d-xl-none d-lg-none d-md-none text-inherit fw-bold"
          to="#"
        >
          Sidebar Menu
        </Link>

        <button
          className="navbar-toggler d-md-none rounded bg-primary text-light"
          type="button"
          onClick={() => setShowMenu(!showMenu)}
        >
          <span className="ti-menu"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${showMenu ? "show" : ""}`}
          id="sidenav"
        >
          <div className="navbar-nav flex-column">
            <div className="border-bottom">
              <div className="m-4">
                <div className="row no-gutters align-items-center">
                  <div className="col-auto">
                    <div className="avater btn-soft-primary">DS</div>
                  </div>
                  <div className="col-auto">
                    <h6 className="d-block font-weight-bold mb-0">
                      {user?.name}
                    </h6>
                    <small className="text-muted">{user?.email}</small>
                  </div>
                </div>
              </div>
            </div>
            <ul className="list-unstyled mb-0">
              {/* <li
                className={`nav-item ${
                  location.pathname === "/my-member" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/my-members">
                  <i class="fa fa-user"></i> My Members
                </Link>
              </li> */}
              <li
                className={`nav-item ${
                  location.pathname === "/account" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/account">
                  <i className="fa fa-user"></i> My Account
                </Link>
              </li>
              <li
                className={`nav-item ${
                  location.pathname === "/change-password" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/change-password">
                  <i className="fa fa-user"></i> Password
                </Link>
              </li>
              <li
                className={`nav-item ${
                  location.pathname === "/rooms" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/rooms">
                  <i className="fa fa-user"></i> My Rooms/Invited
                </Link>
              </li>
              <li className={`nav-item ${
                  location.pathname === "/contacts" ? "active" : ""
                }`}>
                <Link className="nav-link" to="/contacts">
                  <Contacts /> Contacts
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/chat">
                  <Message /> Chat
                </Link>
              </li>
              <li className={`nav-item ${
                  location.pathname === "/tutorials" ? "active" : ""
                }`}>
                <Link className="nav-link" to="/tutorials">
                  <PlayCircleFilledOutlined /> Record Tutorials
                </Link>
              </li>
              <li
                className={`nav-item ${
                  location.pathname === "/video-background" ? "active" : ""
                }`}
              >
                <Link className="nav-link" to="/video-background">
                  <i className="fa fa-user"></i> Video Call Background
                </Link>
              </li>

              <li
                className="nav-item"
              >
                {/* <Link className="nav-link" to="/video-background">
                <i className="fa fa-user"></i>   Invitation List
                </Link> */}
                <a
                  href={"https://dialwhy.com/user-listing.php"}
                  className="nav-link"
                >
                  <i className="fa fa-user"></i> Invitation List
                </a>
              </li>

              {/* {accountLinks.map((link, index) => (
                <li
                  key={index}
                  className={`nav-item ${
                    location.pathname === link.url ? "active" : ""
                  }`}
                >
                  {link.url.includes("https://dialwhy.com") ? (
                    <a href={link.url} className="nav-link">
                      <i className="fa fa-user"></i> {link.title}
                    </a>
                  ) : (
                    <Link to={link.url} className="nav-link">
                      <i className="fa fa-user"></i> {link.title}
                    </Link>
                  )}
                </li>
              ))} */}
              <li className="nav-item">
                <Link className="nav-link" onClick={logoutHandle}>
                  <i class="fa fa-sign-out" aria-hidden="true"></i> Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default AccountNav;
