import { server } from "../../Components/Account";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const DashCards = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [approvedUsers, setApprovedUsers] = useState(0);
  const [pendingUsers, setPendingUsers] = useState(0);
  const [loading, setLoading] = useState(false);

  const getAllUsers = async () => {
    setLoading(true);
    const { data } = await axios.get(`${server}/user/all-members`);
    setTotalUsers(data.totalUsersCount);
    setApprovedUsers(data.approvedUsers);
    setPendingUsers(data.pendingUsers);
    setLoading(false);
    console.log(data);
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  const cardData = [
    {
      id: 1,
      heading: "Total Members",
      content: ["29%", totalUsers],
      imgsrc: "/Down arrowgreen Arooew.svg",
      goto: "/admin/view-users",
    },
    {
      id: 2,
      heading: "Approved Members",
      content: ["10%", approvedUsers],
      imgsrc: "/Down arrowgreen Arooew.svg",
      goto: "/admin/view-users",
    },
    {
      id: 3,
      heading: "Pending Members",
      content: ["29%", pendingUsers],
      imgsrc: "/Down arrowgreen Arooew.svg",
      goto: "/admin/pending-users",
    },
  ];
  return (
    <div className="grid grid-cols-3 gap-8 p-8">
      {cardData.map((card) => (
        <div
          to={card?.goto}
          key={card.id}
          className="mt-5 p-6 bg-[#232323] text-white rounded-md flex flex-col gap-3 hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <h2 className="card-heading text-lg font-bold text-[#CEAE75]">
              {card.heading}
            </h2>
            <div className="flex items-center gap-1">
              <img src={card.imgsrc} alt=">" />
              <p className="text-xs text-[#00D32F]">{card.content[0]}</p>
            </div>
          </div>

          {loading ? (
            <div>Loading..</div>
          ) : (
            <>
              <p className="text-4xl font-bold text-white">{card.content[1]}</p>
              <p className="text-xs text-[#999999]">{card.content[2]}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashCards;
