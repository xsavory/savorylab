import { useContext } from 'react';

import ParticipantAuthContext from 'src/contexts/participant-auth-context';

/**
 * Custom hook to access participant authentication context
 */
const useParticipantAuth = () => {
  const context = useContext(ParticipantAuthContext);
  if (context === undefined) {
    throw new Error('useParticipantAuth must be used within an ParticipantAuthProvider');
  }
  return context;
};

export default useParticipantAuth