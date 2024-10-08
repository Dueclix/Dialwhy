import TableContainer from "@mui/material/TableContainer";
import EditNoteIcon from "@mui/icons-material/EditNote";
// import DeleteIcon from "@mui/icons-material/Delete";
import { server } from "../Components/LoginSignup";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
// import toast from "react-hot-toast";
import axios from "axios";

// function createData(name, calories, fat, carbs, protein, status) {
//   return { name, calories, fat, carbs, protein, status };
// }

export default function ZegoAPITable() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAPIKeys = async () => {
    setLoading(true);
    const { data } = await axios.get(`${server}/user/zego-api`);
    console.log(data);
    setApiKeys(data.zegoAPIKeys);
    setLoading(false);
  };
  useEffect(() => {
    getAPIKeys();
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
              <TableCell>App ID</TableCell>
              <TableCell align="center">ServerSecret</TableCell>

              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apiKeys.map((row) => (
              <TableRow
                key={row.appID}
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
                  {row.appID}
                </TableCell>
                <TableCell align="center">{row.serverSecret}</TableCell>
                <TableCell
                  sx={{
                    display: "flex",
                    gap: "15px",
                    alignItems: "center",
                    paddingY: "24px",
                    justifyContent: "center",
                  }}
                >
                  <Link to={`/admin/zego-api/edit/${row?._id}`}>
                    <EditNoteIcon className="text-white" />
                  </Link>
                  {/* <button onClick={() => deleteUser(row?._id)}>
                    <DeleteIcon />
                  </button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}
