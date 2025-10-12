import { useContext } from 'react';

import AdminAuthContext from 'src/contexts/admin-auth-context';

/**
 * Custom hook to access admin authentication context
 */
const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export default useAdminAuth