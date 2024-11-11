import { Delete, Drafts, SearchOutlined } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { appServer } from "../utils";
import axios from "axios";

const ContactsList = () => {
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const [FriendsList, setFriendsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [SearchName, setSearchName] = useState("");
  const itemsPerPage = 10;

  const totalPages = Math.ceil(FriendsList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentList = FriendsList.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
      <div className="w-100 mt-4 position-relative">
        <input
          type="text"
          value={SearchName}
          placeholder="Search..."
          style={{ borderRadius: "25px" }}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-100 pl-3 pr-5 py-2 border border-secondary"
        />
        <SearchOutlined className="position-absolute right-5 top-5 mr-2 mt-1" />
      </div>
      {SearchName !== "" ? (
        FriendsList.filter(
          (filterFriend) =>
            filterFriend.name.includes(SearchName) ||
            filterFriend.role.includes(SearchName)
        ).length > 0 ? (
          <ul className="m-4">
            {FriendsList.filter(
              (filterFriend) =>
                filterFriend.name.includes(SearchName) ||
                filterFriend.role.includes(SearchName)
            ).map((Friend) => (
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
          <div
            className="d-flex justify-content-center align-items-center flex-column w-100 text-secondary"
            style={{ height: "50vh" }}
          >
            No data matches with {SearchName}
          </div>
        )
      ) : FriendsList.length > 0 ? (
        <>
          <ul className="m-4">
            {currentList.map((Friend) => (
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
          <div className="d-flex justify-content-end align-items-center mt-3 w-100">
            <button
              className="btn btn-info mx-1"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            <span className="mx-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-info mx-1"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center flex-column w-100 text-secondary"
          style={{ height: "50vh" }}
        >
          <Drafts fontSize="large" color="inherit" />
          Your have no friends.
        </div>
      )}
    </div>
  );
};

export default ContactsList;
