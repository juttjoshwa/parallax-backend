import MessagePort from "../Models/Message.js";

export const makeMessage = async (req, res) => {
  try {
    const { name, contact, des } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Name",
      });
    } else if (!contact) {
      return res.status(400).json({
        success: false,
        message: "please Enter contact",
      });
    } else if (!des) {
      return res.status(400).json({
        success: false,
        message: "please Enter description",
      });
    }

    const message = await MessagePort.create({
      name: name,
      Contact: contact,
      description: des,
    });

    if (!message) {
      return res.status(402).json({
        success: false,
        message: "something went wrong",
      });
    }

    return res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went worng",
    });
  }
};

export const getmessage = async (req, res) => {
  try {
    const message = await MessagePort.find({});
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "No message yet!",
      });
    }
    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went worng",
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Id required please",
      });
    }

    const message = await MessagePort.findById(id);
    if (!message) {
      return res.status(402).json({
        success: false,
        message: "No message found",
      });
    }

    const deletedMessage = await message.deleteOne();

    if (!deletedMessage) {
      return res.status(401).json({
        success: false,
        message: "Cannor delete message",
      });
    }

    return res.status(201).json({
      success: true,
      deletedMessage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "something went worng",
    });
  }
};
