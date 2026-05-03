import { Receipt, RefreshCcw, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '../layout/Navbar'
import api from '../../lib/api/apiClient'
import { extractErrorMessages } from '../../util/errorUtils'

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
// Main dashboard component that displays user stats and recent transactions

export const DashboardContent = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const savedUser = localStorage.getItem('user')
  const user = savedUser ? JSON.parse(savedUser) : null

  // Fetch transactions only if token exists
  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await api.get('/transactions')
      return response.data.transactions
    },
    enabled: Boolean(token),
  })

  const transactions = useMemo(() => data ?? [], [data])

  const stats = useMemo(() => {
    const now = new Date()

    return transactions.reduce((totals, transaction) => {
      const amount = Number(transaction.amount) || 0
      const transactionDate = new Date(transaction.date)
      const isCurrentMonth =
        transactionDate.getMonth() === now.getMonth() &&
        transactionDate.getFullYear() === now.getFullYear()

      if (transaction.type === 'income') {
        totals.income += amount
        totals.balance += amount

        if (isCurrentMonth) totals.monthIncome += amount
      }

      if (transaction.type === 'expense') {
        totals.expense += amount
        totals.balance -= amount

        if (isCurrentMonth) totals.monthExpense += amount
      }

      return totals
    }, {
      balance: 0,
      income: 0,
      expense: 0,
      monthIncome: 0,
      monthExpense: 0,
    })
  }, [transactions])

  const recentTransactions = transactions.slice(0, 5)

// If no token, show sign in prompt instead of dashboard  
  if (!token) {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="mx-auto flex min-h-[70vh] max-w-md items-center">
          <Card className="w-full border-border">
            <CardHeader className="text-center">
              <CardTitle>Sign in required</CardTitle>
              <CardDescription>
                Log in before viewing your finance dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full cursor-pointer" onClick={() => navigate('/login')}>
                Go to login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
        <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back</p>
            <h1 className="text-3xl font-bold text-foreground">
              {user?.username ? `${user.username}'s Dashboard` : 'Dashboard'}
            </h1>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              disabled={isFetching}
              onClick={() => refetch()}
            >
              <RefreshCcw className={isFetching ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </div>
        </header>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {extractErrorMessages(error)}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-border">
            <CardHeader>
              <CardDescription>Total Balance</CardDescription>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Wallet className="text-primary" />
                {formatCurrency(stats.balance)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardDescription>Total Income</CardDescription>
              <CardTitle className="flex items-center gap-2 text-2xl text-primary">
                <TrendingUp />
                {formatCurrency(stats.income)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardDescription>Total Expenses</CardDescription>
              <CardTitle className="flex items-center gap-2 text-2xl text-destructive">
                <TrendingDown />
                {formatCurrency(stats.expense)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardDescription>Transactions</CardDescription>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Receipt className="text-primary" />
                {transactions.length}
              </CardTitle>
            </CardHeader>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest income and expense records</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading && (
                <div className="text-sm text-muted-foreground">Loading transactions...</div>
              )}

              {!isLoading && recentTransactions.length === 0 && (
                <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No transactions found yet.
                </div>
              )}

              {recentTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between gap-4 rounded-md border border-border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {transaction.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.category} - {formatDate(transaction.date)}
                    </p>
                  </div>
                  <div className={transaction.type === 'income' ? 'font-semibold text-primary' : 'font-semibold text-destructive'}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>This Month</CardTitle>
              <CardDescription>Current month income and spending</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-md bg-primary/10 p-3">
                <span className="text-sm font-medium">Income</span>
                <span className="font-semibold text-primary">{formatCurrency(stats.monthIncome)}</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-destructive/10 p-3">
                <span className="text-sm font-medium">Expenses</span>
                <span className="font-semibold text-destructive">{formatCurrency(stats.monthExpense)}</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted p-3">
                <span className="text-sm font-medium">Net</span>
                <span className="font-semibold">
                  {formatCurrency(stats.monthIncome - stats.monthExpense)}
                </span>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
