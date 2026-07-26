import { useState, useEffect } from 'react';
import SidebarContent from './SidebarContent';

const Sidebar = () => {
    const [shouldCollapseSidebar, setShouldCollapseSidebar] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setShouldCollapseSidebar(window.innerWidth <= 900);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);


    const sidebarStyle = {
        width: '20%',
        padding: '5rem 2rem 2rem 6rem',
        display: shouldCollapseSidebar ? 'none' : 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        background: 'transparent',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
        transition: 'all 0.3s ease',
    };

    return (
        <div className="sidebar" style={sidebarStyle}>
            <SidebarContent compact={false} />
        </div>
    );
};

export default Sidebar;