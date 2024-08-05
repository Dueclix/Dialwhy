import { getAllPendingUsers } from "../../store/action/User";
import TableContainer from "@mui/material/TableContainer";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { server } from "../../Components/Account";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function createData(name, calories, fat, carbs, protein, status) {
  return { name, calories, fat, carbs, protein, status };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0, "Active"),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3, "Inactive"),
  createData("Eclair", 262, 16.0, 24, 6.0, "Active"),
  createData("Cupcake", 305, 3.7, 67, 4.3, "Inactive"),
  createData("Gingerbread", 356, 16.0, 49, 3.9, "Active"),
];

export default function PendingUsersTable() {
  const [loading, setLoading] = useState(false);
  // const [users, setUsers] = useState([]);
  const { approvedUsers, pendingUsers } = useSelector((state) => state.user);

  console.log(pendingUsers);
  // const getAllUsers = async () => {
  //   setLoading(true);
  //   const { data } = await axios.get(`${server}/user/all-members`);
  //   setUsers(data.pendingUsersDetails);
  //   setLoading(false);
  // };

  const deleteUser = async (userId) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) {
      return; // Exit the function if user cancels
    }
    setLoading(true);
    const { data } = await axios.delete(`${server}/user/delete/${userId}`);
    toast.success(data.message);
    setLoading(false);
    window.location.reload();
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllPendingUsers);
  }, []);
  return (
    <TableContainer component={Paper}>
      {loading ? (
        <div className="bg-[#CEAE75] text-center py-4 mx-auto">Loading...</div>
      ) : (
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
          <TableBody>
            {pendingUsers?.map((row) => (
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
                  {row.approved === true ? "Approved" : "Pending"}
                </TableCell>
                <TableCell
                  sx={{
                    display: "flex",
                    gap: "15px",
                    alignItems: "center",
                    paddingY: "24px",
                    justifyContent: "center",
                  }}
                >
                  <Link to={`/admin/edit-user/${row?._id}`}>
                    <EditNoteIcon />
                  </Link>
                  <button onClick={() => deleteUser(row?._id)}>
                    <DeleteIcon />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}
