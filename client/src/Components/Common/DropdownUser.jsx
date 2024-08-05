import { VerifiedUserSharp } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const DropdownUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownButtonRef = useRef(null);
  const dropdownPanelRef = useRef(null);

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
  return (
    <div className="relative inline-block bg-[#232323] text-white m-2 ml-4 w-full rounded-md ">
      <div>
        <Link
          // to={"/admin/view-users"}
          ref={dropdownButtonRef}
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="transition-all duration-300 bg-[#232323] rounded-md m-2 flex items-center justify-between"
        >
          <div className="flex gap-2 items-center w-14 text-white">
            {/* <img src="/vite.jpg" alt="" /> */}
            <VerifiedUserSharp />
            Users
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
      {isOpen && (
        <div
          ref={dropdownPanelRef}
          className=" relative left-4 rounded-md mb-4"
        >
          <div
            className="flex flex-col gap-5"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {/* Dropdown items go here */}
            <Link
              to={"/admin/view-users"}
              className="hover:bg-[#040404] hover:text-[#CEAE75] transition-all duration-300 bg-[#232323] p-3 mt-3 rounded-md w-[80%] flex items-center gap-2 border border-[#CEAE75] text-center text-white"
            >
              {/* <img src="/vite.jpg" alt="ef" className="w-10 h-4 mt-1 pl-1" /> */}
              Approved Users
            </Link>
            <Link
              to={"/admin/pending-users"}
              className="hover:bg-[#040404] hover:text-[#CEAE75] transition-all duration-300 bg-[#232323] p-3 mt-3 rounded-md w-[80%] flex items-center gap-2 border border-[#CEAE75] text-center text-white"
            >
              {/* <img src="/vite.jpg" alt="ef" className="w-10 h-4 mt-1 pl-1" /> */}
              Pending Users
            </Link>
            {/* <Link
              to={"/create-user"}
              className="hover:bg-[#040404] hover:text-[#CEAE75] transition-all duration-300 bg-[#232323] p-3 w-[80%] rounded-md  flex items-center gap-3 border border-[#CEAE75] mb-4"
            >
              <img src="/New  User.svg" alt="ef" />
              Add User
            </Link> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownUser;
