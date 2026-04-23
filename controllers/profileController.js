import User from '../models/trackSchema.js';

export const getProfilePicture = async (req, res) =>{
    try {
        const userId = req.user.id; // Use req.user.id to get the authenticated user's ID
        const user = await User.findById(userId).select("-password");
        if(!userId){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({user});
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
}