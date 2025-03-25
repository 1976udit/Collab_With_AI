import React, { useEffect, useState } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  // const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [project, setProject] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/project/all")
      .then((res) => {
        setProject(res.data.projects);
        // console.log(res.data.projects);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function createProject(e) {
    e.preventDefault();
    console.log(projectName);
    setIsModalOpen(false);

    axios
      .post("/project/create", { name: projectName })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <main className="p-2 flex flex-col gap-6">
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="project p-4 border border-slate-300 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          New Project
          <i className="ri-add-line ml-2"></i>
        </button>

        {project.map((project) => (
          <div
            key={project._id}
            onClick={() => {
              navigate(`/project`, {
                state: { project },
              });
            }}
            className="project flex flex-col gap-2 cursor-pointer p-4 border border-slate-300 rounded-md min-w-52 hover:bg-slate-200"
          >
            <h2 className="font-semibold">{project.name}</h2>

            <div className="flex gap-2">
              <p>
                <small>
                  <i className="ri-user-line"></i> Collaborators
                </small>
                :
              </p>
              {project.users.length}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button
          onClick={() => {
            navigate("/review");
          }}
          className="flex items-center gap-2 p-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring focus:ring-blue-300"
          aria-label="Code Review"
        >
          <i className="ri-search-line"></i> Code Review
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h2 className="text-xl mb-4">Create New Project</h2>
            <form onSubmit={createProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
