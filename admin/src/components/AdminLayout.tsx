import React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout: React.FC = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main-content">
        <ReactRouterDom.Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;