import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // redirect here if not authenticated
  },
});

export const config = {
  matcher: ["/products", "/add-product"], // protect all private routes
};
