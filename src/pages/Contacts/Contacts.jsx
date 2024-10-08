import { Link } from "react-router-dom";
import {
  Contacts as ContactsIcon,
  Brightness3,
  Logout,
  Home,
  Add,
  Message,
} from "@mui/icons-material";
import { useState } from "react";
import React from "react";
import "./Contacts.css";

const Contacts = () => {
  const [SideTab, setSideTab] = useState("Chat");
  const [MainTab, setMainTab] = useState(null);

  return (
    <div className="d-flex flex-row justify-content-center justify-items-center h-100">
      <div className="sidebar h-100">
        <Link to={"/"} title="Constre">
          <img
            className="logo"
            src="https://dialwhy.com/logo/vite.jpg"
            alt="logo"
          />
        </Link>
        <div className="d-flex flex-row justify-content-center justify-items-center">
          <div className="side-tabs">
            <ul>
              <li className="tab-link">
                <Link to="/accounts">
                  <Home fontSize="inherit" />
                </Link>
              </li>
              <li
                className="tab-link"
                onClick={() => {
                  setSideTab("Chat");
                  setMainTab(null);
                }}
              >
                <Message fontSize="inherit" />
              </li>
              <li className="tab-link">
                <ContactsIcon
                  fontSize="inherit"
                  onClick={() => {
                    setSideTab("Contact");
                    setMainTab(null);
                  }}
                />
              </li>
              <li className="tab-link">
                <Brightness3 fontSize="inherit" />
              </li>
              <li className="tab-link">
                <Logout fontSize="inherit" />
              </li>
            </ul>
          </div>
          <div className="side-panel">
            {SideTab === "Contact" && (
              <>
                <button
                  className="d-flex justify-items-center"
                  onClick={() => setMainTab("InviteFriend")}
                >
                  <span>
                    <Add />
                  </span>
                  <span>Invite Friend</span>
                </button>
                <ul>
                  <li>
                    <button onClick={() => setMainTab("Invitations")}>
                      Invitations
                    </button>
                  </li>
                </ul>
              </>
            )}
            {SideTab === "Chat" && <div>Chat</div>}
          </div>
        </div>
      </div>
      <div className="main-tab h-100">
        {!MainTab && <></>}
        {MainTab === "InviteFriend" && <div>Invite Friend</div>}
        {MainTab === "Invitations" && <div>Invitations</div>}
      </div>
    </div>
  );
};

export default Contacts;
