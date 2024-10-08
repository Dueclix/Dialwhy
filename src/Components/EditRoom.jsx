import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AccountLayout from "./Partials/AccountLayout";
import Layout from "./Partials/Layout";
import { server } from "./LoginSignup";
import toast from "react-hot-toast";
import "./Styles/Account.css";
import axios from "axios";

function EditRoom() {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [status, setStatus] = useState("inactive"); // Initialize status with a default value
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let loggedinUser = localStorage.getItem("user");
    if (loggedinUser !== undefined) {
      let parsedUser = JSON.parse(loggedinUser);
      setUser(parsedUser);
      setStatus(parsedUser.status);
    }
  }, []);

  const getRoom = async () => {
    try {
      const { data } = await axios.get(`${server}/user/room/${id}`, {
        roomName,
      });
      setStatus(data?.status);
      setRoomName(data?.roomIdExist?.roomId);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoom();
  }, []);

  const { id } = useParams();

  const editRoomDB = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put(`${server}/user/edit/room/${id}`, {
        roomName,
        status,
        user: user?._id,
      });
      toast.success(data.message);
      setLoading(false);

      if (data?.success) {
        navigate(`/account`);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Layout>
        <AccountLayout
          to={`/room/edit/${id}`}
          title="Edit Room"
          subTitle="You have full control to Edit Room."
        >
          <div className="card">
            <div className="card-body">
              <form className="row align-items-end" onSubmit={editRoomDB}>
                <div className="mb-3 col-12 col-md-6">
                  <label className="form-label" htmlFor="room_name">
                    Room Name
                  </label>
                  <input
                    type="text"
                    id="room_name"
                    name="room_name"
                    className="form-control"
                    placeholder="Room Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                  />
                </div>

                <div className="mb-3 col-12 col-md-6">
                  <label className="form-label" htmlFor="status">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="form-control"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="col-12 mb-3 text-lg-right">
                  <button className="btn btn-primary" type="submit">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </AccountLayout>
      </Layout>
    </>
  );
}

export default EditRoom;
