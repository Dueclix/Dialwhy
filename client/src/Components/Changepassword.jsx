import AccountLayout from "./Partials/AccountLayout";
import { useEffect, useState } from "react";
import { server } from "./LoginSignup";
import Layout from "./Partials/Layout";
import toast from "react-hot-toast";
import axios from "axios";

const ChangePassword = () => {
  const [user, setUser] = useState("");
  // const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`${server}/user/change-password`, {
        newPassword,
        confirmNewPassword,
        user,
      });

      //   console.log(data);
      toast.success("Password Changed Successfully");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  let storedUser;
  useEffect(() => {
    storedUser = localStorage.getItem("user");
    if (storedUser) {
      let parsedUser = JSON.parse(storedUser);
      setUser(parsedUser?.email);
    }
  }, [user]);
  return (
    <Layout>
      <AccountLayout
        to={"/change-password"}
        title="Change Password"
        subTitle="You have full control to manage your own Account."
      >
        <div className="card">
          <div className="card-body">
            <form
              id="setting_form"
              onSubmit={handleChangePassword}
              //   novalidate="novalidate"
            >
              <div className="row">
                {/* <div className="col-lg-12">
                  <div className="form-group mb-4">
                    <label for="" className="form-label">
                      Old Password
                    </label>
                    <input
                      required
                      className="form-control"
                      name="old_password"
                      type="password"
                      onChange={(e) => setOldPassword(e.target.value)}
                      value={oldPassword}
                    />
                  </div>
                </div> */}
                <div className="col-lg-6">
                  <div className="form-group mb-4">
                    <label for="" className="form-label">
                      New Password
                    </label>
                    <input
                      required
                      className="form-control"
                      id="new_password"
                      name="new_password"
                      type="text"
                      onChange={(e) => setNewPassword(e.target.value)}
                      value={newPassword}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group mb-4">
                    <label for="" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      required
                      className="form-control"
                      name="confirm_password"
                      type="password"
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      value={confirmNewPassword}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group text-right mb-0">
                <button
                  id="setting_form_btn"
                  type="submit"
                  className="btn btn-primary btn-medium"
                  disabled={loading}
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </AccountLayout>
    </Layout>
  );
};

export default ChangePassword;
