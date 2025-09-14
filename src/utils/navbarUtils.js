const hideNavbarRoutes = ['/signup', '/login', '/forget-password', '/update-password', '/verify-otp','/terms-and-conditions']

export function shouldShowNavbar(pathname) {
  return !hideNavbarRoutes.includes(pathname)
}