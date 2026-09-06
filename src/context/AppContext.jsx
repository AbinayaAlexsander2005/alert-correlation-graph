import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

const DEFAULT_SETTINGS = {
  correlationThreshold: 0.70,
  severityThreshold: 'LOW',
  timeWindowSeconds: 600,
  datasetVersion: 'v1.2-synthetic',
  prototypeVersion: '0.1.0-academic',
};

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [auditLog, setAuditLog] = useState([]);
  const [changes, setChanges] = useState(null); // lazy-loaded from data file

  const login = useCallback((username) => {
    setIsLoggedIn(true);
    setUser({ username, role: 'Security Analyst', since: new Date().toISOString() });
    addAuditEntry({ user: username, action: 'LOGIN', object: 'system', reason: 'Demo login', status: 'Success' });
  }, []);

  const logout = useCallback(() => {
    addAuditEntry({ user: user?.username, action: 'LOGOUT', object: 'system', reason: 'User logout', status: 'Success' });
    setIsLoggedIn(false);
    setUser(null);
  }, [user]);

  const addAuditEntry = useCallback((entry) => {
    const id = `AUD-DYN-${Date.now()}`;
    setAuditLog(prev => [{
      id,
      ts: new Date().toISOString(),
      ...entry,
    }, ...prev]);
  }, []);

  const updateSettings = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    addAuditEntry({
      user: 'analyst',
      action: 'SETTINGS_UPDATED',
      object: `settings.${key}`,
      reason: `Changed ${key} to ${value}`,
      status: 'Success',
    });
  }, [addAuditEntry]);

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      user,
      settings,
      auditLog,
      changes,
      setChanges,
      login,
      logout,
      addAuditEntry,
      updateSettings,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
