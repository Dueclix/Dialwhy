import Sidebar from "../../components/CommonSections.jsx/Sidebar";
import Header from "../../components/CommonSections.jsx/Header";
import Flights_List_Travelpot from "./Flights_List_Travelpot";
import Flights_List_Galileo from "./Flights_List_Galileo";
import { Link } from "react-router-dom";

const Flights_All = () => {
  return (
    <div className="grid grid-cols-12 ">
      <div className="col-span-2 ">
        <Sidebar />
      </div>
      <div className="col-span-10">
        <div>
          <Header />
        </div>
        <div className="flex justify-between m-8 items-center">
          <div>
            <p className="text-2xl font-bold mb-1">Flights</p>
            <div className="flex items-center gap-3">
              <p>All Available Airlines</p>
              <p className="text-[#CEAE75] font-semibold">(36)</p>
            </div>
          </div>

          <div>
            <Link
              to={"/"}
              className="bg-[#CEAE75]  text-[#040404] p-4 rounded-md hover:scale-105 duration-300 transition-all"
            >
              Flight Rules
            </Link>
          </div>
        </div>

        {/* flights list for galileo  */}
        <div>
          <Flights_List_Galileo />
        </div>
        <div>
          <Flights_List_Travelpot />
        </div>
      </div>
    </div>
  );
};

export default Flights_All;
