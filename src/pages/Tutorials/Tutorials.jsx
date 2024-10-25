import AccountLayout from "../../Components/Partials/AccountLayout";
import Layout from "../../Components/Partials/Layout";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { appServer } from "../../utils";
import { Delete, Download } from "@mui/icons-material";

const Tutorials = () => {
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const [tuts, setTuts] = useState([]);

  const DownloadRecording = (filename, videoUrl) => {
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const DeleteRecording = async (filename) => {
    await axios.post(`${appServer}/tutorial-recordings/delete/`, { filename });

    const tutDeleted = tuts.find((tut) => tut.filePath === filename);
    if (tutDeleted) {
      setTuts((prev) => [...prev.filter((tut) => tut.id !== tutDeleted.id)]);
    }
  };

  useEffect(() => {
    const tutsGet = async () => {
      const result = await axios.get(
        `${appServer}/tutorial-recordings/${userId}`
      );

      setTuts(result.data);
    };
    tutsGet();
  }, [userId]);

  return (
    <Layout>
      <AccountLayout
        to={"/tutorials"}
        title="Tutorials"
        subTitle="Manage your tutorial."
      >
        <div
          key={"Tutorials"}
          className="w-100 pt-4"
          style={{ height: "70vh" }}
        >
          <div
            className="w-100 text-right"
            style={{ overflow: "initial !important" }}
          >
            <a
              href="/record-tutorial"
              className="text-light bg-primary px-3 py-2 rounded"
            >
              Record New
            </a>
          </div>
          <ul className="my-3 w-100">
            {tuts.map((tut) => {
              const blob = new Blob([new Uint8Array(tut.fileData.data)], {
                type: "video/mp4",
              });
              const videoUrl = URL.createObjectURL(blob);
              return (
                <li
                  key={tut.id}
                  className="w-100 d-flex align-items-start justify-content-center px-1 py-2"
                >
                  <video src={videoUrl} className="w-25 rounded"></video>
                  <div className="w-50 px-3">
                    <div>
                      <p
                        className="text-dark text-ellipsis overflow-hidden whitespace-nowrap"
                        style={{ fontSize: "16px" }}
                      >
                        {tut.filePath}
                      </p>
                      <span style={{ fontSize: "12px" }}>{tut.timing}</span>
                    </div>
                    <div className="m-0 p-0 mt-3">
                      <button
                        className="my-0 mx-1 p-2 bg-primary rounded text-white"
                        style={{ fontSize: "18px" }}
                        onClick={() =>
                          DownloadRecording(tut.filePath, videoUrl)
                        }
                      >
                        <Download fontSize="inherit" />
                      </button>
                      <button
                        className="my-0 mx-1 p-2 bg-danger rounded text-white"
                        style={{ fontSize: "18px" }}
                        onClick={() => DeleteRecording(tut.filePath)}
                      >
                        <Delete fontSize="inherit" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </AccountLayout>
    </Layout>
  );
};

export default Tutorials;
