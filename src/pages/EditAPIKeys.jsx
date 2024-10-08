import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Link, useNavigate, useParams } from "react-router-dom";
import InputDetails from "../Components/Common/InputDetails";
import Sidebar from "../Components/CommonSections/Sidebar";
import Header from "../Components/CommonSections/Header";
import { server } from "../Components/LoginSignup";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
/* eslint-disable no-unused-vars */
import axios from "axios";

const EditAPIKeys = () => {
  const params = useParams();
  const [appID, setAppID] = useState("");
  const [serverSecret, setServerSecret] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to save changes?");
    if (!confirmed) {
      return; // Exit the function if user cancels
    }

    try {
      const { data } = await axios.put(
        `${server}/user/change/zego-api/${params.id}`,
        {
          appID,
          serverSecret,
        }
      );
      console.log(data);
      toast.success(data?.message);
      navigate("/admin/zego-api");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error);
    }
  };

  const getAPIDetails = async (userId) => {
    try {
      const { data } = await axios.get(`${server}/user/zego-api/${userId}`);
      console.log(data);
      setAppID(data.zegoAPIKeys.appID);
      setServerSecret(data.zegoAPIKeys.serverSecret);
      console.log(data.zegoAPIKeys.appID);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAPIDetails(params.id);
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
              <h1 className="text-xl font-bold">User Info</h1>
              <div className="flex justify-between">
                <InputDetails
                  Placeholder="Enter AppID (number)"
                  Label="App ID"
                  name={"appid"}
                  onChange={(e) => setAppID(e.target.value)}
                  value={appID}
                />
                <InputDetails
                  Placeholder="Server Secret"
                  Label="Server Secret"
                  name={"serverSecret"}
                  onChange={(e) => setServerSecret(e.target.value)}
                  value={serverSecret}
                />
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

export default EditAPIKeys;
