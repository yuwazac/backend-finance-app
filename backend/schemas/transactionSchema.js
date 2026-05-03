import z from 'zod';

const transactionSchema = z.object({
  title: z.string().max(100, { message: 'Title must be less than 100 characters' }),
  amount: z.number().positive({ message: 'Amount must be a positive number' }),
  type: z.enum(['income', 'expense'], { message: 'Type must be income or expense' }),
  description: z.string().max(255, { message: 'Description must be less than 255 characters' }),
  category: z.string().max(50, { message: 'Category must be less than 50 characters' }),
  date: z.string().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: 'Invalid date format' })
});


export default transactionSchema;
