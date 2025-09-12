const hideNavbarRoutes = ['/signup', '/login', '/forget-password', '/update-password', '/verify-otp']

export function shouldShowNavbar(pathname) {
  return !hideNavbarRoutes.includes(pathname)
}