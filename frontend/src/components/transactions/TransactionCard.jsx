import { ArrowDownCircle, ArrowUpCircle, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const formatCurrency = (amount) => currencyFormatter.format(Number(amount) || 0)

const formatDate = (date) => {
  if (!date) return 'No date'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export const TransactionCard = ({ transaction, onEdit, onDelete }) => {
  const isIncome = transaction?.type === 'income'

  return (
    <Card className="border-border">
      <CardContent className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className={isIncome ? 'text-primary' : 'text-destructive'}>
            {isIncome ? <ArrowUpCircle /> : <ArrowDownCircle />}
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate font-medium text-foreground">
                {transaction?.title || 'Untitled transaction'}
              </h3>
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium capitalize text-muted-foreground">
                {transaction?.type || 'transaction'}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              {transaction?.category || 'Uncategorized'} - {formatDate(transaction?.date)}
            </p>

            {transaction?.description && (
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {transaction.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className={isIncome ? 'font-semibold text-primary' : 'font-semibold text-destructive'}>
            {isIncome ? '+' : '-'}{formatCurrency(transaction?.amount)}
          </div>

          {(onEdit || onDelete) && (
            <div className="flex gap-1">
              {onEdit && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="cursor-pointer"
                  onClick={() => onEdit(transaction)}
                >
                  <Pencil />
                </Button>
              )}

              {onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  className="cursor-pointer"
                  onClick={() => onDelete(transaction)}
                >
                  <Trash2 />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
