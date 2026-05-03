import User from "../models/trackSchema.js";

export const uploadProfilePicture = async (req, res) => {
  try {
    console.log("Upload request received");
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);
    console.log("req.user:", req.user);

    if (!req.file) {
      console.log("No file uploaded - req.file is undefined");
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!req.file.path) {
      console.log("File uploaded but no path - Cloudinary upload failed");
      console.log("File details:", req.file);
      return res.status(400).json({ message: "File upload failed - no path returned" });
    }

    const userId = req.user.id; //  Use req.user.id to get the authenticated user's ID
    const imagePath = req.file.path; //  Get the local file path

    // For now, just store the local path - later we'll upload to Cloudinary
    const user = await User.findByIdAndUpdate(
     req.user.id,
      { profile: `/uploads/${req.file.filename}` }, // Store relative path for now
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