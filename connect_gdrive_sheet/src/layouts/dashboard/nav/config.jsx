// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [

  {
    title: 'Add Patients',
    path: '/dashboard/addPatients',
    icon: icon('ic_user'),
  },
  {
    title: 'Edit patients',
    path: '/dashboard/editPatients',
    icon: icon('ic_user'),

  },
  {
    title: 'Search Patients',
    path: '/dashboard/search',
    icon: icon('ic_user'),

  },
  {
    title: 'Select File',
    path: '/dashboard/select_file',
    icon: icon('ic_user'),

  },

];

export default navConfig;
