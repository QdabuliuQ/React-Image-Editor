import { lazy, ReactNode } from "react";

const Edit = lazy(() => import("@/pages/edit"));

interface Router {
  name?: string;
  path: string;
  children?: Array<Router>;
  element: ReactNode;
}

const router: Array<Router> = [
  {
    name: "edit",
    path: "/",
    element: <Edit />,
  },
];

export default router;
