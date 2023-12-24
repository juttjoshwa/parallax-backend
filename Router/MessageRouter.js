import express from "express";
import {
  deleteMessage,
  getmessage,
  makeMessage,
} from "../Controller/MessageController.js";

const MessageRouter = express.Router();

MessageRouter.get("/getmessage", getmessage);
MessageRouter.post("/makemessage", makeMessage);
MessageRouter.delete("/delmessage", deleteMessage);

export default MessageRouter;
