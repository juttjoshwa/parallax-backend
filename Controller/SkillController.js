import Skillschema from "../Models/SkillSchema.js";

export const MakeSkill = async (req, res) => {
  try {
    const { skill } = req.body;
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Please fill all the fileds",
      });
    }

    const Skillcheck = await Skillschema.findOne({ skill });

    if (Skillcheck) {
      return res.status(409).json({
        success: false,
        message: "this Skill already available",
      });
    }
    const skillCreate = await Skillschema.create({
      skillName: skill,
    });

    if (!skillCreate) {
      return res.status(405).json({
        success: false,
        message: "Cannot create skill",
      });
    }

    await skillCreate.save();

    return res.status(201).json({
      success: true,
      skillCreate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
};

export const GetAllSkill = async (req, res) => {
  try {
    const AllSkills = await Skillschema.find({});
    if (!AllSkills) {
      return res.status(404).json({
        success: false,
        message: "All skill not found",
      });
    }

    return res.status(200).json({
      success: true,
      AllSkills,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
};

export const UpdateSkill = async (req, res) => {
  try {
    const id = req.query.id;
    const name = req.query.name;

    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Id is required",
      });
    }
    if (!name) {
      return res.status(404).json({
        success: false,
        message: "Name is required",
      });
    }

    const skill = await Skillschema.findById(id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "skill not found",
      });
    }

    if (name) {
      skill.skillName = name;
    }

    const savedskill = await skill.save();

    return res.status(200).json({
      success: true,
      savedskill,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
};

export const Delskill = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Id is required",
      });
    }

    const skill = await Skillschema.findById(id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Your skill not found",
      });
    }

    const savedskill = await skill.deleteOne();

    return res.status(200).json({
      success: false,
      savedskill,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went wrong",
    });
  }
};
