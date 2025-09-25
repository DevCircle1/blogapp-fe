import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { toast } from 'react-toastify'

const navigation = [
  { name: 'Home', href: '/', current: false },
  { name: 'Blogs', href: '/blogs', current: false },
  { name: 'Tools', href: '/tools', current: false },
  { name: 'Contact Us', href: '/contact-us', current: false },
  { name: 'Write Blogs', href: '/write-blogs', current: false, requiresAuth: true },
  { name: 'Job Alerts', href: '/job-alert', current: false, requiresAuth: false }, 
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const { isAuthenticated, user, logoutUser } = useAuth()
  const location = useLocation()

  // Update the current property based on the current path
  const updatedNavigation = navigation.map(item => ({
    ...item,
    current: location.pathname === item.href
  }))

  // Handle navigation with authentication check
  const handleNavigation = (item, e) => {
    if (item.requiresAuth && !isAuthenticated) {
      e.preventDefault()
      toast.info(`Please log in first to access ${item.name.toLowerCase()}`)
    }
  }

  return (
    <Disclosure
      as="nav"
      className="relative bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm border-b border-gray-200"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              
              {/* Mobile menu button and logo */}
              <div className="flex items-center sm:hidden">
                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-blue-500/10 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
                
                {/* Logo for mobile */}
                <div className="ml-4 flex items-center">
                  <img
                    alt="Dev Circle"
                    src="logo.png"
                    className="h-10 w-auto"
                  />
                </div>
              </div>

              {/* Logo for desktop */}
              <div className="hidden sm:flex flex-shrink-0 items-center sm:absolute sm:left-0">
                <img
                  alt="Dev Circle"
                  src="logo.png"
                  className="h-8 w-auto sm:h-24"
                />
              </div>

              {/* Center Nav Links (hidden on mobile) */}
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
                <div className="flex space-x-4">
                  {updatedNavigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={(e) => handleNavigation(item, e)}
                      className={classNames(
                        item.current
                          ? 'bg-blue-500/20 text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:bg-blue-500/10 hover:text-gray-900',
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

              {/* Right Side - Profile or Auth Links */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {isAuthenticated ? (
                  <>
                    <Menu as="div" className="relative ml-3">
                      <MenuButton className="relative flex rounded-full">
                        <img
                          alt="User avatar"
                          src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&q=80"}
                          className="size-8 rounded-full bg-gray-300"
                        />
                      </MenuButton>

                      <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 border border-gray-200">
                        <MenuItem>
                          <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500/10">
                            Your profile
                          </a>
                        </MenuItem>
                        <MenuItem>
                          <NavLink 
                            to="/job-alert" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500/10"
                          >
                            Job Alerts
                          </NavLink>
                        </MenuItem>
                        <MenuItem>
                          <button
                            onClick={logoutUser}
                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500/10"
                          >
                            Sign out
                          </button>
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  </>
                ) : (
                  <div className="flex space-x-2">
                    <NavLink
                      to="/login"
                      className={({ isActive }) => classNames(
                        isActive 
                          ? 'bg-blue-500/20 text-gray-900' 
                          : 'text-gray-600 hover:bg-blue-500/10 hover:text-gray-900',
                        'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200'
                      )}
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/signup"
                      className={({ isActive }) => classNames(
                        isActive 
                          ? 'bg-blue-500/20 text-gray-900' 
                          : 'text-gray-600 hover:bg-blue-500/10 hover:text-gray-900',
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

          {/* Mobile Menu */}
          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3 bg-white rounded-b-lg border-b border-gray-200">
              {updatedNavigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={NavLink}
                  to={item.href}
                  onClick={(e) => handleNavigation(item, e)}
                  className={classNames(
                    item.current ? 'bg-blue-500/20 text-gray-900' : 'text-gray-600 hover:bg-blue-500/10 hover:text-gray-900',
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
        </>
      )}
    </Disclosure>
  )
}