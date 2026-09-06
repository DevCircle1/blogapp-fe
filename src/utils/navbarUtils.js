const hideNavbarRoutes = ['/signup', '/login', '/forget-password', '/update-password', '/terms-and-conditions']

export function shouldShowNavbar(pathname) {
  return !hideNavbarRoutes.includes(pathname)
}
