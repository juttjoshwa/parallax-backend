import bcrypt from "bcrypt";
import UserPort from "../Models/userSchema.js";
import Cloudinary from "cloudinary";
import jwt from "jsonwebtoken";

const cloudinary = Cloudinary.v2;

cloudinary.config({
  cloud_name: "dh2qwzkj1",
  api_key: "929941173912571",
  api_secret: "fS7DO2Vp_PsAntiFqFN3dC8KpJo",
});

const sendingToken = (statusCode, user, res) => {
  const tokenForAuth = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT,
    {
      expiresIn: "1d",
    }
  );

  const expires = 1;
  const options = {
    expires: new Date(Date.now() + expires * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
  };
  res.status(statusCode).cookie("token", tokenForAuth, options).json({
    success: true,
    user,
    tokenForAuth,
  });
};

export const CreateUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Name",
      });
    } else if (!password) {
      return res.status(400).json({
        success: false,
        message: "please Enter Email",
      });
    }

    const avatar = req.files.sad;

    const Cloudinary_response = await cloudinary.uploader
      .upload(avatar.tempFilePath)
      .catch((err) => {
        console.log(err.message);   
      });

    const existingName = await UserPort.findOne({ name });
    if (existingName) {
      return res.status(409).json({
        success: false,
        message: "already have an Space in the DB",
      });
    }

    const genSalt = await bcrypt.genSalt(10);
    const hashed_pass = await bcrypt.hash(password, genSalt);

    const user = await UserPort.create({
      name,
      password: hashed_pass,
      image: {
        public_id: Cloudinary_response.public_id,
        url: Cloudinary_response.secure_url,
      },
    });

    if (!user) {
      return res.status(500).send("user creation failed");
    }
    sendingToken(200, user, res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went worng",
    });
  }
};

export const LoginUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name) {
      return res.status(409).json({
        success: false,
        message: "Please enter Name",
      });
    } else if (!password) {
      return res.status(409).json({
        success: false,
        message: "Please enter Password",
      });
    }

    const user = await UserPort.findOne({ name }).select("+password");

    if (!user) {
      return res.status(409).json({
        success: false,
        message: "Invaild Name OR password",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Password is Wrong",
      });
    }

    return sendingToken(201, user, res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
};

export const Logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()), // Set the cookie expiration to the current date to remove it
    httpOnly: true, // Set the cookie as httpOnly to prevent client-side access
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};

export const GetMyProfile = async (req, res) => {
  try {
    const user = await UserPort.findById(req.user.id).select("-password"); // Find the user by ID and exclude the password field from the result
    const newUser = user;

    if(!newUser){
      return res.status(404).json({
        success:false,
        message : "User not found"
      })
    }

    res.status(200).json({
      success: true,
      newUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
};

export const CreateUserT = async (req, res) => {
  try {
    const avatar = req.files;
    if (!avatar) {
      return res.status(409).send("nahi mila");
    }
    let image = avatar.sad;
    console.log(image.map(res=>{
      res.pubilic_id
    }));

    // const Cloudinary_response = await cloudinary.uploader.upload(image);

    // // Now you can access the properties from the Cloudinary_response object
    // console.log(Cloudinary_response.public_id);
    // console.log(Cloudinary_response.secure_url);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
};
