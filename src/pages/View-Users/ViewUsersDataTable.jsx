import TableContainer from "@mui/material/TableContainer";
import EditNoteIcon from "@mui/icons-material/EditNote";
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

export default function ViewUsersDataTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // const getAllUsers = async () => {
  //   setLoading(true);
  //   const { data } = await axios.get(`${server}/user/all-members`);
  //   setUsers(data.approvedUsersDetails);
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

  // useEffect(() => {
  //   getAllUsers();
  // }, []);

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
            {users.map((row) => (
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
