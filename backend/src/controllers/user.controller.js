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
            name :user.name
        });

    } catch (error) {
        console.error("Get user ID by email error:", error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};
