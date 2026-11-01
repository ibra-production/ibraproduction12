import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut as firebaseSignOut, 
  User, 
  IdTokenResult 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { Booking, TeamMember, ContactMessage, SiteSettings } from '../types';

// Admin Constants
export const ADMIN_UID = 'v6CIpSmqqEWOFMvGu9ZxIapl4Ln1';
export const ADMIN_EMAIL = 'bahibarhouma56@gmail.com';

interface AppContextType {
  currentUser: User | null;
  isAdmin: boolean;
  claims: Record<string, any> | null;
  authLoading: boolean;
  bookings: Booking[];
  teamMembers: TeamMember[];
  unreadMessagesCount: number;
  siteSettings: SiteSettings | null;
  refreshAdminStatus: () => Promise<boolean>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [claims, setClaims] = useState<Record<string, any> | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  
  // Real-time collections for Admin Dashboard
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  const auth = getAuth();
  const db = getFirestore();

  // Evaluate if a given user is verified Admin
  const checkAdminStatus = async (user: User | null, forceRefresh = false): Promise<boolean> => {
    if (!user) {
      setIsAdmin(false);
      setClaims(null);
      return false;
    }

    try {
      // Force refresh ensures newly assigned claims take effect immediately without 1h delay
      const tokenResult: IdTokenResult = await user.getIdTokenResult(forceRefresh);
      setClaims(tokenResult.claims);

      const hasAdminClaim = tokenResult.claims.admin === true || tokenResult.claims.role === 'superadmin';
      const isKnownAdminUid = user.uid === ADMIN_UID;
      const isKnownAdminEmail = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      const adminVerified = hasAdminClaim || isKnownAdminUid || isKnownAdminEmail;
      setIsAdmin(adminVerified);
      return adminVerified;
    } catch (err) {
      console.error('[AppContext] Error checking admin token claims:', err);
      // Fallback check on UID
      const fallbackAdmin = user.uid === ADMIN_UID;
      setIsAdmin(fallbackAdmin);
      return fallbackAdmin;
    }
  };

  const refreshAdminStatus = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    return await checkAdminStatus(auth.currentUser, true);
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setIsAdmin(false);
      setClaims(null);
    } catch (err) {
      console.error('[AppContext] Error during logout:', err);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setAuthLoading(true);
      setCurrentUser(user);
      if (user) {
        await checkAdminStatus(user, true);
      } else {
        setIsAdmin(false);
        setClaims(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, [auth]);

  // Real-time synchronization when Admin is logged in
  useEffect(() => {
    if (!isAdmin) {
      setBookings([]);
      setTeamMembers([]);
      setUnreadMessagesCount(0);
      return;
    }

    // 1. Sync Bookings
    const qBookings = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(100));
    const unsubBookings = onSnapshot(qBookings, (snap) => {
      const items: Booking[] = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(items);
    }, (err) => console.warn('[AppContext] Bookings listener warn:', err.message));

    // 2. Sync Team
    const qTeam = collection(db, 'team');
    const unsubTeam = onSnapshot(qTeam, (snap) => {
      const items: TeamMember[] = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember));
      setTeamMembers(items);
    }, (err) => console.warn('[AppContext] Team listener warn:', err.message));

    // 3. Sync Messages unread count
    const qMessages = collection(db, 'messages');
    const unsubMessages = onSnapshot(qMessages, (snap) => {
      const unread = snap.docs.filter(d => !d.data().isRead).length;
      setUnreadMessagesCount(unread);
    }, (err) => console.warn('[AppContext] Messages listener warn:', err.message));

    return () => {
      unsubBookings();
      unsubTeam();
      unsubMessages();
    };
  }, [isAdmin, db]);

  return (
    <AppContext.Provider value={{
      currentUser,
      isAdmin,
      claims,
      authLoading,
      bookings,
      teamMembers,
      unreadMessagesCount,
      siteSettings,
      refreshAdminStatus,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
