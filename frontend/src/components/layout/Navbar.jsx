import { BarChart3, LogIn, LogOut, Menu, ReceiptText, User, UserPlus, Wallet, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinkClass = ({ isActive }) => cn(
  'inline-flex h-8 items-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground',
  isActive ? 'bg-muted text-foreground' : 'text-muted-foreground'
)

export const Navbar = () => {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const token = localStorage.getItem('token')
  const savedUser = localStorage.getItem('user')
  const user = savedUser ? JSON.parse(savedUser) : null

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 text-left font-semibold text-foreground"
          onClick={() => {
            closeMenu()
            navigate(token ? '/dashboard' : '/login')
          }}
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Wallet className="size-4" />
          </span>
          Finance App
        </button>

        <div className="hidden items-center gap-2 sm:flex">
          {token ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                <BarChart3 className="mr-1 size-4" />
                Dashboard
              </NavLink>

              <NavLink to="/transactions" className={navLinkClass}>
                <ReceiptText className="mr-1 size-4" />
                Transactions
              </NavLink>

              <NavLink to="/profile" className={navLinkClass}>
                <User className="mr-1 size-4" />
                Profile
              </NavLink>

              <span className="text-sm text-muted-foreground">
                {user?.username || user?.email}
              </span>

              <Button type="button" variant="destructive" className="cursor-pointer" onClick={handleLogout}>
                <LogOut />
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                <LogIn className="mr-1 size-4" />
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClass}>
                <UserPlus className="mr-1 size-4" />
                Register
              </NavLink>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:bg-muted sm:hidden"
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-background px-4 py-3 sm:hidden">
          {token ? (
            <div className="space-y-2">
              <NavLink to="/dashboard" className={navLinkClass} onClick={closeMenu}>
                <BarChart3 className="mr-1 size-4" />
                Dashboard
              </NavLink>

              <NavLink to="/transactions" className={navLinkClass} onClick={closeMenu}>
                <ReceiptText className="mr-1 size-4 " />
                Transactions
              </NavLink>

              <NavLink to="/profile" className={navLinkClass} onClick={closeMenu}>
                <User className="mr-1 size-4" />
                Profile
              </NavLink>

              <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                {user?.username || user?.email}
              </div>

              <Button type="button" variant="destructive" className="w-full cursor-pointer" onClick={() => {
                closeMenu()
                handleLogout()
              }}>
                <LogOut />
                Logout
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <NavLink to="/login" className={navLinkClass} onClick={closeMenu}>
                <LogIn className="mr-1 size-4" />
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClass} onClick={closeMenu}>
                <UserPlus className="mr-1 size-4" />
                Register
              </NavLink>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
