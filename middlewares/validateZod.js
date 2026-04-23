import z from 'zod';

export const validate = (schema) => (req, res, next) =>{
    const validationResult = schema.safeParse(req.body);
    if (!validationResult.success) {
       const formatted = validationResult.error.format();
       return res.status(400).json({ 
        success: false,
        message: "Validation failed",
        errors: Object.keys(formatted).filter(key => key !== "_errors").map(key => ({
            field: key,
            message: formatted[key]._errors.join(", ")
        })),
        });
    }
    req.body = validationResult.data; //  Use the validated data
    next();
};