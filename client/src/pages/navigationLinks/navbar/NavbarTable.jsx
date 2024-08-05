import TableContainer from "@mui/material/TableContainer";
import { server } from "../../../Components/LoginSignup";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
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

export default function NavbarTable() {
  const [navbarLinks, setNavbarLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const deleteLink = async (linkId) => {
    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to save changes?");
    if (!confirmed) {
      return; // Exit the function if user cancels
    }

    setLoading(true);
    const { data } = await axios.delete(`${server}/delete-link/${linkId}`);
    toast.success(data.message);
    setLoading(false);
    window.location.reload();
  };
  const getNavbarLinks = async () => {
    setLoading(true);
    const { data } = await axios.get(`${server}/get-link`);
    console.log(data);
    setNavbarLinks(data.allNavbarNavigation);
    setLoading(false);
  };
  useEffect(() => {
    getNavbarLinks();
  }, []);
  return (
    <TableContainer component={Paper} className="ml-20">
      {loading ? (
        <div className="bg-[#CEAE75] text-center pl-8 py-4 mx-auto">
          Loading...
        </div>
      ) : (
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ bgcolor: "#CEAE75" }}>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="center">URL</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {navbarLinks?.map((row) => (
              <TableRow
                key={row.title}
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
                  {row.title}
                </TableCell>
                <TableCell align="center">{row.url}</TableCell>
                <TableCell align="center">{row.status}</TableCell>
                <TableCell
                  sx={{
                    display: "flex",
                    gap: "15px",
                    alignItems: "center",
                    paddingY: "24px",
                    justifyContent: "center",
                  }}
                >
                  <Link to={`/admin/update-link/${row?._id}`}>
                    <EditNoteIcon className="text-white" />
                  </Link>
                  <button onClick={() => deleteLink(row?._id)}>
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
