import AccountLayout from "../../Components/Partials/AccountLayout";
import { Delete, Download, Edit, SearchOutlined } from "@mui/icons-material";
import Layout from "../../Components/Partials/Layout";
import React, { useEffect, useState } from "react";
import { appServer } from "../../utils";
import axios from "axios";

const Tutorials = () => {
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const [EditTutName, setEditTutName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [EditTutId, setEditTutId] = useState(null);
  const [SearchTut, setSearchTut] = useState("");
  const [tuts, setTuts] = useState([]);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(tuts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTuts = tuts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const DownloadRecording = async (filename, originalName) => {
    const response = await axios.get(
      `${appServer}/tutorial-recordings/download/${originalName}`,
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename + ".mp4";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  };

  const UpdateName = async () => {
    const result = await axios.post(`${appServer}/tutorial-recordings/edit/`, {
      tutId: EditTutId,
      updatedName: EditTutName,
    });

    if (result.status === 200) {
      setTuts((prevTuts) => [
        ...prevTuts.map((tut) =>
          tut._id === EditTutId ? { ...tut, tutName: EditTutName } : tut
        ),
      ]);

      setEditTutId(null);
      setEditTutName("");
    } else {
      setEditTutId(null);
      setEditTutName("");
    }
  };

  const DeleteRecording = async (filename) => {
    await axios.post(`${appServer}/tutorial-recordings/delete/`, { filename });

    const tutDeleted = tuts.find((tut) => tut.filePath === filename);
    if (tutDeleted) {
      setTuts((prev) => [...prev.filter((tut) => tut._id !== tutDeleted._id)]);
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

  useEffect(() => {
    if (tuts) {
      if (EditTutId) {
        setEditTutName(tuts.find((tut) => tut._id === EditTutId).tutName);
      } else {
        setEditTutName("");
      }
    }
  }, [tuts, EditTutId]);

  return (
    <Layout>
      <AccountLayout
        to={"/tutorials"}
        title="Tutorials"
        subTitle="Manage your tutorial."
      >
        <div
          className="w-100 pt-4 d-flex justify-content-between align-items-center flex-column"
          style={{ height: tuts.length > 0 ? "auto" : "70vh" }}
        >
          <div
            className="w-100 d-flex justify-content-between align-items-center"
            style={{ overflow: "initial !important" }}
          >
            <div className="w-75 position-relative">
              <input
                type="text"
                value={SearchTut}
                placeholder="Search..."
                style={{ borderRadius: "25px" }}
                onChange={(e) => setSearchTut(e.target.value)}
                className="w-100 pl-3 pr-5 py-2 border border-secondary"
              />
              <SearchOutlined className="position-absolute right-5 top-5 mr-2 mt-1" />
            </div>
            <a
              href="/record-tutorial"
              className="text-light bg-primary px-3 py-2 rounded"
            >
              Record New
            </a>
          </div>
          {SearchTut !== "" ? (
            tuts.filter((filterTut) => filterTut.tutName.includes(SearchTut))
              .length > 0 ? (
              <ul className="w-100 my-3">
                {tuts
                  .filter((filterTut) => filterTut.tutName.includes(SearchTut))
                  .map((tut) => {
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
                        key={tut._id}
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
                              {tut.tutName}
                            </p>
                            <span style={{ fontSize: "12px" }}>
                              {timeStamp}
                            </span>
                          </div>
                          <div className="m-0 p-0 mt-3">
                            <button
                              className="my-0 mx-1 p-2 bg-primary rounded text-white"
                              style={{ fontSize: "18px" }}
                              onClick={() => setEditTutId(tut._id)}
                            >
                              <Edit fontSize="inherit" />
                            </button>
                            <button
                              className="my-0 mx-1 p-2 bg-primary rounded text-white"
                              style={{ fontSize: "18px" }}
                              onClick={() =>
                                DownloadRecording(tut.tutName, tut.filePath)
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
            ) : (
              <div
                className="d-flex justify-content-center align-items-center text-secondary"
                style={{ height: "50vh" }}
              >
                <div>No data matches with {SearchTut}</div>
              </div>
            )
          ) : tuts.length > 0 ? (
            <>
              <ul className="my-3 w-100">
                {currentTuts.map((tut) => {
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
                      key={tut._id}
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
                            {tut.tutName}
                          </p>
                          <span style={{ fontSize: "12px" }}>{timeStamp}</span>
                        </div>
                        <div className="m-0 p-0 mt-3">
                          <button
                            className="my-0 mx-1 p-2 bg-primary rounded text-white"
                            style={{ fontSize: "18px" }}
                            onClick={() => setEditTutId(tut._id)}
                          >
                            <Edit fontSize="inherit" />
                          </button>
                          <button
                            className="my-0 mx-1 p-2 bg-primary rounded text-white"
                            style={{ fontSize: "18px" }}
                            onClick={() =>
                              DownloadRecording(tut.tutName, tut.filePath)
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
              <div className="d-flex justify-content-end align-items-center mt-3 w-100">
                <button
                  className="btn btn-info mx-1"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
                <span className="mx-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-info mx-1"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div
              className="d-flex justify-content-center align-items-center text-secondary"
              style={{ height: "50vh" }}
            >
              <div>No recordings available...</div>
            </div>
          )}
        </div>
        {EditTutId && (
          <div
            className="d-flex align-items-center justify-content-center position-fixed top-0 right-0 bottom-0 left-0"
            style={{ backgroundColor: "#ffffff30" }}
          >
            <div
              className="d-flex align-items-center justify-content-center flex-column bg-light rounded shadow"
              style={{ width: "50%", height: "40%" }}
            >
              <input
                type="text"
                value={EditTutName}
                className="w-75 px-2 py-1 border border-primary rounded"
                onChange={(e) => setEditTutName(e.target.value)}
              />
              <div className="w-75 pt-2">
                <button
                  className="btn btn-primary"
                  style={{ fontSize: "16px" }}
                  onClick={UpdateName}
                >
                  Update
                </button>
                <button
                  className="btn btn-primary"
                  style={{ fontSize: "16px" }}
                  onClick={() => setEditTutId(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </AccountLayout>
    </Layout>
  );
};

export default Tutorials;
