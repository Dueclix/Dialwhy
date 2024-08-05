import React, { useCallback, useEffect, useState } from "react";
import AccountLayout from "./Partials/AccountLayout";
import { useNavigate } from "react-router-dom";
import Layout from "./Partials/Layout";
import { server } from "./LoginSignup";
import toast from "react-hot-toast";
import "./Styles/Account.css";
import axios from "axios";

function CreateRoom() {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [status, setStatus] = useState("active"); // Initialize status with a default value
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    let loggedinUser = localStorage.getItem("user");
    if (loggedinUser !== undefined) {
      let parsedUser = JSON.parse(loggedinUser);
      setUser(parsedUser);
    }
  }, []); // Added roomId to the dependencies array

  const createRoomDB = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${server}/user/create-room`, {
        roomName,
        status,
        user: user?._id,
      });
      toast.success(data.message);
      setLoading(false);
      setTimeout(() => {
        navigate(`/room/${roomName}-${user?._id}`);
      }, 3000);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleJoinRoom = useCallback(
    (e) => {
      e.preventDefault(); // Prevent default form submission behavior
      createRoomDB();
    },
    [navigate, roomName, status]
  );
  return (
    <>
      <Layout>
        <AccountLayout
          to={"/createroom"}
          title="Create Room"
          subTitle="You have full control to Create Room."
        >
          <div className="card">
            <div className="card-body">
              <form className="row align-items-end" onSubmit={handleJoinRoom}>
                {/* <div className="mb-3 col-12 col-md-6">
                  <label className="form-label" htmlFor="room_id">
                    Room Id
                  </label>
                  <input
                    type="text"
                    id="room_id"
                    name="room_id"
                    className="form-control"
                    placeholder="Room Id"
                  />
                </div> */}
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
                {/* <div className="mb-3 col-12 col-md-6">
                  <label className="form-label" htmlFor="date">
                    Date
                  </label>
                  <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    className="form-control"
                  />
                </div> */}
                {/* <div className="mb-3 col-12 col-md-6">
                  <label className="form-label" htmlFor="date">
                    URL
                  </label>
                  <input
                    type="text"
                    id="url"
                    name="url"
                    className="form-control"
                  />
                </div> */}
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
                {/* <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="professional_name">Professional Name</label>
                        <input type="text" id="professional_name" name="professional_name" className="form-control" placeholder="Professional Name" value={formData.professional_name} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" className="form-control" placeholder="Email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="phone">Phone</label>
                        <input type="tel" id="phone" name="phone" className="form-control" placeholder="Phone" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="user_name">User Name</label>
                        <input type="text" id="user_name" name="user_name" className="form-control" placeholder="User Name" value={formData.user_name} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" className="form-control" placeholder="Password" value={formData.password} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="company">Company</label>
                        <input type="text" id="company" name="company" className="form-control" placeholder="Company" value={formData.company} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="sort_order">Sort Order</label>
                        <input type="number" id="sort_order" name="sort_order" className="form-control" placeholder="Sort Order" value={formData.sort_order} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="country_code_char2">Country Code</label>
                        <input type="text" id="country_code_char2" name="country_code_char2" className="form-control" placeholder="Country Code" value={formData.country_code_char2} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="state">State</label>
                        <input type="number" id="state" name="state" className="form-control" placeholder="State" value={formData.state} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="suit">Suit</label>
                        <input type="text" id="suit" name="suit" className="form-control" placeholder="Suit" value={formData.suit} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="city">City</label>
                        <input type="text" id="city" name="city" className="form-control" placeholder="City" value={formData.city} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="zipCode">Zip Code</label>
                        <input type="text" id="zipCode" name="zipCode" className="form-control" placeholder="Zip Code" value={formData.zipCode} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="address">Address</label>
                        <input type="text" id="address" name="address" className="form-control" placeholder="Address" value={formData.address} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="reference">Reference</label>
                        <input type="text" id="reference" name="reference" className="form-control" placeholder="Reference" value={formData.reference} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="date">Date</label>
                        <input type="datetime-local" id="date" name="date" className="form-control" value={formData.date} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="status">Status</label>
                        <input type="number" id="status" name="status" className="form-control" placeholder="Status" value={formData.status} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="expiry_status">Expiry Status</label>
                        <input type="number" id="expiry_status" name="expiry_status" className="form-control" placeholder="Expiry Status" value={formData.expiry_status} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="expiry_date">Expiry Date</label>
                        <input type="date" id="expiry_date" name="expiry_date" className="form-control" value={formData.expiry_date} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="is_online">Is Online</label>
                        <input type="number" id="is_online" name="is_online" className="form-control" placeholder="Is Online" value={formData.is_online} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="log_time">Log Time</label>
                        <input type="datetime-local" id="log_time" name="log_time" className="form-control" value={formData.log_time} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="is_professional_member">Is Professional Member</label>
                        <input type="number" id="is_professional_member" name="is_professional_member" className="form-control" placeholder="Is Professional Member" value={formData.is_professional_member} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="link_professional_id">Link Professional ID</label>
                        <input type="number" id="link_professional_id" name="link_professional_id" className="form-control" placeholder="Link Professional ID" value={formData.link_professional_id} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="can_create_member">Can Create Member</label>
                        <input type="text" id="can_create_member" name="can_create_member" className="form-control" placeholder="Can Create Member" value={formData.can_create_member} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="expired_on">Expired On</label>
                        <input type="date" id="expired_on" name="expired_on" className="form-control" value={formData.expired_on} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12 col-md-6">
                        <label className="form-label" htmlFor="loginKey">Login Key</label>
                        <input type="text" id="loginKey" name="loginKey" className="form-control" placeholder="Login Key" value={formData.loginKey} onChange={handleChange} />
                    </div>
                    <div className="mb-3 col-12">
                        <label className="form-label" htmlFor="description">Description</label>
                        <textarea id="description" name="description" className="form-control" placeholder="Description" value={formData.description} onChange={handleChange}></textarea>
                    </div>
                    */}
                <div className="col-12 mb-3 text-lg-right">
                  <button className="btn btn-primary" type="submit">
                    Create
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

export default CreateRoom;
