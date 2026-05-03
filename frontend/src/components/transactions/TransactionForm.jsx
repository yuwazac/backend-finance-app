import { LoaderCircle, Trash } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const getToday = () => new Date().toISOString().slice(0, 10)

const getInitialFormValues = (transaction) => ({
  title: transaction?.title ?? '',
  amount: transaction?.amount ? String(transaction.amount) : '',
  type: transaction?.type ?? 'expense',
  category: transaction?.category ?? '',
  date: transaction?.date ? transaction.date.slice(0, 10) : getToday(),
  description: transaction?.description ?? '',
})

export const TransactionForm = ({
  transaction,
  onSubmit,
  onCancel,
  onDelete,
  isSubmitting = false,
}) => {
  const [formValues, setFormValues] = useState(getInitialFormValues(transaction))
  const [error, setError] = useState(null)
  const isEditing = Boolean(transaction?._id)

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormValues({
      ...formValues,
      [name]: value,
    })
  }

//  delete transaction if already exists

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)

    if (!formValues.title || !formValues.amount || !formValues.category || !formValues.description) {
      setError('All fields are required')
      return
    }

    if (Number(formValues.amount) <= 0) {
      setError('Amount must be greater than 0')
      return
    }

    onSubmit?.({
      title: formValues.title.trim(),
      amount: Number(formValues.amount),
      type: formValues.type,
      category: formValues.category.trim(),
      date: formValues.date,
      description: formValues.description.trim(),
    })
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Transaction' : 'Add Transaction'}</CardTitle>
        <CardDescription>
          Track income and expenses in your finance dashboard
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium">Title</div>
              <Input
                name="title"
                placeholder="Salary, groceries, rent..."
                value={formValues.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Amount</div>
              <Input
                name="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formValues.amount}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm font-medium">Type</div>
              <select
                name="type"
                className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                value={formValues.type}
                onChange={handleInputChange}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Category</div>
              <Input
                name="category"
                placeholder="Food, salary, bills..."
                value={formValues.category}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Date</div>
              <Input
                name="date"
                type="date"
                value={formValues.date}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Description</div>
            <textarea
              name="description"
              className="min-h-20 w-full rounded-lg border border-input bg-background px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              placeholder="Short note about this transaction"
              value={formValues.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {isEditing && onDelete && (
              <Button
                type="button"
                variant="destructive"
                className="cursor-pointer"
                onClick={onDelete}
                disabled={isSubmitting}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            {onCancel && (
              <Button type="button" variant="outline" className="cursor-pointer" onClick={onCancel}>
                Cancel
              </Button>
            )}

            <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <LoaderCircle className="animate-spin" />
                  Saving...
                </span>
              ) : (
                isEditing ? 'Update Transaction' : 'Save Transaction'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
