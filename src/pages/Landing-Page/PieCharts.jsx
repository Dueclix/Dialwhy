import axios from "axios";
import { useEffect, useState } from "react";
import { PieChart, Pie } from "recharts";
import { server } from "../../Components/Account";


const PieCharts = () => {
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

  const data = [
    { name: "Group A", value: totalUsers },
    { name: "Group B", value: approvedUsers },
    { name: "Group C", value: pendingUsers },
  ];
  
  useEffect(() => {
    getAllUsers();
  }, []);
  return (
   <>
   {
    loading ? <div className="text-center py-16"> Loading...</div> :  <PieChart width={380} height={250}>
    <Pie
      data={data}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={50}
      fill="#CEAE75"
    />
    <Pie
      data={data}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      innerRadius={60}
      outerRadius={80}
      fill="#CEAE75"
      label
    />
  </PieChart>
   }
   </>
  );
};

export default PieCharts;
