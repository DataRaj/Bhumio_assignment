import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import Page404 from './pages/Page404';
import EditPage from './pages/EditPage';
import SearchPage from './pages/SearchPage';
import GoogleDrivePage from './pages/GoogleDrivePage';
import AddPatientsPage from './pages/AddPatientsPage';
import EditPatientForm from './sections/Form/EditPatientForm';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/addPatients" />, index: true },
        { path: 'addPatients', element: <AddPatientsPage /> },
        { path: 'editPatients', element: <EditPage /> },
        { path: 'editPatient_form', element: <EditPatientForm /> },
        { path: 'search', element: <SearchPage /> },
        { path: 'select_file', element: <GoogleDrivePage /> },
      ],
    },

    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/addPatients" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },


    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
