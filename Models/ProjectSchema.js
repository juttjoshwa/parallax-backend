import mongoose from "mongoose";

const ProjSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    Url: {
      type: String,
      require: true,
    },
    images: {
      public_id: {
        type: String,
        require: true,
      },
      url: {
        type: String,
        require: true,
      },
    },

    UserCreated: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PortUserData",
    },
  },
  {
    timestamps: true,
  }
);

const ProjectsSchema = mongoose.model("projects", ProjSchema);

export default ProjectsSchema;
