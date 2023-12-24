import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    Contact: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
  },
  {
    timestampe: true,
  }
);

const MessagePort = new mongoose.model("clientMessage", MessageSchema);
export default MessagePort;
