import { Link, useNavigate } from "react-router-dom";
import { Call, CallEnd } from "@mui/icons-material";
import RegisterModal from "./modals/Register";
import { useState, useEffect } from "react";
import { server } from "../../LoginSignup";
import { appServer } from "../../../utils";
import socket from "../../../utils/socket";
import ForgotModal from "./modals/Forgot";
import LoginModal from "./modals/Login";
import "../../Styles/Navbar/Navbar.css";
import Cookies from "js-cookie";
import axios from "axios";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [CallerData, setCallerData] = useState(null);
  const [NewCallId, setNewCallId] = useState(null);
  const [CallAudio, setCallAudio] = useState(null);
  const handleModalClose = (e) => setShowModal(e);
  const [showModal, setShowModal] = useState("");
  const handleModalShow = (e) => setShowModal(e);
  const [isOpen, setIsOpen] = useState(false);
  const [savedUser, setUser] = useState("");
  const navigate = useNavigate();
  const ws = socket;

  ws.connect();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const logoutHandle = () => {
    Cookies.remove("userId");
    Cookies.remove("userName");
    Cookies.remove("userEmail");
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  let storedUser;
  useEffect(() => {
    storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCallAudio(new Audio("/audios/callring2.mp3"));
      let parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const [navbarLinks, setNavbarLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const getNavbarLinks = async () => {
    setLoading(true);
    const { data } = await axios.get(`${server}/get-link`);
    console.log(data);
    setNavbarLinks(data.navbarNavigation);
    setLoading(false);
  };
  useEffect(() => {
    getNavbarLinks();
  }, []);

  const receiveCall = () => {
    // dispatch(changeRoute(window.location.pathname));
    if (!CallAudio) return;
    CallAudio.pause();
    CallAudio.currentTime = 0;
    navigate(`/vc/${NewCallId}`);
  };

  const declineCall = () => {
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    ws.emit("declined", {
      callId: NewCallId,
      from: CallerData._id,
      to: userId,
    });
    setNewCallId(null);
    setCallerData(null);
    if (!CallAudio) return;
    CallAudio.pause();
    CallAudio.currentTime = 0;
  };

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user"))._id;

    const handleCalling = async (data) => {
      if (data.to === userId) {
        ws.emit("ringing", data);

        try {
          const response = await axios.post(`${appServer}/api/v1/user/userId`, {
            userId: data?.from,
          });

          setNewCallId(data.callId);
          setCallerData(response.data);

          try {
            if (CallAudio) {
              CallAudio.play();

              setTimeout(() => {
                setNewCallId(undefined);
                setCallerData(undefined);
                CallAudio.pause();
                CallAudio.currentTime = 0;
              }, 15000);
            }
          } catch (err) {
            console.log("got error in running audio file.", err);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    ws.on("calling", handleCalling);

    return () => {
      ws.off("calling", handleCalling);
    };
  }, [CallAudio, ws]);

  return (
    <>
      {/* <Loader /> */}
      <div
        id="sticky-header"
        className={`${
          isScrolled ? "bg-white position-fixed" : ""
        } digecoly-nav-menu d-lg-flex d-none`}
        style={{ top: 0, left: 0, right: 0, zIndex: 1000 }}
      >
        <div className="container" id="nav">
          <div className="row mx-0 align-items-center">
            <div className="">
              <div className="logo">
                <Link className="logo_img" to={"/"} title="Constre">
                  <img src="https://dialwhy.com/logo/vite.jpg" alt="logo" />
                </Link>
                {/* <Link className="main_sticky" to={"/"} title="Constre">
                  <img
                    src="assets/images/dialwhy logo/dial-07.png"
                    alt="logo"
                  />
                </Link> */}
              </div>
            </div>
            <div className="flex-grow-1 pl-0">
              <nav className="digecoly-menu d-flex align-items-center justify-content-end">
                <ul className="nav_scroll bg-slate-600">
                  <li className="digecoly-list-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="digecoly-list-item">
                    <a href={"https://dialwhy.com/about_us.php"}>About</a>
                  </li>
                  <li className="digecoly-list-item">
                    <a href={"https://dialwhy.com/contact_us.php"}>
                      Contact Us
                    </a>
                  </li>
                  {savedUser ? (
                    <li className="digecoly-list-item">
                      <Link to="/account">Account</Link>
                    </li>
                  ) : (
                    <>
                      <li className="digecoly-list-item">
                        <Link to="/login">Login</Link>
                      </li>
                      <li className="digecoly-list-item">
                        <Link to="/login">Register</Link>
                      </li>
                    </>
                  )}
                  {/* {navbarLinks.map((item) => (
                    <li key={item.url}>
                      {item.url.startsWith("http") ? (
                        <a href={item.url}>{item.title}</a>
                      ) : (
                        <>
                          {item.url === "/account" && savedUser && (
                            <Link to={item.url}>{item.title}</Link>
                          )}
                          {(item.url === "/login" ||
                            item.url === "/register") &&
                            !savedUser && (
                              <Link to={item.url}>{item.title}</Link>
                            )}
                          {item.url !== "/account" &&
                            item.url !== "/login" &&
                            item.url !== "/register" && (
                              <Link to={item.url}>{item.title}</Link>
                            )}
                        </>
                      )}
                    </li>
                  ))} */}

                  {/* {savedUser && (
                    <li>
                      <Link to="/account">Account</Link>
                    </li>
                  )}
                  {!savedUser && (
                    <>
                      <li>
                        <Link to="/login">Login</Link>
                      </li>
                      <li>
                        <Link to="/login">Register</Link>
                      </li>
                    </>
                  )} */}
                </ul>
                {/* <div className="header-btn">
                  <Link to="/get-quote">
                    Get A Quote<i className="bi bi-arrow-right"></i>
                  </Link>
                </div> */}
                <div className="header-btn d-flex align-items-center">
                  {/* <select
                    className="form-select language_select"
                    style={{ width: "100px" }}
                  >
                    <option selected>Language</option>
                    <option value="en" selected>
                      English
                    </option>
                    <option value="ur">Urdu</option>
                  </select> */}
                  {savedUser && (
                    <div className="profile_dropdown position-relative">
                      <button className="profile_btn" onClick={toggleDropdown}>
                        {savedUser?.name}
                      </button>
                      {dropdownOpen && (
                        <div
                          className="dropdown position-absolute d-flex flex-column align-items-start bg-white py-3 px-3 mt-2 shadow"
                          style={{
                            zIndex: "100",
                            right: "0",
                            minWidth: "200px",
                            borderRadius: "5px",
                          }}
                        >
                          <div className="d-flex align-items-center mb-1">
                            <img
                              src={savedUser?.image?.url}
                              style={{
                                width: "35px",
                                height: "35px",
                                border: "1px solid black",
                                borderRadius: "50%",
                              }}
                              alt="User Avatar"
                            />
                            <div className="d-flex ml-1 flex-column align-items-start">
                              <p
                                style={{
                                  fontWeight: "bold",
                                  marginLeft: "3px",
                                }}
                              >
                                {savedUser?.name}
                              </p>
                              <Link
                                to={"/account"}
                                className="bg-none"
                                style={{
                                  background: "white",
                                  border: "none",
                                  color: "black",
                                  padding: "0px 0",
                                  marginLeft: "3px",
                                }}
                              >
                                View Profile
                              </Link>
                            </div>
                          </div>
                          <hr />
                          {/* <Link
                            to="/settings"
                            style={{
                              background: "none",
                              border: "0",
                              color: "gray",
                              padding: "10px 0",
                            }}
                          >
                            Settings
                          </Link> */}
                          <Link
                            style={{
                              background: "none",
                              border: "0",
                              color: "gray",
                              padding: "10px 40px",
                              textAlign: "center",
                            }}
                            onClick={logoutHandle}
                          >
                            Logout
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="d-lg-none position-relative mobile_header">
        <div className="container-fluid">
          <div className="row mx-0 w-100 flex-wrap align-items-center flex-row flex">
            <div className="col-6 d-flex justify-content-start">
              <Link className="logo_img" href="/">
                <img src="assets/images/dialwhy logo/dial-10.png" alt="logo" />
              </Link>
            </div>
            <div className="col-6 d-flex justify-content-end text-end">
              {isOpen ? (
                <>
                  <h1
                    className="text-white -mr-2"
                    style={{ fontSize: "50px", fontWeight: "300" }}
                    onClick={toggleMenu}
                  >
                    &times;
                  </h1>
                </>
              ) : (
                <></>
              )}
              <Link
                to="#nav"
                className={`meanmenu-reveal me-0 ms-auto ${
                  isOpen ? "meanclose d-none" : "d-block"
                }`}
                onClick={toggleMenu}
              >
                {isOpen ? (
                  <></>
                ) : (
                  <>
                    <span></span> <span></span> <span></span>
                  </>
                )}
              </Link>
            </div>
          </div>
          {/* <div className="mean-push"></div> */}
        </div>

        <nav className="mean-nav">
          <ul className={`nav_scroll ${isOpen ? "" : "d-none"}`}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <a href="about_us.php">About</a>
            </li>
            <li className="mean-last">
              <a href="contact_us.php">Contact</a>
            </li>
            <li className="mean-last">
              <Link to="/account">Account</Link>
            </li>
            <li className="mean-last">
              <Link to="/login">Login</Link>
            </li>
            <li className="mean-last">
              <Link to="/signup">Sign Up</Link>
            </li>
          </ul>
        </nav>
      </div>
      <LoginModal
        show={showModal === "login"}
        handleClose={handleModalClose}
        handleModalShow={handleModalShow}
      />
      <RegisterModal
        show={showModal === "register"}
        handleClose={handleModalClose}
        handleModalShow={handleModalShow}
      />
      <ForgotModal
        show={showModal === "forgot"}
        handleClose={handleModalClose}
        handleModalShow={handleModalShow}
      />

      {CallerData !== null && (
        <div
          className="d-flex justify-content-between px-4 py-1 position-fixed h-auto bg-info text-white"
          style={{ top: 0, left: 0, right: 0, zIndex: 1000 }}
        >
          <h2 className="w-75 d-flex align-items-center">{CallerData?.name}</h2>
          <div className="w-25 d-flex align-items-center justify-content-center">
            <button
              className="bg-green-600 p-md-3 p-sm-2 mx-3 rounded-full"
              onClick={receiveCall}
            >
              <Call />
            </button>
            <button
              className="bg-danger p-md-3 p-sm-2 mx-3 rounded-full"
              onClick={declineCall}
            >
              <CallEnd />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
