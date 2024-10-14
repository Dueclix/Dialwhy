import { MoreVertRounded } from "@mui/icons-material";
import React, { useState } from "react";

const MessageBox = ({ Message, CurrentChat, userId, onEdit, onDelete }) => {
  const isSender = Message.senderId === userId ? true : false;
  const [ShowMore, setShowMore] = useState(false);

  return (
    CurrentChat &&
    ((Message.senderId === userId && Message.receiverId === CurrentChat._id) ||
      (Message.senderId === CurrentChat._id &&
        Message.receiverId === userId)) && (
      <div
        className={`message d-flex flex-column ${
          isSender ? "align-items-end" : "align-items-start"
        } p-3`}
      >
        <div
          className={`position-relative text-left ${
            isSender ? "bg-info" : "bg-primary"
          } px-3 py-2 rounded`}
        >
          <div>{Message.message}</div>
          <div
            className={`position-absolute my-auto d-flex ${isSender ? "flex-row-reverse" : "flex-row"} justify-content-center align-items-start`}
            style={{
              left: isSender ? undefined : "100%",
              right: isSender ? "100%" : undefined,
              top: 0,
            }}
          >
            <button onClick={() => setShowMore(!ShowMore)} className="m-0">
              <MoreVertRounded />
            </button>
            <ul className={`${ShowMore ? "d-flex flex-column" : "d-none"} rounded`}>
              <li className="pl-2 pr-3 py-1" onClick={()=>{
                setShowMore(false);
                onDelete();
              }}>Delete</li>
              <li className="pl-2 pr-3 py-1" onClick={()=>{
                setShowMore(false);
                onEdit();
              }}>Edit</li>
            </ul>
          </div>
        </div>
        <span className={`${isSender ? "text-right" : "text-left"}`}>
          {Message.timming}
        </span>
      </div>
    )
  );
};

export default MessageBox;
