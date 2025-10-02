import { Link, useLocation } from "react-router-dom";
import NavLogo from "../assets/logo.png";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      label: "Traffic Map",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      ),
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    // {
    //   path: "/dashboard",
    //   label: "Dashboard",
    //   icon: (
    //     <svg
    //       className="w-5 h-5"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
    //       />
    //     </svg>
    //   ),
    // },
    // {
    //   path: "/reports",
    //   label: "Reports",
    //   icon: (
    //     <svg
    //       className="w-5 h-5"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    //       />
    //     </svg>
    //   ),
    // },
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 select-none">
            <img
              src={NavLogo}
              draggable="false"
              alt="Logo"
              className="w-16 h-16"
            />
            <div>
              <h1 className="text-xl font-bold text-blue-500">
                Smart City: Rush Hour Prediction
              </h1>
              <p className="text-sm text-gray-600 hidden lg:block">
                Based on Bangalore Traffic
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-10">
            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Stats Bar */}
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">8</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Areas Monitored
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3 border-t border-gray-100">
          <div className="flex items-center justify-around pt-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="mb-1">{item.icon}</div>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
