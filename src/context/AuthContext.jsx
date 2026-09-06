import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../services/supabase';

export const AuthContext = createContext();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const toAppUser = (user) => user ? { id: user.id, email: user.email, ...user.user_metadata } : null;

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(toAppUser(data.session?.user));
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(toAppUser(nextSession?.user));
      setLoading(false);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setUser((current) => ({ ...current, ...data }));
      });
  }, [session?.user?.id]);

  const loginUser = (nextSession) => {
    const resolvedSession = nextSession?.session || nextSession;
    setSession(resolvedSession);
    setUser(toAppUser(resolvedSession?.user));
  };
  const logoutUser = async () => supabase.auth.signOut();
  const updateUser = (userData) => setUser((current) => ({ ...current, ...userData }));

  const value = useMemo(() => ({
    user,
    session,
    loading,
    isAuthenticated: Boolean(session),
    loginUser,
    logoutUser,
    updateUser,
    getToken: () => session?.access_token || null,
    getRefreshToken: () => session?.refresh_token || null,
  }), [user, session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
