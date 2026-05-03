import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '../components/layout/Navbar'
import { TransactionForm } from '../components/transactions/TransactionForm'
import { TransactionList } from '../components/transactions/TransactionList'
import api from '../lib/api/apiClient'
import { extractErrorMessages } from '../util/errorUtils'

export const Transactions = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const token = localStorage.getItem('token')
  const [formKey, setFormKey] = useState(0)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [error, setError] = useState(null)

  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await api.get('/transactions')
      return response.data.transactions
    },
    enabled: Boolean(token),
  })

  const createTransactionMutation = useMutation({
    mutationFn: async (transactionData) => {
      const response = await api.post('/transactions', transactionData)
      return response.data.transaction
    },
    onSuccess: () => {
      setError(null)
      setEditingTransaction(null)
      setFormKey((key) => key + 1)
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
    onError: (err) => {
      setError(extractErrorMessages(err))
    },
  })

  const updateTransactionMutation = useMutation({
    mutationFn: async (transactionData) => {
      const response = await api.put(`/transactions/${editingTransaction._id}`, transactionData)
      return response.data.transaction
    },
    onSuccess: () => {
      setError(null)
      setEditingTransaction(null)
      setFormKey((key) => key + 1)
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
    onError: (err) => {
      setError(extractErrorMessages(err))
    },
  })

  const deleteTransactionMutation = useMutation({
    mutationFn: async (transactionId) => {
      await api.delete(`/transactions/${transactionId}`)
    },
    onSuccess: () => {
      setError(null)
      setEditingTransaction(null)
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
    onError: (err) => {
      setError(extractErrorMessages(err))
    },
  })

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
  }

  const handleDelete = (transaction) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransactionMutation.mutate(transaction._id)
    }
  }

  const handleSubmit = (transactionData) => {
    if (editingTransaction) {
      updateTransactionMutation.mutate(transactionData)
    } else {
      createTransactionMutation.mutate(transactionData)
    }
  }

  const handleCancel = () => {
    setEditingTransaction(null)
    setFormKey((key) => key + 1)
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
          <Card className="w-full border-border">
            <CardHeader className="text-center">
              <CardTitle>Sign in required</CardTitle>
              <CardDescription>
                Log in before creating transactions.
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

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[420px_1fr]">
        <section className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <TransactionForm
            key={formKey}
            transaction={editingTransaction}
            isSubmitting={createTransactionMutation.isPending || updateTransactionMutation.isPending || deleteTransactionMutation.isPending}
            onSubmit={handleSubmit}
            onCancel={editingTransaction ? handleCancel : undefined}
            onDelete={editingTransaction ? () => handleDelete(editingTransaction) : undefined}
          />
        </section>

        <section className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
            <p className="text-sm text-muted-foreground">
              Create and review your income and expense records.
            </p>
          </div>

          <TransactionList
            transactions={data ?? []}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  )
}
