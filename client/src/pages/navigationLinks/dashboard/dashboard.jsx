import Sidebar from "../../../Components/CommonSections/Sidebar";
import Header from "../../../Components/CommonSections/Header";
import DashboardTable from "./dashboardTable";

const DashboardLink = () => {
  return (
    <div className="flex gap-0 w-full">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <div className="flex justify-between items-center my-10 px-[10px]">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-xl text-white">
              Dialwhy <span className="text-red-500">Dashboard</span> Links
            </h2>
            <p className="text-gray-300">
              This is the list of Dashboard Links.{" "}
            </p>
          </div>
        </div>
        <DashboardTable />
      </div>
    </div>
  );
};

export default DashboardLink;
