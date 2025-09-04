import React from 'react';

const RoleBasedProtected = ({ userRole, allowedRoles, children }) => {
  if (!allowedRoles.includes(userRole)) {
    return ; // Or redirect to a login page
  }

  return <>{children}</>; // Render child components if the user role is allowed
};

export default RoleBasedProtected;
