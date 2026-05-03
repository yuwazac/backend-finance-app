import './App.css'
import { Navigate, Route, Routes } from 'react-router'
import { LoginPage } from './pages/LoginPage'

import RegisterPage from './pages/RegisterPage'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { Profile } from './pages/Profile'


function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" replace />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
   
  )
}

export default App
