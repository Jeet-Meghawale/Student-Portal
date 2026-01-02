import Subject from "../models/Subject.model.js";
import User from "../models/User.model.js";

export const createSubject = async (req, res) => {
  try {
    const { name, code, staffId } = req.body;

    // 1. Validation
    if (!name || !code || !staffId) {
      return res.status(400).json({
        message: "Name, code, and staffId are required"
      });
    }

    // 2. Check if subject code already exists
    const existingSubject = await Subject.findOne({ code });
    if (existingSubject) {
      return res.status(409).json({
        message: "Subject code already exists"
      });
    }

    // 3. Check if staff exists and is STAFF
    const staff = await User.findById(staffId);
    if (!staff || staff.role !== "STAFF") {
      return res.status(400).json({
        message: "Invalid staff member"
      });
    }

    // 4. Create subject
    const subject = await Subject.create({
      name,
      code,
      staff: staffId
    });

    res.status(201).json({
      message: "Subject created successfully",
      subject
    });

  } catch (error) {
    console.error("Create subject error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};
