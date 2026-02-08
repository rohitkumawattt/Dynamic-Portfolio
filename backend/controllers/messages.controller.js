import Message from "../models/messages.model.js";

// gets all messages
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            messages: messages,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}
// get message by slug
export const getMessageById = async (req, res) => {
    try {
        const { slug } = req.params;
        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Please provide feedback slug."
            })
        }
        const searchRegex = new RegExp(slug, 'i');
        const messages = await Message.find({
            $or: [
                { name: searchRegex },
                { email: searchRegex },
                { message: searchRegex }
            ]
        }).sort({ createdAt: -1 });
        if (messages.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            })
        }
        res.status(200).json({
            success: true,
            message: "Message fetched successfully",
            messages: messages,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

// add messages to database 
export const addMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newMessage = new Message({
            name,
            email,
            message,
        })
        await newMessage.save();
        res.status(200).json({
            success: true,
            message: "Message sent successfully",
            newMessage,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

// function for setting the msg to unreaded and readed
export const setMsgStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const msgId = await Message.findById(id);
        if (!msgId) {
            return res.status(404).json({
                success: false,
                message: "message not found"
            })
        }
        msgId.status = !msgId.status;
        await msgId.save();
        return res.status(200).json({
            success: true,
            message: msgId.status ? "Message marked as read" : "Message marked as unread",
            msgStatus: msgId.status
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
}
// msg mark as read
export const markMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByIdAndUpdate(
      id,
      { status: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message marked as read",
      data: message,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// function for delete msg by id 
export const deleteMsg = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id){
            return res.status(400).json({
                success:false,
                message:"Please provide id"
            })
        }
        const deletedMessage = await Message.findByIdAndDelete(id);
        if (!deletedMessage) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }
        res.status(200).json({
            success:true,
            message:"Message deleted successfully"
        })
    } catch (error) {
      res.status(500).json({success:false, message: error.message });
    }
}