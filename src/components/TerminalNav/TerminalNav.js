import React from 'react';

const TerminalNav = () => {
    const [activeItem, setActiveItem] = React.useState('whoami');
    const [hoveredItem, setHoveredItem] = React.useState(null);

    const navStyle = {
        fontFamily: '"Monaco", "JetBrains Mono", monospace',
        fontSize: '1rem',
        lineHeight: 2
    };
    
    const navItems = [
        { id: 'whoami', label: '$ whoami' },
        { id: 'projects', label: '$ ls projects' },
        { id: 'community', label: '$ cd community' },
        { id: 'experiences', label: '$ cat experiences' },
        { id: 'hidden', label: '$ find . -hidden' }
    ];

    const getLinkStyle = (item) => ({
        color: activeItem === item.id ? '#4ECDC4' : '#333',
        textDecoration: 'none',
        display: 'block',
        padding: '0.5rem 0',
        borderRadius: '4px',
        transition: 'all 0.3s ease',
        background: (activeItem === item.id || hoveredItem === item.id) ? 'rgba(78, 205, 196, 0.1)' : 'transparent',
        paddingLeft: hoveredItem === item.id ? '1rem' : '0'
    });

    return (
        <nav style={navStyle}>
            {navItems.map(item => (
                <a
                    key={item.id}
                    href={`#${item.id}`}
                    style={getLinkStyle(item)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={(e) => {
                        e.preventDefault();
                        setActiveItem(item.id);
                    }}
                >
                    {item.label}
                </a>
            ))}
        </nav>
    );
};

export default TerminalNav;
