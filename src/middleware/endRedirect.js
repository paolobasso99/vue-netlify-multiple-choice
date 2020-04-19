export default function endRedirects(to, from, next) {
  if (from.name == null && from.path == "/") {
    return next({
      path: "/",
    });
  }
  return next();
}
