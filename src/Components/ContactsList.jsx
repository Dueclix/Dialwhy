import axios from "axios";
import React, { useEffect, useState } from "react";
import { appServer } from "../utils";
import { Delete, Drafts } from "@mui/icons-material";

const ContactsList = () => {
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const [FriendsList, setFriendsList] = useState([]);

  const deleteFriend = async (connectionId) => {
    try {
      await axios.get(`${appServer}/api/v1/friends/remove/${connectionId}`);

      setFriendsList((prevFriends) =>
        prevFriends.filter((Friend) => Friend.connectionId !== connectionId)
      );
    } catch (error) {
      console.error("Error deleting Friend:", error);
    }
  };

  useEffect(() => {
    const getFriends = async () => {
      const result = await axios.get(`${appServer}/api/v1/friends/${userId}`);
      result.data instanceof Array && setFriendsList(result.data);
    };

    getFriends();
    return () => {
      getFriends();
    };
  }, [userId]);

  return (
    <div>
      {FriendsList.length > 0 ? (
        <ul className="m-4">
          {FriendsList.map((Friend) => (
            <li className="d-flex justify-content-center w-100 border border-secondary rounded px-3 py-2 my-1">
              <div className="d-flex w-75">
                <img
                  src={Friend.image ? Friend.image : "/Profile.png"}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-circle mr-3"
                />
                <div>
                  <h2>{Friend.name}</h2>
                  <span>{Friend.role}</span>
                </div>
              </div>
              <div className="w-25 text-center">
                <button
                  className="px-2 text-danger"
                  onClick={() => deleteFriend(Friend.connectionId)}
                >
                  <Delete />
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

export default ContactsList;
