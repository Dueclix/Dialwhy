import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Link, useNavigate, useParams } from "react-router-dom";
import InputDetails from "../../Components/Common/InputDetails";
import Sidebar from "../../Components/CommonSections/Sidebar";
import Header from "../../Components/CommonSections/Header";
import { server } from "../../Components/LoginSignup";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
/* eslint-disable no-unused-vars */
import axios from "axios";

const UpdateLink = () => {
  const params = useParams();
  const [title, setTitle] = useState("");
  const [url, setURL] = useState("");
  const [navigateTo, setNavigateTo] = useState("");
  const [status, setStatus] = useState("active");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to save changes?");
    if (!confirmed) {
      return; // Exit the function if user cancels
    }

    try {
      const { data } = await axios.put(`${server}/edit-link/${params.id}`, {
        title,
        url,
        status,
        navigateTo,
      });
      toast.success(data?.message);
      navigate("/admin-panel");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error);
    }
  };

  const getLinkDetails = async (linkId) => {
    try {
      const { data } = await axios.get(`${server}/single-link/${linkId}`);
      setTitle(data?.singleLinkDetails?.title);
      setURL(data?.singleLinkDetails?.url);
      setStatus(data?.singleLinkDetails?.status);
      if (data?.singleLinkDetails.footer === true) {
        setNavigateTo("footer");
      } else if (data?.singleLinkDetails.navbar === true) {
        setNavigateTo("navbar");
      } else if (data?.singleLinkDetails.account === true) {
        setNavigateTo("account");
      } else if (data?.singleLinkDetails.footer2 === true) {
        setNavigateTo("footer2");
      } else if (data?.singleLinkDetails.dashboard === true) {
        setNavigateTo("dashboard");
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getLinkDetails(params.id);
  }, [params.id]);

  return (
    <>
      <div className="flex gap-0 w-full">
        <Sidebar />
        <div className="flex flex-col gap-1">
          <Header />
          <div className="flex flex-col gap-20 w-[100%] p-6">
            {/* go back button */}
            <Link
              className="bg-[#232323] w-[100px] rounded-md py-2 px-2 flex justify-center items-center gap-2 font-semibold text-sm"
              to="/admin/view-users"
            >
              <KeyboardBackspaceIcon style={{ fontSize: "medium" }} />
              Go Back
            </Link>

            {/* contains the add agency input */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 w-full justify-center"
            >
              <h1 className="text-xl font-bold">Links Info</h1>
              <div className="flex justify-between">
                <InputDetails
                  Placeholder="Enter title"
                  Label="Title"
                  name={"title"}
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
                <InputDetails
                  Placeholder="URL"
                  Label="URL"
                  name={"url"}
                  onChange={(e) => setURL(e.target.value)}
                  value={url}
                />
              </div>
              <div className="flex justify-between">
                <p className="text-white mt-3">Select Placing:</p>
                <select
                  onChange={(e) => setNavigateTo(e.target.value)}
                  value={navigateTo}
                  className="bg-transparent border border-black w-[19.2rem] ml-5  px-1 rounded-md"
                >
                  <option value="navbar" className="bg-black my-1">
                    Navbar
                  </option>
                  <option value="account" className="bg-black my-1">
                    Account
                  </option>
                  <option value="footer" className="bg-black my-1">
                    Footer
                  </option>
                  <option value="footer2" className="bg-black">
                    Footer2
                  </option>
                  <option value="dashboard" className="bg-black">
                    Dashboard
                  </option>
                </select>
                <p className="text-white mt-3">Status:</p>
                <select
                  onChange={(e) => setStatus(e.target.value)}
                  value={status}
                  className="bg-transparent border border-black w-[19.2rem] ml-6 py-2 px-1 rounded-md"
                >
                  <option value="inactive" className="bg-black">
                    Inactive
                  </option>
                  <option value="active" className="bg-black">
                    Active
                  </option>
                </select>
              </div>
              <button
                type="submit"
                className="w-[200px] bg-[#CEAE75] ml-4 mt-4 rounded-md text-black font-normal py-[5px]"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateLink;
