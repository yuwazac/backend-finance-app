import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";

export const getMonthlySummary = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const summary = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: {
            $gte: new Date(year, month, 1),
            $lt: new Date(year, month + 1, 1),
          },
        },
      },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    res.status(200).json({ summary });
  } catch (error) {
    next(error);
  }
};