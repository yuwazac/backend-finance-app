import Transaction from '../models/Transaction.js';

// post a new transaction
export const createTransaction = async (req, res, next) => {
  try {
    console.log("RAW BODY:", req.body);

    const userId = req.user.id;

    // 🔥 TEMP DEBUG FALLBACK (remove later)
    const safeBody = {
      ...req.body,
      type: req.body.type ?? "expense" // fallback only if missing
    };

    const {
      title,
      amount,
      type,
      category,
      description,
      date
    } = safeBody;

    console.log("TYPE FIELD:", type);

    // ✅ Proper validation (no weak truthy checks)
    if (
      title == null ||
      amount == null ||
      type == null ||
      category == null ||
      description == null
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // ✅ Create transaction
    const newTransaction = new Transaction({
      user: userId,
      title,
      amount,
      type,
      category,
      description,
      date: date ? new Date(date) : new Date()
    });

    await newTransaction.save();

    res.status(201).json({
      message: "Transaction created successfully",
      transaction: newTransaction
    });

  } catch (error) {
    console.error("Error creating transaction:", error);
    next(error);
  }
};
// get all transactions for a user
export const getTransactions = async (req, res, next) => {
    try {
        const userId = req.user.id; // ✅ Use req.user.id to get the authenticated user's ID

        // Find transactions for the user
        const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });

        res.status(200).json({ transactions });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        next(error);
    }
}

// get a single transaction by ID
export const getTransactionById = async (req, res, next) => {
    try {
        const userId = req.user.id; // ✅ Use req.user.id to get the authenticated user's ID
        const transactionId = req.params.id;

        // Find transaction by ID and ensure it belongs to the user
        const transaction = await Transaction.findOne({ _id: transactionId, user: userId });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ transaction });
    } catch (error) {
        console.error("Error fetching transaction:", error);
        next(error);
    }
}

// update a transaction by ID
export const updateTransaction = async (req, res, next) => {
    try {
        const userId = req.user.id; // ✅ Use req.user.id to get the authenticated user's ID
        const transactionId = req.params.id;
        const { title, amount, type, category, description } = req.body;

        // Find transaction by ID and ensure it belongs to the user
        const transaction = await Transaction.findOne({ _id: transactionId, user: userId });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        // Update transaction fields
        if (title) transaction.title = title;
        if (amount) transaction.amount = amount;
        if (type) transaction.type = type;
        if (category) transaction.category = category;
        if (description) transaction.description = description;

        await transaction.save();

        res.status(200).json({ message: "Transaction updated successfully", transaction });
    } catch (error) {
        console.error("Error updating transaction:", error);
        next(error);
    }
}

// delete a transaction by ID

export const deleteTransaction = async (req, res, next) => {
try {
    const deleted = await Transaction.findByIdAndDelete({
        _id: req.params.id,
        user: req.user.id
    });
    if (!deleted){
        return res.status(404).json({ message: "transaction not found"});
    }
    res.status(200).json({ message: "transaction deleted successfully"});
} catch (error) {
    console.error("Error deleting transaction:", error);
    next(error);
    
}
}

