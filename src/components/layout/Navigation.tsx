import React from 'react';
    import { NavLink, useLocation } from 'react-router-dom';
    import { Home, MessageSquare } from 'lucide-react';
    import { cn } from '@/lib/utils';

    const Navigation = () => {
      const location = useLocation();

      const navItems = [
        {
          path: '/',
          label: 'Home',
          icon: Home,
        },
        {
          path: '/chat',
          label: 'Chat History',
          icon: MessageSquare,
        },
      ];

      return (
        <nav className="bg-gray-800 text-white p-4">
          <ul className="flex space-x-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 transition-colors',
                      isActive ? 'bg-gray-700' : ''
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      );
    };

    export default Navigation;
