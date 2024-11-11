import { Delete, Pause, PlayArrowRounded, Save } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { deleteBlob, getBlob } from "../../utils/db";
import { appServer } from "../../utils";
import "./SaveTutorial.css";
import axios from "axios";

const SaveTutorial = () => {
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const [SavingStatus, setSavingStatus] = useState(false);
  const [TutName, setTutName] = useState("Untitled");
  const [playing, setPlaying] = useState(false);
  const [BlobUrl, setBlobUrl] = useState(null);
  const [Tuts, setTuts] = useState([]);
  const videoRef = useRef(null);

  const SaveRecording = async () => {
    setSavingStatus(true);
    const blob = await getBlob("tutorial-blob");

    const formData = new FormData();
    formData.append("video", blob);
    formData.append("userId", userId);
    formData.append("tutName", TutName);

    const result = await axios.post(`${appServer}/upload-tutorial`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (result.status === 200) {
      await deleteTutBlob("/tutorials");
    }
  };

  const toggleVideo = () => {
    playing ? videoRef.current.pause() : videoRef.current.play();
    setPlaying(!playing);
  };

  const deleteTutBlob = async (locate) => {
    deleteBlob("tutorial-blob").then((res) => {
      window.location.replace(locate);
    });
  };

  useEffect(() => {
    const fetchPrevTuts = async () => {
      axios
        .get(`${appServer}/tutorial-recordings/${userId}`)
        .then((res) => setTuts(res.data))
        .catch((err) => console.log(err));
    };

    const fetchVideoBlob = async () => {
      try {
        const blob = await getBlob("tutorial-blob");
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      } catch (error) {
        console.error("Failed to retrieve video blob:", error);
      }
    };

    fetchPrevTuts();
    fetchVideoBlob();
  }, [userId]);

  useEffect(() => {
    if (videoRef.current && BlobUrl) {
      videoRef.current.src = BlobUrl;
    }
  }, [BlobUrl]);

  return (
    <div>
      {BlobUrl ? (
        <>
          <div className="d-flex justify-content-center align-items-center w-100 my-5">
            <input
              value={TutName}
              onChange={(e) => setTutName(e.target.value)}
              onFocus={(e) =>
                e.target.value === "Untitled" && e.target.select()
              }
              className={`outline-none border ${
                TutName === "" || Tuts.some((tut) => tut.tutName === TutName)
                  ? "border-danger"
                  : "border-dark"
              } w-75 rounded-full px-4 py-2`}
            />
          </div>
          <div className="d-flex justify-content-center align-items-center w-75 h-75 flex-column mx-auto">
            <video
              className="w-auto h-100 rounded"
              disablePictureInPicture
              disableRemotePlayback
              onClick={toggleVideo}
              ref={videoRef}
              onEnded={() => {
                setPlaying(false);
              }}
            />
            <div className="d-flex align-items-center justify-content-center my-2">
              <button
                onClick={toggleVideo}
                className="text-success rounded-circle border border-4 border-success p-2"
              >
                {playing ? <Pause /> : <PlayArrowRounded />}
              </button>
              <button
                className="text-primary rounded-circle border border-4 border-primary p-2"
                onClick={SaveRecording}
                disabled={
                  TutName === "" || Tuts.some((tut) => tut.tutName === TutName)
                }
              >
                <Save />
              </button>
              <button
                className="text-danger rounded-circle border border-4 border-danger p-2"
                onClick={() => deleteTutBlob("/")}
              >
                <Delete />
              </button>
            </div>
          </div>
          {SavingStatus && (
            <div
              className="position-fixed d-flex align-items-center justify-content-center flex-column"
              style={{
                backgroundColor: "#ffffff87",
                zIndex: "1000",
                bottom: "5%",
                right: "5%",
                left: "5%",
                top: "5%",
              }}
            >
              <div className="tut-loader"></div>
              <p
                className="text-dark my-3"
                style={{
                  fontSize: "18px",
                }}
              >
                Saving file, please wait...
              </p>
            </div>
          )}
        </>
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
};

export default SaveTutorial;
