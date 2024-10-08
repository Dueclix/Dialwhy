import Sidebar from "../../Components/CommonSections/Sidebar";
import { getAllPendingUsers } from "../../store/action/User";
import TableContainer from "@mui/material/TableContainer";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../Components/LoginSignup";
import DeleteIcon from "@mui/icons-material/Delete";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import toast from "react-hot-toast";
import axios from "axios";

const PendingUsers = () => {
  const dispatch = useDispatch();
  const { pendingUsers } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [searchUserInput, setSearchUserInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const changeCurrentPage = (n) => {
    setCurrentPage(n);
  };

  const prePage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < npage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const [user, setUser] = useState([]);
  useEffect(() => {
    if (localStorage.getItem("user")) {
      let storedUser = localStorage.getItem("user");
      if (storedUser !== undefined) {
        let parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    }
  }, []);
  useEffect(() => {
    dispatch(getAllPendingUsers());
  }, [dispatch]);

  const deleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.delete(`${server}/user/delete/${userId}`);
      toast.success(data.message);
      // Refresh data after deletion
      dispatch(getAllPendingUsers());
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search input
  useEffect(() => {
    if (searchUserInput.trim() === "") {
      setFilteredUsers(pendingUsers);
    } else {
      const filteredResults = pendingUsers.filter((user) =>
        user.name.toLowerCase().includes(searchUserInput.toLowerCase())
      );
      setFilteredUsers(filteredResults);
    }
  }, [pendingUsers, searchUserInput]);

  // Function to handle search input change
  const handleSearchInputChange = (e) => {
    setSearchUserInput(e.target.value);
  };

  // Calculate pagination indexes
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredUsers?.slice(firstIndex, lastIndex);
  const npage = Math.ceil(
    filteredUsers &&
      filteredUsers?.length > 0 &&
      filteredUsers.length / recordsPerPage
  );
  const numbers = Array.from({ length: npage }, (_, i) => i + 1);

  // Display loading message while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex gap-0 w-full">
      <Sidebar />
      <div className="flex flex-col w-full">
        <div className="relative">
          <div className="bg-[#040404] p-4 sticky top-0 grid grid-cols-3 place-items-start content-baseline">
            <div>
              <p className="text-3xl font-bold text-white">Dashboard</p>
            </div>
            <div>
              <div className="flex items-center w-fit pl-3 pr-3 pt-3 pb-3 rounded-md">
                {/* <input
                  type="text"
                  className="bg-[#232323] outline-none p-1 border-none w-[300px]"
                  placeholder="Search User"
                  value={searchUserInput}
                  onChange={handleSearchInputChange}
                />
                <img src="/Magnifying glass.svg" alt="Search" /> */}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-[#232323] p-3 rounded-md ml-3">
                <img src="/Notification.svg" alt="" />
              </div>
              <div className="bg-[#232323] p-3 rounded-md">
                <img src="/GroupSetting.svg" alt="" />
              </div>
              <div className="flex items-center">
                <p className="text-sm text-center">
                  Welcome <span className="font-bold">{user?.name}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center my-10 px-[10px]">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-xl text-white">
              Dialwhy <span className="text-red-500">Pending</span> Members
            </h2>
            <p className="text-gray-300">
              This is the list of all the Pending members.
            </p>
          </div>
          <div className="bg-[#232323] flex items-center w-fit pl-3 pr-3 mr-6 pt-2 pb-2 mb-2 rounded-md">
            <input
              type="text"
              className="bg-[#232323] outline-none p-1  border-none w-[300px]"
              placeholder="Search User"
              value={searchUserInput}
              onChange={handleSearchInputChange}
            />
            <img src="/Magnifying glass.svg" alt="jshdu" />
          </div>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ bgcolor: "#CEAE75" }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="left">Phone No</TableCell>
                <TableCell align="left">Country</TableCell>
                <TableCell align="left">Role</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="bg-black text-white">
              {records?.map((row) => (
                <TableRow
                  key={row.email}
                  sx={{
                    "td, th": {
                      border: 1,
                      borderColor: "#0F0F0F",
                      bgcolor: "black",
                      color: "white",
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="center">{row.email}</TableCell>
                  <TableCell align="left">{row.phoneNumber}</TableCell>
                  <TableCell align="left">{row.country}</TableCell>
                  <TableCell align="left">{row.role}</TableCell>
                  <TableCell align="left">
                    {row.approved ? "Approved" : "Pending"}
                  </TableCell>
                  <TableCell>
                    <Link to={`/admin/edit-user/${row._id}`}>
                      <EditNoteIcon />
                    </Link>
                    <button onClick={() => deleteUser(row._id)}>
                      <DeleteIcon />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination */}
          <div className="flex justify-center items-center bg-black text-white pt-3">
            <nav aria-label="Page navigation example">
              <ul className="flex items-center -space-x-px h-10 text-base">
                <li>
                  <button
                    className={`flex items-center justify-center px-4 h-10 leading-tighttext-white ${
                      currentPage === 1
                        ? "bg-gray-200 cursor-not-allowed text-red-500 "
                        : " border border-gray-300 hover:bg-gray-100 hover:text-black"
                    }`}
                    onClick={prePage}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">Previous</span>
                    &lt;
                  </button>
                </li>
                {numbers.map((n) => (
                  <li key={n}>
                    <button
                      className={`flex items-center justify-center px-4 h-10 leading-tight  ${
                        currentPage === n
                          ? "bg-blue-50 text-black border-blue-300"
                          : "bg-black  border border-gray-300 hover:bg-gray-100 hover:text-black"
                      }`}
                      onClick={() => changeCurrentPage(n)}
                    >
                      {n}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    className={`flex items-center justify-center px-4 h-10 leading-tight  ${
                      currentPage === npage
                        ? "bg-gray-200 cursor-not-allowed"
                        : "border border-gray-300 hover:bg-gray-100 hover:text-black"
                    }  ${currentPage === npage && "text-red-500"}`}
                    onClick={nextPage}
                    disabled={currentPage === npage}
                  >
                    <span className="sr-only">Next</span>
                    &gt;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </TableContainer>
      </div>
    </div>
  );
};

export default PendingUsers;
