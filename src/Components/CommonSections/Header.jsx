import { useEffect, useState } from "react";

const Header = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("user")) {
      let storedUser = localStorage.getItem("user");
      if (storedUser !== undefined) {
        let parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    }
  }, []);
  return (
    <>
      <div className="relative">
        <div className="bg-[#040404] p-4 sticky top-0 grid grid-cols-3 place-items-start content-baseline">
          {/* name  */}
          <div>
            <p className="text-3xl font-bold text-white">Dashboard</p>
          </div>
          {/* inputs  */}
          <div>
            <div className=" flex items-center w-fit pl-3 pr-3 pt-3 pb-3 rounded-md">
              {/* <input
                type="text"
                className="bg-[#232323] outline-none p-1  border-none w-[300px]"
                placeholder="Search User"
                // onChange={(e) => setPendingUsers(e.target.value)}
              />
              <img src="/Magnifying glass.svg" alt="jshdu" /> */}
            </div>
          </div>

          {/* icons  */}
          <div className="flex gap-4">
            <div className="bg-[#232323] p-3 rounded-md ml-3">
              <img src="/Notification.svg" alt="" />
            </div>
            <div className="bg-[#232323] p-3 rounded-md">
              <img src="/GroupSetting.svg" alt="" />
            </div>
            {/* <div className="bg-[#232323] p-3 rounded-md">
              <img src="/vite.jpg" alt="" />
            </div> */}
            <div className="flex items-center">
              <p className="text-sm text-center">
                Welcome <span className="font-bold">{user?.name}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
