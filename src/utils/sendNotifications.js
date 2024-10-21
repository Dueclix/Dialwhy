import { appServer } from ".";
import axios from "axios";

const sendNotification = async (notificationData) => {
  try {
    await axios.post(`${appServer}/api/sendNotification`, {
      ...notificationData,
    });
  } catch (err) {
    console.log(err);
  }
};

export default sendNotification;
