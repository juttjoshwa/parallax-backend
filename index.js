import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import DB_connect from "./DataBase/DB.js";
import UserRouter from "./Router/UserRouter.js";
import fileUpload from "express-fileupload";
import ProjectsRoutes from "./Router/ProjectsRouter.js";
import SkillRouter from "./Router/SkillRouter.js";
import MessageRouter from "./Router/MessageRouter.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
dotenv.config();

app.use(
  cors({
    // origin: "https://protfolio-parallax.vercel.app",
    origin:
      "https://6587b8c944a5bcfa9db4e790--zippy-rugelach-5ddb7a.netlify.app",
    credentials: true,
  })
);
app.use(cookieParser());

app.listen(process.env.PORT, () => {
  try {
    console.log(
      `server is working fine on http://localhost:${process.env.PORT}/`
    );
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
});

app.get("/", (req, res) => {
  res.status(200).send("server is working fine");
});

app.use("/api", UserRouter);
app.use("/api/make", ProjectsRoutes, SkillRouter);
app.use("/api/message", MessageRouter);

DB_connect();
