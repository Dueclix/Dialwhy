import DropdownLinks from "../../pages/navigationLinks/DropDownLink";
import { Logout, Dashboard } from "@mui/icons-material";
import { server } from "../LoginSignup";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import DropdownUser from "../Common/DropdownUser";
import Cookies from "js-cookie";
import axios from "axios";

const Sidebar = () => {
  // const { isAuthenticated } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownButtonRef = useRef(null);
  const dropdownPanelRef = useRef(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      let storedUser = localStorage.getItem("user");
      if (storedUser !== undefined) {
        let parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } else {
      navigate("/admin/login");
    }
  }, []);

  // Close the dropdown panel if the user clicks outside of it
  const handleClickOutside = (event) => {
    if (
      dropdownButtonRef.current &&
      !dropdownButtonRef.current.contains(event.target) &&
      dropdownPanelRef.current &&
      !dropdownPanelRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleRefresh = () => {
    navigate("/admin-panel");
    window.location.reload();
  };

  const LogoutHandle = () => {
    Cookies.remove("userId");
    Cookies.remove("userName");
    Cookies.remove("userEmail");
    localStorage.removeItem("user");
    navigate("/admin/login");
    window.location.reload();
  };
  const [dashboardLinks, setDashboardLinks] = useState([]);
  const getDashboardLinks = async () => {
    const { data } = await axios.get(`${server}/get-link`);
    console.log(data);
    setDashboardLinks(data.dashboardNavigation);
  };
  useEffect(() => {
    getDashboardLinks();
  }, []);
  return (
    <>
      <div className="px-4 pt-40 pb-5">
        <div className="p-4 mt-2 -z-30 top-6 max-w-[150px] h-32 ml-5 rounded-lg flex justify-center items-center">
          <Link to={"/admin-panel"} onClick={handleRefresh}>
            <img
              src="/dashboard-logo.png"
              alt="ef"
              className="rounded-md h-24 w-64"
            />
          </Link>
        </div>

        {dashboardLinks?.map((item, index) =>
          item.url.startsWith("http") ? (
            <a
              href={item.url}
              className="hover:text-[#040404] text-white transition-all duration-300 bg-[#1f1f1f] p-2 rounded-md w-48 ml-4 flex items-center gap-3 my-2"
            >
              {" "}
              <Dashboard />
              {item.title}
            </a>
          ) : (
            <Link
              to={item?.url}
              className="hover:text-[#040404] text-white transition-all duration-300 bg-[#1f1f1f] p-2 rounded-md w-48 ml-4 flex items-center gap-3 my-2"
              key={item?._id}
            >
              <Dashboard />
              {item?.title}
            </Link>
          )
        )}
        {/* <div className="relative inline-block bg-[#232323] m-4 w-[85%] rounded-md ">
          <div>
            <Link
              to={"/All_Flights"}
              ref={dropdownButtonRef}
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="transition-all duration-300 bg-[#232323] rounded-md m-4 flex items-center justify-between"
            >
              <div className="flex gap-2 items-center">
                <img src="/Airplane.svg" alt="" />
                Flights
              </div>
              <img
                src="/Down-arrow.svg"
                alt=""
                className={`ml-2 -mr-1 h-5 w-3 transform transition-all duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </Link>
          </div>

          {/* Dropdown panel, conditionally rendered based on isOpen state */}
        {/* {isOpen && (
            <div ref={dropdownPanelRef} className=" relative left-4 rounded-md">
              <div
                className="flex flex-col gap-5"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {/* Dropdown items go here */}
        {/* <Link
                  to={"/All_Flights"}
                  className="hover:bg-[#040404] hover:text-[#CEAE75] transition-all duration-300 bg-[#232323] p-3 mt-3 rounded-md w-[80%] flex items-center gap-3 border border-[#CEAE75]"
                >
                  <img src="/Airplane.svg" alt="ef" />
                  All Flights
                </Link> */}
        {/* <Link
                  to={"/Flights_Rules"}
                  className="hover:bg-[#040404] hover:text-[#CEAE75] transition-all duration-300 bg-[#232323] p-3 w-[80%] rounded-md  flex items-center gap-3 border border-[#CEAE75]"
                >
                  <img src="/Document.svg" alt="ef" />
                  Flights Rules
                </Link> */}
        {/* <Link
                  to={"/"}
                  className="hover:bg-[#040404] hover:text-[#CEAE75] transition-all duration-300 bg-[#232323] w-[80%] p-3 mb-3 rounded-md  flex items-center gap-3 border border-[#CEAE75]"
                >
                  <img src="/Document-Create.svg" alt="ef" />
                  Dashbord
                </Link> */}
        {/* </div> */}
        {/* </div> */}
        {/* )}  */}
        {/* </div>  */}
        {/* bokking  */}
        {/* <div>
          <DropdownBooking />
        </div> */}
        {/* Agents  */}
        {/* <div>
          <DropdownAgents />
        </div> */}
        {/* prising  */}
        {/* <div>
          <DropdownPricing />
        </div> */}
        {/* User  */}
        <div className="w-48">
          <DropdownUser />
        </div>

        <div className="w-48">
          <DropdownLinks />
        </div>
        <Link
          onClick={LogoutHandle}
          className="hover:text-[#040404] text-white transition-all duration-300 bg-[#1f1f1f] p-2 rounded-md w-48 ml-4 flex items-center gap-3"
        >
          <Logout className="text-white" />
          Logout
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
