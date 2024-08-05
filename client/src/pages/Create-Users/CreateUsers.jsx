import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import InputDetails from "../../Components/Common/InputDetails";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../Components/CommonSections/Sidebar";
import Header from "../../Components/CommonSections/Header";
import { server } from "../../Components/Account";
import { useEffect, useState } from "react";
/* eslint-disable no-unused-vars */
import toast from "react-hot-toast";
import axios from "axios";

const EditUser = () => {
  const [savedUser, setSavedUser] = useState(null);
  // const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      let storedUser = localStorage.getItem("user");
      if (storedUser !== undefined) {
        let parsedUser = JSON.parse(storedUser);
        setSavedUser(parsedUser);
      }
    }
  }, []);

  const params = useParams();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
    state: "",
    street: "",
    zipcode: "",
    phoneNumber: "",
    approved: "",
  });

  const {
    name,
    email,
    password,
    country,
    state,
    street,
    zipcode,
    phoneNumber,
    approved,
  } = user;

  const [image, setimage] = useState("");
  const [imagePreview, setImagePreview] = useState("/Profile.png");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.set("name", name);
    formData.set("email", email);
    formData.set("phoneNumber", phoneNumber);
    formData.set("zipcode", zipcode);
    formData.set("country", country);
    formData.set("state", state);
    formData.set("street", street);
    formData.set("password", password);
    formData.set("Approved", approved);
    if (image) {
      formData.set("image", image); // set the image file
    }
    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to save changes?");
    if (!confirmed) {
      return; // Exit the function if user cancels
    }

    try {
      const { data } = await axios.put(
        `${server}/user/edit/${params.id}`,
        {
          name,
          email,
          password,
          phoneNumber,
          zipcode,
          country,
          street,
          state,
          approved,
          image,
        }
        // {
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
        // }
      );
      console.log(data);
      toast.success(data?.message);
      navigate("/admin/view-users");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error);
    }
  };

  const updateUserDataChange = (e) => {
    if (e?.target?.name === "image") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreview(reader.result);
          setimage(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const getUserDetails = async (userId) => {
    try {
      const { data } = await axios.get(`${server}/user/${userId}`);
      setUser(data.user); // Set user directly with data received from the backend
      setImagePreview(data?.user?.image?.url);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getUserDetails(params.id);
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
                  Placeholder="Mohammad"
                  Label="Name"
                  name={"name"}
                  onChange={updateUserDataChange}
                  value={name}
                />
                <InputDetails
                  Placeholder="+92 xxxxxxxx"
                  Label="Mobile No"
                  name={"phoneNumber"}
                  onChange={updateUserDataChange}
                  value={phoneNumber}
                />
              </div>
              <div className="flex justify-between">
                <InputDetails
                  Placeholder="Country"
                  Label="Country"
                  name={"country"}
                  onChange={updateUserDataChange}
                  value={country}
                />
                <InputDetails
                  Placeholder="State"
                  Label="State"
                  name={"state"}
                  onChange={updateUserDataChange}
                  value={state}
                />
              </div>
              <div className="flex justify-between">
                <InputDetails
                  Placeholder="Zip Code"
                  Label="Zip Code"
                  name={"zipcode"}
                  onChange={updateUserDataChange}
                  value={zipcode}
                />
                <InputDetails
                  Placeholder="State"
                  Label="Street"
                  name={"street"}
                  onChange={updateUserDataChange}
                  value={street}
                />
              </div>
              <div className="flex justify-between">
                <InputDetails
                  Placeholder="abc@gmail.com"
                  Label="E-Mail"
                  name={"email"}
                  onChange={updateUserDataChange}
                  value={email}
                />
                <InputDetails
                  Placeholder="HR53TR#%"
                  Label="Password"
                  name={"password"}
                  onChange={updateUserDataChange}
                  value={password}
                />
              </div>
              <div className="flex justify-between">
                <p>Status:</p>

                <select
                  name="approved"
                  onChange={(e) => {
                    const newValue =
                      e.target.value === "Pending" ? false : true; // Convert "Pending" to false and "Approved" to true
                    setUser({ ...user, approved: newValue }); // Update user state with the new approval status
                  }}
                  value={user.approved ? "Approved" : "Pending"} // Set the selected value based on user.approved
                  className="bg-transparent border border-black px-[6.3rem] rounded-md"
                >
                  <option value="Pending" className="bg-black my-2">
                    Pending
                  </option>
                  <option value="Approved" className="bg-black">
                    Approved
                  </option>
                </select>

                <div className="flex gap-2 items-center">
                  <p className="text-sm w-[130px]">Upload Image:</p>
                  <img
                    src={imagePreview}
                    alt="User"
                    className="w-14 rounded-full"
                  />
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={updateUserDataChange}
                    className="py-[5px] px-[10px] w-[230px] p-[10px] text-[#d8d6d6] bg-[#232323] rounded-sm placeholder:text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-24"></div>

              <button
                type="submit"
                className="w-[200px] bg-[#CEAE75] rounded-md text-black font-normal py-[5px]"
              >
                Save
              </button>
              {/* </div> */}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUser;
