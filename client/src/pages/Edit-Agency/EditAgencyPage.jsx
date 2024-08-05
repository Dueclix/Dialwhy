import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SelectComponent from "../../components/Common/SelectComponent";
import SwitchComponent from "../../components/Common/SwitchComponent";
import SideBar from "../../components/CommonSections.jsx/Sidebar";
import Header from "../../components/CommonSections.jsx/Header";
import InputDetails from "../../components/Common/InputDetails";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const EditAgencyPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  //--------------------match field names with field values in case of error--------
  // eslint-disable-next-line no-unused-vars
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
    isActive: Boolean,
    label: "",
    image: null,
  });
  // console.log("form before fetch: ", form)

  useEffect(() => {
    axios
      .get(`http://localhost:5000/agency/${params.id}`)
      .then((res) => {
        const foundAgency = res.data.foundAgency;
        // console.log(foundAgency) //ok
        // console.log("form before fetch: ", form)
        setForm(foundAgency);
        console.log("form after fetch: ", form);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }, []);

  //--------------------handlers---------------
  const handleChange = (e) => {
    // console.log("e.target.value: ", e.target.value);
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImage = (e) => {
    if (e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImage(reader.result);
          setForm({
            ...form,
            image: reader.result,
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
    console.log(image);
  };

  // const handleTier = (event) => {
  //   console.log("handleTier: ", event.target.value)
  // //   setForm({
  // //     ...form,
  // //     tier: e.target.value,
  // //   });
  // };

  const handleSavedChanges = async (e) => {
    // console.log(form)
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    if (image) {
      formData.append("image", image);
    }
    try {
      const res = await axios.patch(
        `http://localhost:5000/agency/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data);
      const updatedAgency = res.data.updatedAgency;
      if (res.data.success === true) {
        console.log("updatedAgency: ", updatedAgency);
        navigate("/all-agencies");
        // toast.success('Info updated successfully!')
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

            <form encType="multipart/form-data" onSubmit={handleSavedChanges}>
              {/* contains the add agency input */}
              <div className="flex flex-col gap-5 w-full justify-center">
                <h1 className="text-xl font-semibold">Edit Agency</h1>

                <div className="flex justify-start">
                  <p className="text-sm w-[130px]">Logo : </p>
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
                    Label="Agency Name"
                    value={form.agencyName}
                    onChange={handleChange}
                    name="agencyName"
                  />
                  <InputDetails
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
                    Label="Primary Address"
                    value={form.primaryAddress}
                    onChange={handleChange}
                    name="primaryAddress"
                  />
                  <InputDetails
                    Label="Secondary Address"
                    value={form.secondaryAddress}
                    onChange={handleChange}
                    name="secondaryAddress"
                  />
                </div>
                <div className="flex justify-between">
                  <InputDetails
                    Label="Country"
                    value={form.country}
                    onChange={handleChange}
                    name="country"
                  />
                  <InputDetails
                    Label="City"
                    value={form.city}
                    onChange={handleChange}
                    name="city"
                  />
                </div>
                <div className="flex justify-between">
                  <InputDetails
                    Label="Zip-Code"
                    value={form.zipCode}
                    onChange={handleChange}
                    name="zipCode"
                  />
                  <InputDetails
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
                    Label="Mobile No"
                    value={form.contactInfoMobile}
                    onChange={handleChange}
                    name="contactInfoMobile"
                  />
                  <InputDetails
                    Label="Telephone No"
                    value={form.contactInfoTelephone}
                    onChange={handleChange}
                    name="contactInfoTelephone"
                  />
                </div>
                <InputDetails
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
                    Label="First Name"
                    value={form.adminFirstName}
                    onChange={handleChange}
                    name="adminFirstName"
                  />
                  <InputDetails
                    Label="Last Name"
                    value={form.adminLastName}
                    onChange={handleChange}
                    name="adminLastName"
                  />
                </div>
                <div className="flex justify-between">
                  <InputDetails
                    Label="Mobile No"
                    value={form.adminMobileNum}
                    onChange={handleChange}
                    name="adminMobileNum"
                  />
                  <InputDetails
                    Label="Telephone"
                    value={form.adminTelephone}
                    onChange={handleChange}
                    name="adminTelephone"
                  />
                </div>
                <div className="flex justify-between">
                  <InputDetails
                    Label="User ID"
                    value={form.adminUID}
                    onChange={handleChange}
                    name="adminUID"
                  />
                  <InputDetails
                    Label="Desig. Name"
                    value={form.adminDesigName}
                    onChange={handleChange}
                    name="adminDesigName"
                  />
                </div>
                <div className="flex justify-between">
                  <InputDetails
                    Label="E-Mail Address"
                    value={form.adminEmail}
                    onChange={handleChange}
                    name="adminEmail"
                  />
                  <InputDetails
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
                    Label="User Name"
                    value={form.ACMUserName}
                    onChange={handleChange}
                    name="ACMUserName"
                  />
                  <InputDetails
                    Label="Email"
                    value={form.ACMEmail}
                    onChange={handleChange}
                    name="ACMEmail"
                  />
                </div>
                <div className="flex justify-between">
                  <InputDetails
                    Label="Password"
                    value={form.ACMPassword}
                    onChange={handleChange}
                    name="ACMPassword"
                  />
                  <InputDetails
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
                  type="submit"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditAgencyPage;
