import TableContainer from "@mui/material/TableContainer";
import EditNoteIcon from "@mui/icons-material/EditNote";
// import { Link, useNavigate } from "react-router-dom"
import DeleteIcon from "@mui/icons-material/Delete";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AgenciesInfoSection() {
  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/agencies")
      .then((response) => {
        setAgencies(response.data.data);
        // console.log("response: ", response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleDelete = async (agencyId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/agency/${agencyId}`
      );
      if (res.data.success == true) {
        const remainingAgencies = res.data.remainingAgencies;
        console.log(remainingAgencies);
        setAgencies(remainingAgencies);
        // toastr.success('Agency deleted successfully!')
      }
    } catch (error) {
      console.error("Error deleting agency:", error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ bgcolor: "#CEAE75" }}>
          <TableRow>
            <TableCell>Agency Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Tier</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Primary Address</TableCell>
            <TableCell align="right">Secondary Address</TableCell>
            <TableCell align="right">Country</TableCell>
            <TableCell align="right">City</TableCell>
            <TableCell align="right">Zip Code</TableCell>
            <TableCell align="right">Currency</TableCell>
            <TableCell align="right">Contact</TableCell>
            <TableCell align="right">Contact 2</TableCell>
            <TableCell align="right">Max Users</TableCell>
            <TableCell align="right">Admin </TableCell>
            <TableCell align="right">Admin Contact</TableCell>
            <TableCell align="right">Admin Contact 2</TableCell>
            <TableCell align="right">Admin UID</TableCell>
            <TableCell align="right">Admin Desig. Name</TableCell>
            <TableCell align="right">Admin Email</TableCell>
            <TableCell align="right">Admin Password</TableCell>
            <TableCell align="right">ACM User Name</TableCell>
            <TableCell align="right">ACM Email</TableCell>
            <TableCell align="right">ACM Password</TableCell>
            <TableCell align="right">ACM Contact</TableCell>
            <TableCell align="right">Logo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {agencies &&
            agencies?.map((agency) => (
              <TableRow
                key={agency._id}
                sx={{
                  "td, th": {
                    border: 1,
                    borderColor: "#0F0F0F",
                    bgcolor: "black",
                    color: "white",
                  },
                }}
              >
                <TableCell align="right">{agency?.agencyName}</TableCell>
                <TableCell align="right">{agency?.label}</TableCell>
                <TableCell align="right">{agency?.tier}</TableCell>
                <TableCell align="right">{agency?.agencyEmail}</TableCell>
                <TableCell align="right">{agency?.primaryAddress}</TableCell>
                <TableCell align="right">{agency?.secondaryAddress}</TableCell>
                <TableCell align="right">{agency?.country}</TableCell>
                <TableCell align="right">{agency?.city}</TableCell>
                <TableCell align="right">{agency?.zipCode}</TableCell>
                <TableCell align="right">{agency?.currency}</TableCell>
                <TableCell align="right">{agency?.contactInfoMobile}</TableCell>
                <TableCell align="right">
                  {agency?.contactInfoTelephone}
                </TableCell>
                <TableCell align="right">{agency?.maxUsers}</TableCell>
                <TableCell align="right">
                  {agency?.adminFirstName} {agency?.adminLastName}
                </TableCell>
                <TableCell align="right">{agency?.adminMobileNum}</TableCell>
                <TableCell align="right">{agency?.adminTelephone}</TableCell>
                <TableCell align="right">{agency?.adminUID}</TableCell>
                <TableCell align="right">{agency?.adminDesigName}</TableCell>
                <TableCell align="right">{agency?.adminEmail}</TableCell>
                <TableCell align="right">{agency?.adminPassword}</TableCell>
                <TableCell align="right">{agency?.ACMUserName}</TableCell>
                <TableCell align="right">{agency?.ACMEmail}</TableCell>
                <TableCell align="right">{agency?.ACMPassword}</TableCell>
                <TableCell align="right">{agency?.ACMMobileNum}</TableCell>
                <TableCell align="right">
                  <img src={agency?.image?.url} alt="image" />
                </TableCell>
                <TableCell
                  sx={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Link
                    to={`/agency/${agency._id}`}
                    className="bg-green-600 py-1 rounded-md px-4"
                  >
                    <EditNoteIcon />
                  </Link>

                  <button onClick={() => handleDelete(agency._id)}>
                    <DeleteIcon />
                  </button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
