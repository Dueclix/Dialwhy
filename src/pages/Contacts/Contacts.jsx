import AccountLayout from "../../Components/Partials/AccountLayout";
// import { Link, useNavigate, useParams } from "react-router-dom";
import InviteFriend from "../../Components/InviteFriend";
import ContactsList from "../../Components/ContactsList";
import Invitations from "../../Components/Invitations";
import Layout from "../../Components/Partials/Layout";
import { useState, useEffect } from "react";
// import axios from "axios";
import "./Contacts.css";


const Contacts = () => {
  const [SubNavListPos, setSubNavListPos] = useState("6%");
  const [CurrentTab, setCurrentTab] = useState("Invite");

  useEffect(()=>{
    if(CurrentTab === "Invite" && SubNavListPos !== "6%") {
      setSubNavListPos("6%")
    } else if (CurrentTab === "Invitations" && SubNavListPos !== "38%") {
      setSubNavListPos("38%")
    } else if (CurrentTab === "Contacts" && SubNavListPos !== "72%") {
      setSubNavListPos("72%")
    }
  }, [CurrentTab, SubNavListPos])

  return (
    <Layout>
      <AccountLayout
        to={"/contacts"}
        title="Contacts"
        subTitle="Manage your contacts here..."
      >
        <div>
          <ul className="d-flex position-relative sub-nav-list">
            <span className="position-absolute bg-dark sub-nav-bl" style={{ left: SubNavListPos }}></span>
            <li className="mx-5 my-2" onClick={()=>setCurrentTab("Invite")}>
              <b>Invite New</b>
            </li>
            <li className="mx-5 my-2" onClick={()=>setCurrentTab("Invitations")}>
              <b>Invitations</b>
            </li>
            <li className="mx-5 my-2" onClick={()=>setCurrentTab("Contacts")}>
              <b>View Contacts</b>
            </li>
          </ul>
        </div>
        <div>
          {CurrentTab === "Invite" && <InviteFriend />}
          {CurrentTab === "Contacts" && <ContactsList />}
          {CurrentTab === "Invitations" && <Invitations />}
        </div>
      </AccountLayout>
    </Layout>
  );
};

export default Contacts;
