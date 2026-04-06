import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar">
        <Outlet key={location.pathname} />
      </main>
    </div>
  );
};

export default AdminLayout;
