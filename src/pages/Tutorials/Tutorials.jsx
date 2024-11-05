import AccountLayout from "../../Components/Partials/AccountLayout";
import { Delete, Download } from "@mui/icons-material";
import Layout from "../../Components/Partials/Layout";
import React, { useEffect, useState } from "react";
import { appServer } from "../../utils";
import axios from "axios";

const Tutorials = () => {
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const [tuts, setTuts] = useState([]);

  const DownloadRecording = async (filename) => {
    const response = await axios.get(
      `${appServer}/tutorial-recordings/download/${filename}`,
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
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
        <div className="w-100 pt-4" style={{ height: "70vh" }}>
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
              const tutDateTime = new Date(tut.timeStamp);
              const timeStamp =
                tutDateTime
                  .toLocaleDateString([], {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  })
                  .replaceAll("/", "-") +
                " " +
                tutDateTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
              return (
                <li
                  key={tut.id}
                  className="w-100 d-flex align-items-start justify-content-center px-1 py-2"
                >
                  <img
                    src={`${appServer}/thumbnail/${tut.thumbnail}`}
                    alt={tut.thumbnail}
                    className="w-25 rounded"
                  />
                  <div className="w-50 px-3">
                    <div>
                      <p
                        className="text-dark text-ellipsis overflow-hidden whitespace-nowrap"
                        style={{ fontSize: "16px" }}
                      >
                        {tut.filePath}
                      </p>
                      <span style={{ fontSize: "12px" }}>{timeStamp}</span>
                    </div>
                    <div className="m-0 p-0 mt-3">
                      <button
                        className="my-0 mx-1 p-2 bg-primary rounded text-white"
                        style={{ fontSize: "18px" }}
                        onClick={() => DownloadRecording(tut.filePath)}
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
