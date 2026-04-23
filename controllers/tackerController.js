
import User from "../models/trackSchema.js";


export const createTrackController = async (req, res, next) =>{
    try {
        console.log("REQ user:", req.user); // ✅ Check if req.user is populated

        const userId = req.user.id; // ✅ Use req.user.id to get the authenticated user's ID
        const { name, amount, type } = req.body;

        // Validate input
        if (!name || !amount || !type) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create new track
        const newTrack = {
            name,
            amount,
            type,
            date: new Date()
        };

        // Find user and add track
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.tracks.push(newTrack);
        await user.save();

        res.status(201).json({ message: "Track created successfully", track: newTrack });
    } catch (error) {
        console.error("Error creating track:", error);
        next(error);
    }
}

// get all tracks for a user
export const getTracksController = async (req, res, next) => {
    try {
        const userId = req.user.id; // ✅ Use req.user.id to get the authenticated user's ID

        // Find user and return tracks
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ tracks: user.tracks });
    } catch (error) {
        console.error("Error fetching tracks:", error);
        next(error);
    }
}
