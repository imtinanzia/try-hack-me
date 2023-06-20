import { Suspense, lazy } from 'react';
import type { RouteObject } from 'react-router';
import { DashboardLayout } from './layout';
import { GuestGuard, LoadingScreen, AuthGuard } from './components';

const Loadable = (Component: any) => (props: JSX.IntrinsicAttributes) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
// Authentication pages

const Login = Loadable(lazy(() => import('./pages/authentication/login')));

const Register = Loadable(
  lazy(() => import('./pages/authentication/register'))
);

// Dashboard pages

const Kanban = Loadable(lazy(() => import('./pages/dashboard/kanban')));

const routes: RouteObject[] = [
  {
    path: 'authentication',
    children: [
      {
        path: 'login',
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        ),
      },

      {
        path: 'register',
        element: (
          <GuestGuard>
            <Register />
          </GuestGuard>
        ),
      },
    ],
  },

  {
    path: '*',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Kanban />,
      },
    ],
  },
];

export default routes;
