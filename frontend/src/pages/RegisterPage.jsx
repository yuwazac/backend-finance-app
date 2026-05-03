import RegisterForm from '../components/auth/RegisterForm'


const RegisterPage = () => {
    return (
        /* Full-screen page wrapper that centers the register card. */
        <div className='min-h-screen flex flex-col items-center justify-center bg-background'>

            {/* Background gradient layer */}
            <div className='absolute inset-0 bg-gradient-to-br from-secondary to-secondary opacity-1' />

            {/* Main register content container */}
            <div className='z-10 w-full max-w-md px-4'>

                {/* Page heading */}
                <div className='mb-8 text-center'>
                    <h1 className='text-3xl font-bold text-foreground'>Join us today</h1>
                    <p>Create an account in just a few steps</p>
                </div>

                {/* Registration Form */}
               
                <RegisterForm />
            </div>
        </div>
    )
}

export default RegisterPage
