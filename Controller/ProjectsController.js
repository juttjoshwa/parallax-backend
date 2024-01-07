import ProjectsSchema from "../Models/ProjectSchema.js";
import cloudniary from "cloudinary";

const Cloudinary = cloudniary.v2;

Cloudinary.config({
  cloud_name: "dh2qwzkj1",
  api_key: "929941173912571",
  api_secret: "fS7DO2Vp_PsAntiFqFN3dC8KpJo",
});

// export const TestPro = async (req, res) => {
//   try {
//     const file = req.files.fi;
//     console.log(file);
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Something went wrong",
//     });
//   }
// };

export const MakeProject = async (req, res) => {
  try {
    const { name, des, url } = req.body;
    if (!name) {
      return res.status(401).json({
        success: false,
        message: "Please enter Name",
      });
    } else if (!des) {
      return res.status(401).json({
        success: false,
        message: "Please enter Description",
      });
    } else if (!url) {
      return res.status(401).json({
        success: false,
        message: "Please enter url",
      });
    }

    // Check if files were uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files were uploaded.",
      });
    }

    const file = req.files.fi; // Adjust 'yourFile' to match the key in your form

    // Check if 'yourFile' exists in the request
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameter - yourFile",
      });
    }

    const Cloudinary_response = await Cloudinary.uploader
      .upload(file.tempFilePath)
      .catch((err) => {
        return err.message;
      });

    if (!Cloudinary_response) {
      return res.status(409).json({
        success: false,
        message: "Cannot Upload",
      });
    }

    const project = await ProjectsSchema.create({
      name: name,
      description: des,
      Url: url,
      images: {
        public_id: Cloudinary_response.public_id,
        url: Cloudinary_response.secure_url,
      },
    });

    if (!project) {
      return res.status(409).json({
        success: false,
        message: "Project creation went wrong",
      });
    }

    return res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const UpdateProject = async (req, res) => {
  try {
    const { id, name, des, url } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const project = await ProjectsSchema.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (name) {
      project.name = name;
    }

    if (des) {
      project.description = des;
    }

    if (url) {
      project.Url = url;
    }

    const avatar = req.files ? req.files.sad : null;

    if (avatar) {
      const Cloudinary_response = await Cloudinary.uploader.upload(
        avatar.tempFilePath
      );

      project.images = {
        public_id: Cloudinary_response.public_id,
        url: Cloudinary_response.secure_url,
      };
    }

    // Save the updated project to the database
    await project.save();

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const DeleteProject = async (req, res) => {
  try {
    const id = req.query.id;
    const dew = req.query.dew;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }
    if (!dew) {
      return res.status(400).json({
        success: false,
        message: "Project dew is required",
      });
    }
    const imageUrlString = dew;

    const split = imageUrlString.split("/");

    const endVal = split[split.length - 1];

    const endName = endVal.split(".");

    const ImageName = endName[0];

    // Find the project by ID
    const project = await ProjectsSchema.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await project
      .deleteOne()
      .then((res) => {
        cloudniary.uploader.destroy(ImageName, (err, res) => {
          console.log(err, res);
        });
      })
      .catch((err) => {
        console.log(err);
      });

    return res.status(200).json({
      success: true,
      message: "Project Deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const GetAllProjects = async (req, res) => {
  try {
    const allprojects = await ProjectsSchema.find({});
    if (!allprojects) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    return res.status(201).json({
      success: true,
      allprojects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
