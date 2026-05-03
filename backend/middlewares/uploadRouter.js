export const upload = (...allowedFormats) => {
  try {
    return (req, res, next) => {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const fileFormat = req.file.mimetype.split("/")[1];
      if (!allowedFormats.includes(fileFormat)) {
        return res.status(400).json({ error: "Invalid file format" });
      }
      next();
    };
  } catch (error) {
    console.error("Error in upload middleware:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
