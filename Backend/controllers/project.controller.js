// import projectModel from '../models/project.model.js';
import * as projectService from '../services/project.service.js';
import userModel from '../models/user.model.js';
import { validationResult } from 'express-validator';


export const createProject = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { name } = req.body;
        const loggedInUser = await userModel.findOne({ email: req.user.email });
        const userId = loggedInUser._id;

        const newProject = await projectService.createProject({ name, userId });

        res.status(201).json(newProject);

    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
}

export const getAllProjects = async (req, res) => {
    try {
        const loggedInUser = await userModel.findOne({ email: req.user.email })
        const userId = loggedInUser._id;

        const allUserProjects = await projectService.getAllProjects(userId);
        return res.status(200).json({projects : allUserProjects})

    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
}

export const addUserToProject = async (req,res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {projectId, users} = req.body;
        const loggedInUser = await userModel.findOne({ email: req.user.email });
        const userId = loggedInUser._id;

        const updatedProject = await projectService.addUsersToProject({projectId, users, userId});

        return res.status(200).json(updatedProject);

    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
}

export const getUsersInProject = async (req,res) => {
    try {
        const {projectId} = req.params;
        const project = await projectService.getUsersInProject(projectId);
        return res.status(200).json(project);
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
}
}

export const getProjectById = async (req, res) => {

    const { projectId } = req.params;
    try {

        const project = await projectService.getProjectById({ projectId });

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}

export const updateFileTree = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, fileTree } = req.body;

        const project = await projectService.updateFileTree({
            projectId,
            fileTree
        })

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}

export const deleteProjectController = async (req, res) => {
  const { projectId } = req.params;
  const loggedInUser = await userModel.findOne({ email: req.user.email });
  const userId = loggedInUser._id;

  try {
    const result = await projectService.deleteProject({ projectId, userId });
    res.status(200).json({
      message: "Project deleted successfully",
      deletedProject: result,
    });
  } catch (error) {
    console.error(error);

    const statusCode = error.message.includes("not authorized")
      ? 403
      : error.message.includes("not found")
      ? 404
      : 400;

    res.status(statusCode).json({
      error: error.message || "Failed to delete project",
    });
  }
};