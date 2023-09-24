import { FC } from "react";

import {
  LoaderFunctionArgs,
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import Layout from "../page/user/layout";
import About from "../page/user/about";
import PublicPage from "../page/user/publicepage";
import Login from "../page/user/login";
import { fakeAuthProvider } from "../page/auth/fakeauth";
const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    loader() {
      // Our root route always provides the user, if logged in
      return { user: fakeAuthProvider.username };
    },
    Component: Layout,
    children: [
      {
        index: true,
        Component: PublicPage,
      },
      {
        path: "login",
        Component: Login,
        loader: loginLoader,
        action: loginAction,
      },

      {
        path: "protected",
        loader: protectedLoader,
        Component: ProtectedPage,
      },
    ],
  },
  {
    path: "about",
    Component: About,
  },
  {
    path: "logout",
    action: logoutUser,
  },
]);

const RouteAllPage: FC = () => {
  return <RouterProvider router={router} />;
};

async function logoutUser() {
  await fakeAuthProvider.signout();
  return redirect("/");
}

async function loginLoader() {
  if (fakeAuthProvider.isAuthenticated) {
    return redirect("/");
  }
  return null;
}
async function loginAction({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string | null;

  // Validate our form inputs and return validation errors via useActionData()
  if (!username) {
    return {
      error: "You must provide a username to log in",
    };
  }

  // Sign in and redirect to the proper destination if successful.
  try {
    await fakeAuthProvider.signin(username);
  } catch (error) {
    // Unused as of now but this is how you would handle invalid
    // username/password combinations - just like validating the inputs
    // above
    return {
      error: "Invalid login attempt",
    };
  }

  const redirectTo = formData.get("redirectTo") as string | null;
  return redirect(redirectTo || "/");
}

function protectedLoader({ request }: LoaderFunctionArgs) {
  // If the user is not logged in and tries to access `/protected`, we redirect
  // them to `/login` with a `from` parameter that allows login to redirect back
  // to this page upon successful authentication
  if (!fakeAuthProvider.isAuthenticated) {
    const params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  return null;
}

function ProtectedPage() {
  return <h3>Protected</h3>;
}

export default RouteAllPage;
