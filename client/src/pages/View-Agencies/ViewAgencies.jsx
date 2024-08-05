import Header from "../../components/CommonSections.jsx/Header";
import Sidebar from "../../components/CommonSections.jsx/Sidebar";
import AgenciesInfoSection from "./AgenciesInfoSection";
import { Link } from "react-router-dom";

const ViewAgencies = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col gap-1">
        <Header />
        <div className="flex justify-between items-center my-10 px-[10px]">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-xl">Agents List</h2>
            <p className="text-gray-300">
              This is the list of all the agencies.{" "}
            </p>
          </div>
          <Link
            to="/create-agency"
            className="bg-[#CEAE75] hover:bg-[#CEAE80] hover:text-gray-100 text-white font-bold py-2 px-4 rounded"
          >
            Add New Agency
          </Link>
        </div>
        <AgenciesInfoSection />
      </div>
    </div>
  );
};

export default ViewAgencies;
