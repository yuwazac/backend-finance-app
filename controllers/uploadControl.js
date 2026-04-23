import User from "../models/trackSchema.js";

export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.id; //  Use req.user.id to get the authenticated user's ID
    const imagePath = req.file.path; //  Get the URL of the uploaded image from Cloudinary

    // Update user's profile picture URL in the database
    const user = await User.findByIdAndUpdate(
     req.user.id,
      { profilePicture: imagePath }, // Save the image URL to the user's profile
      { new: true }
    );

    console.log(req.file); //  Log the file object to verify the upload
    console.log(req.body); //  Log the request body to check for any additional data

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      imageUrl: imagePath, //  Return the image URL in the response
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ message: "Server error" });
  }
}