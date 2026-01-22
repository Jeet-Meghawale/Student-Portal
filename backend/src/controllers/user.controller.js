import User from "../models/User.model.js";

export const getUserIdByEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email }).select("_id name email");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            userId: user._id,
            email: user.email,
            name: user.name
        });

    } catch (error) {
        console.error("Get user ID by email error:", error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email }).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

export const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;

        const users = await User.find({ role }).select("-password");

        if (users.length === 0) {
            return res.status(404).json({
                message: "No users found for this role"
            });
        }

        res.status(200).json({
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}