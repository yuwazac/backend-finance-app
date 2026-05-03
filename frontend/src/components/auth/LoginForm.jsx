import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { CardContent, CardDescription, CardFooter, CardTitle, Card, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import api from '../../lib/api/apiClient'
import { extractErrorMessages } from '../../util/errorUtils'

export const LoginForm = () => {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState(null)

  const loginMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await api.post('/auth/login', userData)
      return response.data
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    },
    onError: (err) => {
      setError(extractErrorMessages(err))
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormValues({
      ...formValues,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)

    if (!formValues.email || !formValues.password) {
      setError('All fields are required')
      return
    }

    loginMutation.mutate(formValues)
  }

  return (
    <Card className="mx-auto w-full max-w-md border-border">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl text-center">Sign in</CardTitle>
        <CardDescription className="text-center">
          Enter your email and password
        </CardDescription>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-0">
            {
              error && (
                <div className='p-3 bg-destructive/10 text-destructive text-sm rounded-md'>
                  {error}
                </div>
              )
            }
            <div className='space-y-2'>
              <div className='text-sm font-medium text-left'>
                Email
              </div>
              <Input
                name="email"
                placeholder="email@email.com"
                type="email"
                required
                value={formValues.email}
                onChange={handleInputChange}
              />
            </div>

            <div className='space-y-2'>
              <div className='text-sm font-medium text-left'>
                Password
              </div>
              <Input
                name="password"
                type="password"
                placeholder="*****"
                required
                value={formValues.password}
                onChange={handleInputChange}
              />
            </div>

            <div className='py-4'>
              <Button type="submit" className="w-full cursor-pointer" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? (
                  <span className='flex items-center gap-2'>
                    <LoaderCircle className="animate-spin" /> Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center pt-0">
            <div className='text-center text-sm'>
              Don&apos;t have an account? <a onClick={() => navigate('/register')} className='text-primary hover:underline cursor-pointer'>Create account</a>
            </div>
          </CardFooter>
        </form>
      </CardHeader>
    </Card>
  )
}
