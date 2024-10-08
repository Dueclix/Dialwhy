import Sidebar from "../../Components/CommonSections/Sidebar";
import Header from "../../Components/CommonSections/Header";
import { useNavigate } from "react-router-dom";
import DashsmallCards from "./DashsmallCards";
import BookkingTable from "./BookkingTable";
import DashCards from "./DashCards";
import PieCharts from "./PieCharts";
import Requests from "./Requests";
import Chart1 from "./Chart1";
import { useEffect } from "react";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    const userRole = user.role;
    if (userRole.trim().toLowerCase() !== "admin") {
      navigate("/account");
    }
  }, [navigate]);

  return (
    <>
      <div className="grid grid-cols-12 overflow-hidden">
        <div className="col-span-2">
          <Sidebar />
        </div>
        <div className="col-span-10">
          <div>
            <Header />
          </div>
          <div>
            <DashCards />
          </div>
          <div className="flex justify-between m-8">
            <div className="">
              <Chart1 />
            </div>
            <div className="bg-[#232323]  transition-all duration-300 rounded-lg">
              <PieCharts />

              <div className=" items-center flex-col">
                <ul className="text-[#999999] grid grid-cols-2 gap-5 p-8">
                  <li className="flex  gap-2 items-baseline">
                    {" "}
                    <img src="/Ellipse 4.svg" alt="" />
                    Approved
                  </li>
                  <li className="flex  gap-2 items-baseline">
                    {" "}
                    <img src="/Ellipse 4.svg" alt="" />
                    Pending
                  </li>
                  <li className="flex gap-2 items-baseline">
                    {" "}
                    <img src="/Ellipse 4.svg" alt="" />
                    Total
                  </li>
                </ul>
                <p className="text-center mb-4 text-[#999999]">
                  <strong>Dialwhy</strong> Users
                </p>
              </div>
            </div>
          </div>
          <div>{/* <DashsmallCards /> */}</div>

          {/* <div className="grid grid-cols-2">
            <div>
              <Requests />
            </div>
            <div>
              <BookkingTable />
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default LandingPage;
