import axios from "axios";
import { server } from "../../Components/LoginSignup";


export const getAllPendingUsers = () => async (dispatch) => {
    try {
      dispatch({
        type: "getAllUsersPendingRequest",
      });
  
      const { data } = await axios.get(`${server}/user/all-members`);

  
      dispatch({
        type: "getAllUsersPendingSuccess", 
        payload: data.pendingUsersDetails,
      });
    } catch (error) {
      dispatch({
        type: "getAllUsersPendingFail",
        payload: error.response.data.message,
      });
    }
  };

export const getAllApprovedUsers = () => async (dispatch) => {
    try {
      dispatch({
        type: "getAllUsersApprovedRequest",
      });
  
      const { data } = await axios.get(`${server}/user/all-members`);

  
      dispatch({
        type: "getAllUsersApprovedSuccess", 
        payload: data.approvedUsersDetails,
      });
    } catch (error) {
      dispatch({
        type: "getAllUsersApprovedFail",
        payload: error.response.data.message,
      });
    }
  };