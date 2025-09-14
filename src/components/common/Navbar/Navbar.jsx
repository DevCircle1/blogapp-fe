import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { toast } from 'react-toastify'

// Define navigation items
const navigation = [
  { name: 'Home', href: '/', current: false },
  { name: 'Blogs', href: '/blogs', current: false },
  { name: 'Tools', href: '/tools', current: false },
  { name: 'Contact Us', href: '/contact-us', current: false },
  { name: 'Write Blogs', href: '/write-blogs', current: false, requiresAuth: true },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const { isAuthenticated, user, logoutUser } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Update the current property based on the current path
  const updatedNavigation = navigation.map(item => ({
    ...item,
    current: location.pathname === item.href
  }))

  // Handle navigation with authentication check
  const handleNavigation = (item, e) => {
    if (item.requiresAuth && !isAuthenticated) {
      e.preventDefault()
      toast.info('Please log in first to write blogs')
      // Optionally redirect to login page
      // navigate('/login', { state: { from: location } })
    }
  }

  return (
    <Disclosure
      as="nav"
      className="relative bg-gradient-to-r from-slate-800 to-slate-900 shadow-md after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-indigo-400/20"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-slate-300 hover:bg-indigo-500/10 hover:text-white">
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=400"
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {updatedNavigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={(e) => handleNavigation(item, e)}
                    className={classNames(
                      item.current
                        ? 'bg-indigo-500/20 text-white shadow-sm'
                        : 'text-slate-300 hover:bg-indigo-500/10 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200',
                      item.requiresAuth && !isAuthenticated ? 'opacity-80 cursor-not-allowed' : ''
                    )}
                  >
                    {item.name}
                    {item.requiresAuth && !isAuthenticated && (
                      <span className="ml-1 text-xs">🔒</span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  className="relative rounded-full p-1 text-slate-300 hover:text-white"
                >
                  <BellIcon aria-hidden="true" className="size-6" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                  </span>
                </button>

                <Menu as="div" className="relative ml-3">
                  <MenuButton className="relative flex rounded-full">
                    <img
                      alt="User avatar"
                      src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&q=80"}
                      className="size-8 rounded-full bg-slate-700"
                    />
                  </MenuButton>

                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-slate-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <MenuItem>
                      <a href="/profile" className="block px-4 py-2 text-sm text-slate-200 hover:bg-indigo-500/10">
                        Your profile
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <button
                        onClick={logoutUser}
                        className="w-full text-left block px-4 py-2 text-sm text-slate-200 hover:bg-indigo-500/10"
                      >
                        Sign out
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </>
            ) : (
              <div className="space-x-3">
                <NavLink
                  to="/login"
                  className={({ isActive }) => classNames(
                    isActive 
                      ? 'bg-indigo-500/20 text-white' 
                      : 'text-slate-300 hover:bg-indigo-500/10 hover:text-white',
                    'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200'
                  )}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className={({ isActive }) => classNames(
                    isActive 
                      ? 'bg-indigo-500/20 text-white' 
                      : 'text-slate-300 hover:bg-indigo-500/10 hover:text-white',
                    'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200'
                  )}
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3 bg-slate-800 rounded-b-lg">
          {updatedNavigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={NavLink}
              to={item.href}
              onClick={(e) => handleNavigation(item, e)}
              className={classNames(
                item.current ? 'bg-indigo-500/20 text-white' : 'text-slate-300 hover:bg-indigo-500/10 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200',
                item.requiresAuth && !isAuthenticated ? 'opacity-80 cursor-not-allowed' : ''
              )}
            >
              {item.name}
              {item.requiresAuth && !isAuthenticated && (
                <span className="ml-1 text-xs">🔒</span>
              )}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}