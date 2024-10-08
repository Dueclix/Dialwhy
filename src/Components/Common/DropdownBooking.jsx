import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const DropdownBooking = () => {
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
    <div className="relative inline-block bg-[#232323] m-4 w-[85%] rounded-md ">
      <div>
        <Link
          to={"/"}
          ref={dropdownButtonRef}
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="transition-all duration-300 bg-[#232323] rounded-md m-4 flex items-center justify-between"
        >
          <div className="flex gap-2 items-center">
            <img src="/Booking.svg" alt="" />
            Booking
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
        <div ref={dropdownPanelRef} className=" relative left-4 rounded-md">
          <div
            className="flex flex-col gap-5"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {/* Dropdown items go here */}
            <Link
              to={"/"}
              className="hover:bg-[#040404] hover:text-[#CEAE75] transition-all duration-300 bg-[#232323] p-3 mt-3 rounded-md w-[80%] flex items-center gap-3 border border-[#CEAE75]"
            >
              <img src="/Booking.svg" alt="ef" />
              All Booking
            </Link>
            <Link
              to={"/"}
              className="hover:bg-[#040404] hover:text-[#CEAE75] transition-all duration-300 bg-[#232323] p-3 w-[80%] rounded-md  flex items-center gap-3 border border-[#CEAE75]"
            >
              <img src="/Request.svg" alt="ef" />
              All Requests
            </Link>
            <Link
              to={"/"}
              className="hover:bg-[#040404] hover:text-[#CEAE75] transition-all duration-300 bg-[#232323] w-[80%] p-3 mb-3 rounded-md  flex items-center gap-3 border border-[#CEAE75]"
            >
              <img src="/New Request.svg" alt="ef" />
              New Request
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownBooking;
