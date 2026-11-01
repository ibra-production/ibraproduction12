type RouteLocation = Pick<Location, "pathname" | "search">;

export function isAdminPath(location: RouteLocation): boolean {
  const pathname = location.pathname.toLowerCase();
  const search = new URLSearchParams(location.search);

  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    search.get("admin") === "1"
  );
}
