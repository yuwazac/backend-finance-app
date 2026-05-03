import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { CardContent, CardDescription, CardFooter, CardTitle, Card, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useMutation } from '@tanstack/react-query'

import api from '../../lib/api/apiClient'

import { extractErrorMessages } from '../../util/errorUtils'


const RegisterForm = () => {

    // Used to redirect the user after successful registration.
    const navigate = useNavigate();

    // State for form values
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    // Stores validation or API error messages shown above the inputs.
    const [error, setError] = useState(null)

    // Handles the API request for creating a new account.
    const registerMutation = useMutation({
        mutationFn: async (userData) => {
            const response = await api.post('/auth/register', userData)
            return response.data
        },
        // Send the user to login after the account is created.
        onSuccess: () => {
            navigate('/login')
        },
        // Convert backend errors into a user-friendly message.
        onError: (err) => {
            console.log("err", err)
            setError(extractErrorMessages(err))
        }
    })

    // Updates the correct form field based on the input name.
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormValues({
            ...formValues,
            [name]: value
        })
    }

   /// Validates the form and submits the registration request.
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        // Make sure required fields are filled in before calling the API.
        if (!formValues.name || !formValues.email || !formValues.password) {
            setError('All fields are required')
            return
        }

        // Confirm both password fields match.
        if (formValues.password !== formValues.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        // Backend expects the full name value as username.
        registerMutation.mutate({
            username: formValues.name,
            email: formValues.email,
            password: formValues.password
        })
    }

    return (
        // Centered register card with a responsive max width.
        <Card className="mx-auto w-full max-w-md border-border">
            <CardHeader className="space-y-1 pb-4">
                {/* Form title and helper text */}
                <CardTitle className="text-xl text-center">Create an account</CardTitle>
                <CardDescription className={"text-center"}>
                    Enter your details to register
                </CardDescription>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4 pt-0">
                        {/* Validation or server error message */}
                        {
                            error && (
                                <div className='p-3 bg-destructive/10 text-destructive text-sm rounded-md'>
                                    {error}
                                </div>
                            )
                        }
                        {/* Full name input */}
                        <div className='space-y-2'>
                            <div className='text-sm font-medium text-left'>
                                Full Name
                            </div>
                            <Input
                                name="name"
                                placeholder="John Doe"
                                required
                                value={formValues.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        {/* Email input */}
                        <div className='space-y-2'>
                            <div className='text-sm font-medium text-left'>
                                Email
                            </div>
                            <Input name="email"
                                placeholder="email@email.com"
                                required
                                value={formValues.email}
                                onChange={handleInputChange}  
                                
                                />
                        </div>
                        {/* Password input */}
                        <div className='space-y-2'>
                            <div className='text-sm font-medium text-left'>
                                Password
                            </div>
                            <Input
                                name="password"
                                type={"password"}
                                placeholder="*****"
                                required

                                value={formValues.password}
                                onChange={handleInputChange}
                                
                                 />
                        </div>
                        {/* Confirm password input */}
                        <div className='space-y-2'>
                            <div className='text-sm font-medium text-left'>
                                Confirm Password
                            </div>
                            <Input
                                name="confirmPassword"
                                type={"password"}
                                placeholder="******"
                                required
                                value={formValues.confirmPassword}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Submit button with loading state */}
                        <div className='py-4'>
                            <Button type="submit" className={"w-full cursor-pointer"} disabled={registerMutation.isPending}>
                                {registerMutation.isPending ? (<span className='flex items-center gap-2'><LoaderCircle className="animate-spin" /> Creating account... </span>) : ("Create Account")}
                            </Button>
                        </div>
                    </CardContent>

                    {/* Link to the login page for existing users */}
                    <CardFooter className={"flex justify-center pt-0"}>
                        <div className='text-center text-sm'>
                            Already have an  account ? <a onClick={() => navigate('/login')} className='text-primary hover:underline cursor-pointer'> Sign in</a>
                        </div>
                    </CardFooter>
                </form>
            </CardHeader>
        </Card>
    )
}

export default RegisterForm
