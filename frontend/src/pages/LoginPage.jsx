import { LoginForm } from '../components/auth/LoginForm'


export const LoginPage = () => {
  return (
    
    // Full-screen page wrapper that centers the login card.
    <div className='min-h-screen flex flex-col items-center justify-center bg-background'>

   

      {/* Background gradient layer */}
      <div className='absolute inset-0 bg-gradient-to-br from-secondary to-secondary opacity-1' />

      {/* Main login content container */}
      <div className='z-10 w-full max-w-md px-4'>

        {/* Page heading */}
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold text-foreground'>Welcome back</h1>
          <p>Log in to continue managing your finances</p>
        </div>

        {/* Login Form */}
          
        <LoginForm />
      </div>
    </div>
  )
}
