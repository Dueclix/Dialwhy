import Navbar from "../../Components/Partials/Navbar/Navbar";
import { Call, Send, VideoCall } from "@mui/icons-material";
import MessageBox from "../../Components/MessageBox";
import React, { useEffect, useState } from "react";
import { appServer } from "../../utils";
import socket from "../../utils/socket";
import axios from "axios";
import "./Chat.css";

const Chat = () => {
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const [MessagesList, setMessagesList] = useState([]);
  const [CurrentChat, setCurrentChat] = useState(null);
  const [FriendsList, setFriendsList] = useState([]);
  const [EditValue, setEditValue] = useState("");
  const [Message, setMessage] = useState("");
  const [EditId, setEditId] = useState("");
  const ws = socket;

  ws.connect();

  const sendMessage = async () => {
    const currentDate = new Date();
    const data = {
      senderId: userId,
      receiverId: CurrentChat._id,
      message: Message,
      timming: currentDate.toLocaleTimeString([], {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
      }),
      seen: false,
    };
    axios
      .post(`${appServer}/api/v1/message/one-to-one/send`, data)
      .then((res) => {
        ws.emit("one-to-one-message", { _id: res.data, ...data });
        setMessage("");
      });
  };

  const deleteMessage = async (messageId) => {
    try {
      const result = await axios.post(
        `${appServer}/api/v1/message/one-to-one/delete/`,
        { messageId }
      );

      if (result.status === 200) {
        setMessagesList((prevMessagesList) =>
          prevMessagesList.filter((message) => message._id !== messageId)
        );
        socket.emit("one-to-one-delete", { messageId: messageId });
      } else {
        console.error("Failed to delete message:", result.statusText);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const CencelEditedMessage = () => {
    setEditId("");
    setEditValue("");
  };

  const sendEditMessage = async () => {
    if (EditId.trim() !== "" && EditValue.trim() !== "") {
      const result = await axios.post(
        `${appServer}/api/v1/message/one-to-one/edit`,
        { messageId: EditId, updatedMessage: EditValue }
      );

      if (result.status === 200) {
        const index = MessagesList.findIndex(
          (message) => message._id === EditId
        );

        if (index === -1) return;

        setMessagesList((prevMessages) => [
          ...prevMessages.slice(0, index),
          { ...prevMessages[index], message: EditValue },
          ...prevMessages.slice(index + 1),
        ]);

        socket.emit("one-to-one-edited", {
          messageId: EditId,
          updatedMessage: EditValue,
        });

        setEditId("");
        setEditValue("");
      }
    }
  };

  useEffect(() => {
    const messageToEdit = MessagesList.find((msg) => msg._id === EditId);
    if (messageToEdit && messageToEdit.message) {
      setEditValue(messageToEdit.message);
    } else {
      setEditValue("");
    }
  }, [EditId, MessagesList]);

  useEffect(() => {
    const getFriends = async () => {
      const result = await axios.get(`${appServer}/api/v1/friends/${userId}`);
      result.data instanceof Array && setFriendsList(result.data);
    };

    getFriends();
    return () => {
      getFriends();
    };
  }, [userId, ws]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const result = await axios.get(
          `${appServer}/api/v1/messages/one-to-one/${userId}`
        );

        const messages = result.data;
        const statusUpdatePromises = messages
          .filter((message) => message?.seen === false)
          .map((message) => {
            if (message.receiverId === userId) {
              return axios
                .get(
                  `${appServer}/api/v1/message/one-to-one/change-status/${message._id}`
                )
                .then(() => {
                  message.seen = true;
                  ws.emit("message-read", { messageId: message._id });
                });
            }
            return null;
          })
          .filter(Boolean);

        await Promise.all(statusUpdatePromises);

        setMessagesList(messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    getMessages();
  }, [userId, ws]);

  useEffect(() => {
    const messageStatusHandle = async ({ messageId }) => {
      setMessagesList((prev) => {
        const message = prev.find((msg) => msg._id === messageId);
        if (message) {
          return prev.map((msg) =>
            msg._id === messageId ? { ...msg, seen: true } : msg
          );
        }
        return prev;
      });
    };

    const OneToOneDelete = ({ messageId }) => {
      setMessagesList((prev) =>
        prev.filter((message) => message._id !== messageId)
      );
    };

    const OneToOneMessage = async ({
      _id,
      senderId,
      receiverId,
      message,
      timming,
      seen,
    }) => {
      if (senderId === userId || receiverId === userId) {
        if (receiverId === userId) {
          axios.get(
            `${appServer}/api/v1/message/one-to-one/change-status/${_id}`
          );
        }
        setMessagesList((prev) => [
          ...prev,
          {
            _id,
            senderId,
            receiverId,
            message,
            timming,
            seen,
            type: "message",
          },
        ]);
      }
    };

    const OneToOneEdited = ({
      messageId,
      updatedMessage,
    }) => {
      setMessagesList((prev) => {
        const index = prev.findIndex((message) => message._id === messageId);
        if (index === -1) return prev;
  
        const updatedMessages = [...prev];
        updatedMessages[index] = {
          ...updatedMessages[index],
          message: updatedMessage,
        };
        return updatedMessages;
      });
    };

    ws.on("message-read", messageStatusHandle);
    ws.on("one-to-one-delete", OneToOneDelete);
    ws.on("one-to-one-edited", OneToOneEdited);
    ws.on("one-to-one-message", OneToOneMessage);
    return () => {
      ws.off("message-read", messageStatusHandle);
      ws.off("one-to-one-delete", OneToOneDelete);
      ws.off("one-to-one-edited", OneToOneEdited);
      ws.off("one-to-one-message", OneToOneMessage);
    };
  }, [userId, ws]);

  return (
    <div>
      <div style={{ height: "12.5%" }}>
        <Navbar />
      </div>
      <div className="d-flex chatting">
        <ul className="sidebar">
          {FriendsList.length > 0 &&
            FriendsList.map((Friend) => (
              <li
                className="d-flex align-items-center px-3 py-2"
                onClick={() => setCurrentChat(Friend)}
                key={Friend._id}
              >
                <img
                  src={Friend.image ? Friend.image : "/Profile.png"}
                  alt=""
                  className="rounded-circle mr-3"
                  style={{ width: "40px", height: "40px" }}
                />
                <div>
                  <h2>
                    {Friend.name.length > 10
                      ? Friend.name.slice(0, 10) + "..."
                      : Friend.name}
                  </h2>
                  <span>{Friend.role}</span>
                </div>
              </li>
            ))}
        </ul>
        <div className="chatbox">
          {FriendsList.length > 0 &&
            FriendsList.filter(
              (Friend) => CurrentChat && CurrentChat._id === Friend._id
            ).map((Friend) => (
              <div
                className="d-flex flex-column justify-content-between align-items-center w-100 h-100"
                key={Friend._id}
              >
                <div className="d-flex justify-content-between align-items-center py-3 w-100 chatbox-nav">
                  <div>
                    <img
                      src={Friend.image ? Friend.image : "/Profile.png"}
                      style={{ width: "40px", height: "40px" }}
                      className="rounded-circle mx-3 d-inline-block"
                      alt=""
                    />
                    <h2 className="d-inline-block">{Friend.name}</h2>
                  </div>
                  <div>
                    <button className="mx-4 px-2 py-1">
                      <Call fontSize="medium" />
                    </button>
                    <button className="mx-4 px-2 py-1">
                      <VideoCall fontSize="medium" />
                    </button>
                  </div>
                </div>
                <div className="chatbox-body w-100 h-100">
                  {MessagesList.map((Message) => (
                    <MessageBox
                      CurrentChat={CurrentChat}
                      key={Message._id}
                      Message={Message}
                      userId={userId}
                      onEdit={() => setEditId(Message._id)}
                      onDelete={() => {
                        deleteMessage(Message._id);
                      }}
                    />
                  ))}
                </div>
                <div className="chatbox-footer d-flex justify-content-center align-items-center w-100 py-3">
                  <input
                    type="text"
                    placeholder="Type here..."
                    value={Message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button onClick={sendMessage}>
                    <Send />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      {EditId !== "" && (
        <div className="position-fixed d-flex justify-content-center align-items-center message-edit">
          <div className="bg-white px-3 py-2 rounded">
            <input
              type="text"
              value={EditValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="my-2 border border-primary rounded"
            />
            <div className="d-flex align-items-center justify-content-around">
              <button
                className="bg-primary text-white px-2 py-1 rounded"
                onClick={CencelEditedMessage}
              >
                Cencel
              </button>
              <button
                className="bg-primary text-white px-2 py-1 rounded"
                onClick={sendEditMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
