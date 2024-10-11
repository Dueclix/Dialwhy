import { SearchOutlined, Send } from "@mui/icons-material";
import React, { useState } from "react";
import { appServer } from "../utils";
import axios from "axios";

const InviteFriend = () => {
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const [StatusMessage, setStatusMessage] = useState(null);
  const [InviteSearch, setInviteSearch] = useState(null);
  const [StatusCode, setStatusCode] = useState(null);
  const [EmailVal, setEmailVal] = useState("");

  const searchUser = async () => {
    const res = await axios.post(`${appServer}/api/v1/user/email`, {
      userId: userId,
      email: EmailVal,
    });
    setInviteSearch(res.data);
  };

  const sendRequest = async () => {
    axios
      .post(`${appServer}/api/v1/friends/request`, {
        requestUser: userId,
        acceptUser: InviteSearch._id,
      })
      .then((res) => {
        setStatusCode(res.status);
        setStatusMessage(res.data);
      })
      .catch((reason) => {
        setStatusCode(reason.response.status);
        setStatusMessage(reason.response.data);
        console.clear();
      })
      .finally(() => {
        setTimeout(() => {
          setStatusCode(null);
          setInviteSearch(null);
          setStatusMessage(null);
        }, 3000);
      });
  };

  return (
    <div className="d-flex align-items-center flex-column w-100 h-100 my-5">
      {StatusCode && StatusMessage && (
        <div
          className="position-fixed w-100"
          style={{ zIndex: 500, left: 0, right: 0, top: "20px" }}
        >
          <div
            className={`${
              StatusCode === 200 ? "bg-success" : "bg-danger"
            } px-3 py-1 mx-auto text-white rounded`}
            style={{ width: "fit-content" }}
          >
            {StatusMessage}
          </div>
        </div>
      )}
      <h1 className="font-bold text-black">INVITE NEW FRIEND</h1>
      <div className="d-flex mb-2 px-1 py-3 invite-input">
        <input
          type="text"
          placeholder="Enter email id..."
          value={EmailVal}
          onChange={(e) => setEmailVal(e.target.value)}
        />
        <button onClick={searchUser}>
          <SearchOutlined fontSize="inherit" />
        </button>
      </div>
      {InviteSearch && (
        <div className="d-flex justify-content-between align-items-center w-75">
          <div className="d-flex">
            <img
              src={InviteSearch.url ? InviteSearch.url : "/Profile.png"}
              alt=""
              width={40}
              height={40}
              className="rounded-circle mr-3"
            />
            <div>
              <h2 className="text-black">{InviteSearch.name}</h2>
              <span>{InviteSearch.role}</span>
            </div>
          </div>
          <div>
            <button onClick={sendRequest}>
              <Send />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteFriend;
