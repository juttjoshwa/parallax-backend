import jwt from "jsonwebtoken";
import express from "express";
import {
  DeleteProject,
  GetAllProjects,
  MakeProject,
  UpdateProject,
} from "../Controller/ProjectsController.js";
import multer from "multer";

const requireAuth = async (req, res, next) => {
  const token = req.cookies.token; // Extract token from the cookie in the request
  const secretToken = process.env.JWT; // Secret key for verifying the token

  if (!token) {
    // If the token is not present, return a 401 Unauthorized response
    return res
      .status(401)
      .json({ message: "Please log in to access this resource" });
  }
  try {
    // Verify the token using the secret key
    const decodedToken = await jwt.verify(token, secretToken);
    req.user = decodedToken; // Set the decoded token as part of the request object
    next(); // Move to the next middleware or route handler
  } catch (err) {
    // If the token verification fails, return a 401 Unauthorized response
    return res.status(401).json({ message: "Invalid token" });
  }
};

const ProjectsRoutes = express.Router();

ProjectsRoutes.post("/makePro", MakeProject);
ProjectsRoutes.put("/updatePro", UpdateProject);
// ProjectsRoutes.post("/testpro", requireAuth, TestPro);
ProjectsRoutes.get("/getallprojects", GetAllProjects);
ProjectsRoutes.delete("/deleteproject", DeleteProject);

export default ProjectsRoutes;
