import { createBrowserRouter, RouterProvider } from 'react-router';
import Dashboard from './components/Dashboard';
import DayView from './components/DayView';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/day/:date',
    element: <DayView />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}