import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Get current user failed" });
  }
};

export const updateUserLocation = async (req, res) => {
  try {
    const userId = req.userId;
    const { latitude, longitude } = req.body;
    const user = await User.findByIdAndUpdate(userId, {
      location: { type: "Point", coordinates: [longitude, latitude] }
    }, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // await user.save(); // Ensure the updated user is saved
    res.status(200).json({message: "User location updated successfully"});
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Update user location failed" });
  }
};