import { Link, useNavigate, useParams } from "react-router-dom";
import AccountLayout from "./Partials/AccountLayout";
import { useEffect, useState } from "react";
import Layout from "./Partials/Layout";
import toast from "react-hot-toast";
import { server } from "./Account";
import axios from "axios";

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const copyURL = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("Copied to Clipboard");
  };

  const { id } = useParams();

  const getAllRoomsSingleUser = async (userId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/user/rooms/${userId}`);
      setRooms(data?.room);
      setLoading(false);
      console.log(data);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const deleteRoom = async (userId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this room?"
      );
      if (!confirmDelete) {
        return; // If the user cancels the deletion, exit the function
      }

      const { data } = await axios.delete(`${server}/user/rooms/${userId}`);
      setLoading(false);
      // window.location.reload();
      toast.success(data?.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error(err.response?.data?.message);
    }
  };

  const handleJoinRoom = (room) => {
    navigate(`/room/${room?.roomId}`);
    window.location.reload();
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      let storedUser = localStorage.getItem("user");
      console.log("main id hoon", user?._id);
      if (storedUser !== undefined) {
        let parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log("main hoon parsed user", parsedUser);
        getAllRoomsSingleUser(parsedUser?._id); // Ensure user?._id is not undefined
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-11) and pad with leading zero if needed
    const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero if needed
    const year = date.getFullYear(); // Get full year

    return `${month}-${day}-${year}`;
  };

  return (
    <Layout>
      <AccountLayout
        to={"/rooms"}
        title="My Rooms / Invited"
        subTitle="Full list of Rooms."
      >
        <div className="container">
          <div className="row">
            <div className="px-0 col d-flex justify-content-end mt-2 mb-4">
              <Link to="/createroom" className=" btn btn-primary btn-sm">
                {" "}
                <i className="fa-solid fa-plus"></i> Add
              </Link>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="table-responsive">
            <table id="roomsTable" className="table mb-0 display">
              <thead>
                <tr>
                  {/* <th>Room #</th> */}
                  <th>Room Name</th>
                  <th className="px-5">Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <div style={{ textAlign: "center", paddingLeft: "20px" }}>
                    Loading...
                  </div>
                ) : (
                  rooms?.map((room) => (
                    <tr key={room?._id}>
                      {/* <td className="py-3">
                        <Link
                          className="nav-link-style fs-xs"
                          to="/rooms-details"
                          data-bs-toggle="modal"
                        >
                          {room?._id}
                        </Link>
                      </td> */}
                      <td className="py-3 text-sm">{room?.roomId}</td>
                      <td className="py-3 text-sm">
                        {room?.createdAt
                          ? formatDate(room.createdAt)
                          : "Date not available"}
                      </td>
                      <td className="py-3 text-sm">
                        <span className="badge bg-soft-info m-0">
                          {room?.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          type="button"
                          id="copy"
                          className="bg-transparent text-primary border-0 mr-2"
                          onClick={() =>
                            copyURL(`https://dialwhy.com/room/${room.roomId}`)
                          }
                          style={{ fontSize: "12px" }}
                        >
                          <i class="fas fa-copy"></i>
                        </button>
                        <button
                          type="button"
                          id="edit"
                          className="bg-transparent text-primary border-0 mr-2"
                          style={{ fontSize: "12px" }}
                          onClick={() => navigate(`/room/edit/${room?._id}`)}
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <button
                          type="button"
                          id="delete"
                          className="bg-transparent text-primary border-0"
                          style={{ fontSize: "12px" }}
                          onClick={() => deleteRoom(room?._id)}
                        >
                          <i class="fas fa-trash-alt"></i>
                        </button>
                      </td>
                      <td>
                        <Link
                          onClick={() => handleJoinRoom(room)}
                          type="button"
                          id="join"
                          className=" text-white border-0 py-1 px-4 bg-primary rounded-lg"
                          style={{ fontSize: "" }}
                        >
                          Join
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
                {/* Add more <tr> for additional data */}
              </tbody>
            </table>
          </div>
        </div>
      </AccountLayout>
    </Layout>
  );
};

export default Rooms;
