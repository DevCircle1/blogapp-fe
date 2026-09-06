// Auth screens are deliberately chrome-free so nothing competes with the form.
// Every content page — including the legal pages — keeps the navbar and footer:
// an orphaned page with no navigation reads as an incomplete site to visitors
// and to reviewers.
const hideNavbarRoutes = ['/signup', '/login', '/forget-password', '/update-password'];

export function shouldShowNavbar(pathname) {
  return !hideNavbarRoutes.includes(pathname);
}
