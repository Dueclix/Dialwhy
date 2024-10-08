import Sidebar from "../../../components/CommonSections.jsx/Sidebar";
import Header from "../../../components/CommonSections.jsx/Header";
import Flights_table from "./Flights_table";

const Flights_Rules_page = () => {
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2">
        <Sidebar />
      </div>
      <div className="col-span-10">
        <div>
          <Header />
        </div>
        <div>
          <Flights_table />
        </div>
      </div>
    </div>
  );
};

export default Flights_Rules_page;
