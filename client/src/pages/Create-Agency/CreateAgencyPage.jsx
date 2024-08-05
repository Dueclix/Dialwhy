import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SelectComponent from "../../components/Common/SelectComponent";
import SwitchComponent from "../../components/Common/SwitchComponent";
import SideBar from "../../components/CommonSections.jsx/Sidebar";
import Header from "../../components/CommonSections.jsx/Header";
import InputDetails from "../../components/Common/InputDetails";
import { Link, useNavigate, useParams } from "react-router-dom";
import { server } from "../../redux/store";
import { useState } from "react";
import axios from "axios";

const CreateAgencyPage = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState();
  const isActive = false;
  //--------------------match field names with field values in case of error--------
  const [form, setForm] = useState({
    agencyName: "",
    agencyEmail: "",
    primaryAddress: "",
    secondaryAddress: "",
    country: "",
    city: "",
    zipCode: "",
    currency: "",
    contactInfoMobile: "",
    maxUsers: "",
    contactInfoTelephone: "",
    adminFirstName: "",
    adminLastName: "",
    adminMobileNum: "",
    adminTelephone: "",
    adminUID: "",
    adminDesigName: "",
    adminEmail: "",
    adminPassword: "",
    ACMUserName: "",
    ACMEmail: "",
    ACMPassword: "",
    ACMMobileNum: "",
    tier: "",
    isActive: isActive,
    image: image,
  });

  //--------------------handlers---------------
  const handleChange = (e) => {
    try {
      const updatedForm = {
        ...form,
        [e.target.name]: e.target.value,
      };
      setForm(updatedForm);
      console.log("Updated form state:", updatedForm); // Debug log
    } catch (error) {
      console.error(error);
    }
  };

  const handleImage = (e) => {
    if (e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
    console.log(image);
  };

  const params = useParams();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    formData.append("image", image);

    try {
      const res = await axios.put(`${server}/edit/${params.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data);
      if (res.data.success === true) {
        toast.success("created successfully!");
        navigate("/");
      } else {
        console.error(res.data.message);
        // toast.error('Failed!')
      }
    } catch (error) {
      console.error("Error:", error);
      // toast.error('Failed!')
    }
  };

  const handleSwitchChange = (event) => {
    const newIsActive = event.target.checked;
    setForm({
      ...form,
      isActive: newIsActive,
      label: newIsActive ? "Active" : "Inactive",
    });
  };

  return (
    <>
      <div className="flex gap-0 w-full">
        <SideBar />
        <div className="flex flex-col gap-1">
          <Header />
          <div className="flex flex-col gap-20 w-[100%] p-6">
            {/* go back button */}
            <Link
              className="bg-[#232323] w-[100px] rounded-md py-2 px-2 flex justify-center items-center gap-2 font-semibold text-sm"
              to="/"
            >
              <KeyboardBackspaceIcon style={{ fontSize: "medium" }} />
              Go Back
            </Link>

            <form encType="multipart/form-data" onSubmit={handleSubmit}>
              {/* contains the add agency input */}
              <div className="flex flex-col gap-5 w-full justify-center">
                <h1 className="text-xl font-semibold">Add Agency</h1>

                <div className="flex justify-start">
                  <p className="text-sm w-[130px]">Add Logo : </p>
                  <input
                    type="file"
                    name="image"
                    placeholder="Select Logo"
                    id="image"
                    onChange={handleImage}
                    className="ml-5"
                  />
                </div>
                <div className="flex justify-between">
                  <InputDetails
                    Placeholder="Haris Travels"
                    Label="Agency Name"
                    value={form.agencyName}
                    onChange={handleChange}
                    name="agencyName"
                  />
                  <InputDetails
                    Placeholder="HarisTravels@gmail.com"
                    Label="Agency Email"
                    value={form.agencyEmail}
                    onChange={handleChange}
                    name="agencyEmail"
                  />
                </div>

                <div className="flex justify-between">
                  <SwitchComponent
                    label={
                      form.label || (form.isActive ? "Active" : "Inactive")
                    }
                    checked={form.isActive}
                    onChange={handleSwitchChange}
                    name="isActive"
                    baaki="Set Status"
                  />
                  <SelectComponent
                    value={form.tier}
                    name="tier"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* contains the add agency Address Information */}
              <div className="flex flex-col gap-5 w-full justify-center">
                <h1 className="text-xl font-semibold">Address Information</h1>
                <div className="flex justify-between">
                  <InputDetails
                    Placeholder="Royal Orchard Multan"
                    Label="Primary Address"
                    value={form.primaryAddress}
                    onChange={handleChange}
                    name="primaryAddress"
                  />
                  <InputDetails
                    Placeholder="Raj Mahal, Dholak Pur"
                    Label="Secondary Address"
                    value={form.secondaryAddress}
                    onChange={handleChange}
                    name="secondaryAddress"
                  />
                </div>
                <div className="flex justify-between">
                  <InputDetails
                    Placeholder="Pakistan"
                    Label="Country"
                    value={form.country}
                    onChange={handleChange}
                    name="country"
                  />
                  <InputDetails
                    Placeholder="Multan"
                    Label="City"
                    value={form.city}
                    onChange={handleChange}
                    name="city"
                  />
                </div>
                <div className="flex justify-between">
                  <InputDetails
                    Placeholder="65000"
                    Label="Zip-Code"
                    value={form.zipCode}
                    onChange={handleChange}
                    name="zipCode"
                  />
                  <InputDetails
                    Placeholder="PKR"
                    Label="Currency"
                    value={form.currency}
                    onChange={handleChange}
                    name="currency"
                  />
                </div>
              </div>

              {/* Following data contains the contact information */}
              <div className="flex flex-col gap-5 w-full justify-center">
                <h1 className="text-xl font-semibold">Contact Information</h1>
                <div className="flex justify-between">
                  <InputDetails
                    Placeholder="+92 **********"
                    Label="Mobile No"
                    value={form.contactInfoMobile}
                    onChange={handleChange}
                    name="contactInfoMobile"
                  />
                  <InputDetails
                    Placeholder="051 **********"
                    Label="Telephone No"
                    value={form.contactInfoTelephone}
                    onChange={handleChange}
                    name="contactInfoTelephone"
                  />
                </div>
                <InputDetails
                  Placeholder="5"
                  Label="Max Users"
                  value={form.maxUsers}
                  onChange={handleChange}
                  name="maxUsers"
                />
              </div>

              {/* contains the agency admin info */}
              <div className="flex flex-col gap-5 w-full justify-center">
                <h1 className="text-xl font-semibold">Admin Information</h1>
                <div className="flex justify-between">
                  <InputDetails
                    Placeholder="Mubashir"
                    Label="First Name"
                    value={form.adminFirstName}
                    onChange={handleChange}
                    name="adminFirstName"
                  />
                  <InputDetails
                    Placeholder="Habib"
                    Label="Last Name"
                    value={form.adminLastName}
                    onChange={handleChange}
                    name="adminLastName"
                  />
                </div>
                <div className="flex justify-between">
                  <InputDetails
                    Placeholder="+92 xxxxxxxx"
                    Label="Mobile No"
                    value={form.adminMobileNum}
                    onChange={handleChange}
                    name="adminMobileNum"
                  />
                  <InputDetails
                    Placeholder="051 xxxxxxxx"
                    Label="Telephone"
                    value={form.adminTelephone}
                    onChange={handleChange}
                    name="adminTelephone"
                  />
                </div>
                <div className="flex justify-between">
                  <InputDetails
                    Placeholder="SMT-15"
                    Label="User ID"
                    value={form.adminUID}
                    onChange={handleChange}
                    name="adminUID"
                  />
                  <InputDetails
                    Placeholder="CEO ..."
                    Label="Desig. Name"
                    value={form.adminDesigName}
                    onChange={handleChange}
                    name="adminDesigName"
                  />
                </div>
                <div className="flex justify-between">
                  <InputDetails
                    Placeholder="Example@gmail.com"
                    Label="E-Mail Address"
                    value={form.adminEmail}
                    onChange={handleChange}
                    name="adminEmail"
                  />
                  <InputDetails
                    Placeholder="12KR%$sh"
                    Label="Password"
                    value={form.adminPassword}
                    onChange={handleChange}
                    name="adminPassword"
                  />
                </div>
              </div>

              {/* contains the account manager info info and other things */}
              <div className="flex flex-col gap-5 w-full justify-center">
                <h1 className="text-xl font-semibold">
                  Account Manager Information
                </h1>
                <div className="flex justify-between">
                  <InputDetails
                    Placeholder="Abdul Qadeer"
                    Label="User Name"
                    value={form.ACMUserName}
                    onChange={handleChange}
                    name="ACMUserName"
                  />
                  <InputDetails
                    Placeholder="abdbulQadeer@gmail.com"
                    Label="Email"
                    value={form.ACMEmail}
                    onChange={handleChange}
                    name="ACMEmail"
                  />
                </div>
                <div className="flex justify-between">
                  <InputDetails
                    Placeholder="***********"
                    Label="Password"
                    value={form.ACMPassword}
                    onChange={handleChange}
                    name="ACMPassword"
                  />
                  <InputDetails
                    Placeholder="+92 xxxxxxxx"
                    Label="Mobile No"
                    value={form.ACMMobileNum}
                    onChange={handleChange}
                    name="ACMMobileNum"
                  />
                </div>
              </div>

              <div className="flex gap-10 w-full items-center justify-start">
                <button className="w-[200px] bg-[#232323] font-semibold rounded-md py-[5px]">
                  Cancel
                </button>
                <button
                  className="w-[200px] bg-[#CEAE75] rounded-md text-black font-normal py-[5px]"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAgencyPage;
