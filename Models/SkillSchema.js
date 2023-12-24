import mongoose from "mongoose";

const skillschema = new mongoose.Schema(
  {
    skillName: {
      type: String,
      require: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Skillschema = new mongoose.model("skills", skillschema);

export default Skillschema;
