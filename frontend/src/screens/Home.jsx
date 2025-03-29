import React, { useEffect, useState } from "react";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // Track which project is being deleted
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/project/all");
      setProjects(response.data.projects);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/project/create", { name: projectName });
      setProjectName("");
      setIsModalOpen(false);
      await fetchProjects();
    } catch (error) {
      console.error(error);
      setError("Failed to create project");
    }
  };

  const deleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      setDeletingId(projectId);
      await axios.delete(`/project/delete/${projectId}`);
      await fetchProjects(); // Refresh the project list
    } catch (error) {
      console.error(error);
      setError("Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

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

        {loading ? (
          <div>Loading projects...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="project flex flex-col gap-2 p-4 border border-slate-300 rounded-md min-w-52 hover:bg-slate-200 relative"
            >
              <div
                onClick={() => navigate(`/project`, { state: { project } })}
                className="cursor-pointer"
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

              <button
                onClick={() => deleteProject(project._id)}
                disabled={deletingId === project._id}
                className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700"
                title="Delete project"
              >
                {deletingId === project._id ? (
                  <i className="ri-loader-4-line animate-spin"></i>
                ) : (
                  <i className="ri-delete-bin-line"></i>
                )}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={() => navigate("/review")}
          className="flex items-center gap-2 p-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring focus:ring-blue-300"
          aria-label="Code Review"
        >
          <i className="ri-search-line"></i> Code Review
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={() => navigate("/design")}
          className="flex items-center gap-2 p-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring focus:ring-blue-300"
          aria-label="Ui Design"
        >
          <i className="ri-search-line"></i> UI Designs
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
              {error && <div className="text-red-500 mb-2">{error}</div>}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
                  onClick={() => {
                    setIsModalOpen(false);
                    setError(null);
                  }}
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
