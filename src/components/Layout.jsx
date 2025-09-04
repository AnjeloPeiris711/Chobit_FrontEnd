// src/components/Layout.jsx
import { useContext, useState } from 'react';
import { Menu, X, MessageSquare, Settings, User, Mail, FileText, Bell, Search, LogOut } from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import chobitLogo from '../assets/logo/chobit.png';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigationItems = [
    { icon: MessageSquare, label: 'CV Chat', path: '/dashboard' },
    { icon: Mail, label: 'Email Notifications', path: '/email' },
  ];

  // Function to get current page info based on pathname
  const getCurrentPageInfo = () => {
    const pathname = location.pathname;

    // Check for exact matches first
    const exactMatch = navigationItems.find(item => item.path === pathname);
    if (exactMatch) {
      return { icon: exactMatch.icon, label: exactMatch.label };
    }

    // Check for sub-routes (routes that start with a main route path)
    const parentMatch = navigationItems.find(item =>
      pathname.startsWith(item.path + '/') ||
      (item.path !== '/dashboard' && pathname.startsWith(item.path))
    );

    if (parentMatch) {
      return { icon: parentMatch.icon, label: parentMatch.label };
    }

    // Default to CV Chat
    return { icon: MessageSquare, label: 'CV Chat' };
  };

  const currentPageInfo = getCurrentPageInfo();

  const handleImageClick = () => {
    navigate('/dashboard');
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    logout();
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

 

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleLogoutCancel}
                className="py-2 px-4 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-purple-600 to-purple-700 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500">
          <div
            onClick={handleImageClick}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <img
                src={chobitLogo}
                alt="Chobit Logo"
                className="w-8 h-8"
              />
            </div>
            <span className="text-white font-bold text-xl">Chobit</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Current Page Indicator */}
        <div className="p-4 bg-purple-800/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <currentPageInfo.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-medium">
              {currentPageInfo.label}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-4 px-4 space-y-2">
          {navigationItems.map((item, index) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <button
                key={index}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-purple-800 text-white shadow-lg'
                    : 'text-purple-100 hover:bg-purple-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="mt-auto p-4 border-t border-purple-500">  
          <button
            onClick={handleLogoutClick}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 rounded-lg text-white flex items-center justify-center space-x-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600">
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <span>CV Assistant</span>
                <span>•</span>
                <span>Email Manager</span>
                <span>•</span>
                <span>Resume Parser</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-purple-600 transition-colors" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </div>

              {/* User Status */}
              <div className="relative">
                <div
                  className="relative rounded-full cursor-pointer"
                >
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-600 p-1 border-2 border-gray-300 rounded-full" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;