import { TransactionCard } from './TransactionCard'

export const TransactionList = ({
  transactions = [],
  isLoading = false,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-24 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        No transactions found yet.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction._id}
          transaction={transaction}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
