import { createBrowserRouter, RouterProvider } from 'react-router';
import Dashboard from './components/Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}