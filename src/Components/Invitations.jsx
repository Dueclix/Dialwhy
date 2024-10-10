import { Close, Done, Drafts } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { appServer } from "../utils";
import axios from "axios";

const Invitations = () => {
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const [FriendRequests, setFriendRequests] = useState([]);

  const requestRespond = async (requestId, status) => {
    try {
      await axios.post(`${appServer}/api/v1/friends/response`, {
        requestId: requestId,
        status: status,
      });
  
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request.requestId !== requestId)
      );
    } catch (error) {
      console.error("Error responding to friend request:", error);
    }
  };
  

  useEffect(() => {
    const getRequests = async () => {
      const result = await axios.get(
        `${appServer}/api/v1/friends/requests/${userId}`
      );
      result.data instanceof Array && setFriendRequests(result.data);
    };

    getRequests();
    return ()=>{
      getRequests();
    }
  }, [userId]);

  return (
    <div>
      {FriendRequests.length > 0 ? (
        <ul className="m-4">
          {FriendRequests.map((request) => (
            <li className="d-flex justify-content-center w-100 border border-secondary rounded px-3 py-2 my-1">
              <div className="d-flex w-75">
                <img
                  src={request.image ? request.image : "/Profile.png"}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-circle mr-3"
                />
                <div>
                  <h2>{request.name}</h2>
                  <span>{request.role}</span>
                </div>
              </div>
              <div className="w-25 text-center">
                <button
                  className="px-2 text-success"
                  onClick={() => requestRespond(request.requestId, true)}
                >
                  <Done />
                </button>
                <button
                  className="px-2 text-danger"
                  onClick={() => requestRespond(request.requestId, false)}
                >
                  <Close />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="d-flex justify-content-center align-items-center flex-column w-100 h-75 text-secondary">
          <Drafts fontSize="large" color="inherit" />
          No Friend Request Got.
        </div>
      )}
    </div>
  );
};

export default Invitations;
