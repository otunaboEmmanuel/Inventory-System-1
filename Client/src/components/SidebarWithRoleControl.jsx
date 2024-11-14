import React from 'react';
import { useAuth } from './Auth'; // Import the useAuth hook
import SalesSidebar from './sidebars/SalesSidebar'; // Import your SalesSidebar component
import ManagerSidebar from './sidebars/ManagerSidebar'; // Import your ManagerSidebar component
import DefaultSidebar from './Sidebar'; // Import the default Sidebar

const SidebarWithRoleControl = () => {
    const { user } = useAuth();

    const renderSidebarBasedOnRole = () => {
        switch(user.role) {
            case 'Admin':
                return <DefaultSidebar />;
            case 'Sales Staff':
                return <SalesSidebar />;
            case 'Manager':
                return <ManagerSidebar />;
            default:
                return <DefaultSidebar />;
        }
    };

    return renderSidebarBasedOnRole();
};

export default SidebarWithRoleControl;