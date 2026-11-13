import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Player, Match, MerchItem, MediaItem, InstagramPost, StatMetric, RecruitmentApplication, ContactMessage } from '../types';
import { INITIAL_STATS, INITIAL_ROSTER, INITIAL_MATCHES, INITIAL_MERCH, INITIAL_MEDIA, INITIAL_INSTAGRAM_POSTS } from '../data/initialData';
import {
  sendContactMessage,
  submitRecruitmentApplication,
  fetchContactMessages,
  markMessageAsRead,
  deleteContactMessage,
  type SendContactPayload,
  type SendContactResponse,
} from '../services/api';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface EsportsContextType {
  stats: StatMetric[];
  roster: Player[];
  matches: Match[];
  merch: MerchItem[];
  media: MediaItem[];
  instagramPosts: InstagramPost[];
  applications: RecruitmentApplication[];
  messages: ContactMessage[];
  selectedPlayer: Player | null;
  setSelectedPlayer: (player: Player | null) => void;
  selectedMerch: MerchItem | null;
  setSelectedMerch: (merch: MerchItem | null) => void;
  selectedMedia: MediaItem | null;
  setSelectedMedia: (media: MediaItem | null) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
  contactPrefill: { category?: string; subject?: string };
  openContactModal: (category?: string, subject?: string) => void;
  legalModalType: 'privacy' | 'terms' | 'rules' | 'brand' | null;
  setLegalModalType: (type: 'privacy' | 'terms' | 'rules' | 'brand' | null) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  
  // Messaging Operations
  sendEmailMessage: (payload: SendContactPayload) => Promise<SendContactResponse>;
  markMessageRead: (id: string, replied?: boolean) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  
  // CMS Operations
  updateStats: (newStats: StatMetric[]) => void;
  addPlayer: (player: Omit<Player, 'id'>) => void;
  updatePlayer: (id: string, player: Partial<Player>) => void;
  deletePlayer: (id: string) => void;
  addMatch: (match: Omit<Match, 'id'>) => void;
  updateMatch: (id: string, match: Partial<Match>) => void;
  deleteMatch: (id: string) => void;
  submitApplication: (app: Omit<RecruitmentApplication, 'id' | 'timestamp' | 'status'>) => Promise<string>;
  updateApplicationStatus: (id: string, status: RecruitmentApplication['status']) => void;
  resetAllData: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonString: string) => boolean;
}

const EsportsContext = createContext<EsportsContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'ge_esports_data_v2_';

export const EsportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<StatMetric[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}stats`);
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [roster, setRoster] = useState<Player[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}roster`);
    return saved ? JSON.parse(saved) : INITIAL_ROSTER;
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}matches`);
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });

  const [merch, setMerch] = useState<MerchItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}merch`);
    return saved ? JSON.parse(saved) : INITIAL_MERCH;
  });

  const [media, setMedia] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}media`);
    return saved ? JSON.parse(saved) : INITIAL_MEDIA;
  });

  const [instagramPosts] = useState<InstagramPost[]>(INITIAL_INSTAGRAM_POSTS);

  const [applications, setApplications] = useState<RecruitmentApplication[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}applications`);
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}messages`);
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedMerch, setSelectedMerch] = useState<MerchItem | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactPrefill, setContactPrefill] = useState<{ category?: string; subject?: string }>({});
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'rules' | 'brand' | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Fetch initial messages from backend API if available
  useEffect(() => {
    fetchContactMessages().then((apiMessages) => {
      if (apiMessages && apiMessages.length > 0) {
        setMessages(apiMessages);
      }
    });
  }, []);

  // LocalStorage sync effects
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}stats`, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}roster`, JSON.stringify(roster));
  }, [roster]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}matches`, JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}merch`, JSON.stringify(merch));
  }, [merch]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}media`, JSON.stringify(media));
  }, [media]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}applications`, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}messages`, JSON.stringify(messages));
  }, [messages]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openContactModal = (category?: string, subject?: string) => {
    setContactPrefill({ category, subject });
    setIsContactModalOpen(true);
  };

  // Send contact message via backend API and update state
  const sendEmailMessage = async (payload: SendContactPayload): Promise<SendContactResponse> => {
    try {
      const res = await sendContactMessage(payload);
      if (res.success) {
        const newMessage: ContactMessage = {
          id: res.ticketId,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          subject: payload.subject,
          category: payload.category,
          message: payload.message,
          timestamp: res.timestamp || new Date().toISOString(),
          isRead: false,
          replied: false,
        };
        setMessages((prev) => [newMessage, ...prev]);

        if (res.emailDispatched) {
          showToast(`Transmission delivered! Ticket #${res.ticketId}. Our desk will respond to ${payload.email}.`, 'success');
        } else {
          showToast(`Inquiry recorded (#${res.ticketId}), but email notification could not be delivered to staff inbox.`, 'info');
        }
      } else {
        showToast(res.error || 'Could not send message. Please try again.', 'error');
      }
      return res;
    } catch (err: any) {
      showToast(err?.message || 'Could not send message. Please check connection.', 'error');
      return {
        success: false,
        message: err?.message || 'Failed to dispatch email message',
        ticketId: '',
        timestamp: new Date().toISOString(),
        emailDispatched: false,
        error: err?.message,
      };
    }
  };

  const markMessageRead = async (id: string, replied?: boolean) => {
    await markMessageAsRead(id, replied);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true, ...(replied !== undefined ? { replied } : {}) } : m))
    );
  };

  const deleteMessage = async (id: string) => {
    await deleteContactMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    showToast('Message removed from archive', 'info');
  };

  const updateStats = (newStats: StatMetric[]) => {
    setStats(newStats);
    showToast('Organization statistics updated successfully', 'success');
  };

  const addPlayer = (playerData: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      ...playerData,
      id: `p-${Date.now()}`,
    };
    setRoster((prev) => [newPlayer, ...prev]);
    showToast(`Player ${newPlayer.ign} added to roster`, 'success');
  };

  const updatePlayer = (id: string, updatedFields: Partial<Player>) => {
    setRoster((prev) =>
      prev.map((player) => (player.id === id ? { ...player, ...updatedFields } : player))
    );
    showToast('Player profile updated successfully', 'success');
  };

  const deletePlayer = (id: string) => {
    setRoster((prev) => prev.filter((p) => p.id !== id));
    showToast('Player removed from roster', 'info');
  };

  const addMatch = (matchData: Omit<Match, 'id'>) => {
    const newMatch: Match = {
      ...matchData,
      id: `m-${Date.now()}`,
    };
    setMatches((prev) => [newMatch, ...prev]);
    showToast('New tournament match registered', 'success');
  };

  const updateMatch = (id: string, updatedFields: Partial<Match>) => {
    setMatches((prev) =>
      prev.map((match) => (match.id === id ? { ...match, ...updatedFields } : match))
    );
    showToast('Match record updated', 'success');
  };

  const deleteMatch = (id: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== id));
    showToast('Match record deleted', 'info');
  };

  const submitApplication = async (appData: Omit<RecruitmentApplication, 'id' | 'timestamp' | 'status'>): Promise<string> => {
    try {
      const res = await submitRecruitmentApplication({
        ...appData,
        preferredRole: appData.preferredRole,
      });
      const appId = res.referenceId;
      const newApp: RecruitmentApplication = res.application || {
        ...appData,
        id: appId,
        timestamp: new Date().toISOString(),
        status: 'PENDING REVIEW',
      };
      setApplications((prev) => [newApp, ...prev]);
      if (res.emailDispatched) {
        showToast(`Application ${appId} submitted successfully! Confirmation sent to ${appData.contactEmail}.`, 'success');
      } else {
        showToast(`Application ${appId} logged. Email notification could not be dispatched.`, 'info');
      }
      return appId;
    } catch (err: any) {
      showToast(err?.message || 'Could not submit application. Please retry.', 'error');
      throw err;
    }
  };

  const updateApplicationStatus = (id: string, status: RecruitmentApplication['status']) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
    showToast(`Application status updated to ${status}`, 'info');
  };

  const resetAllData = () => {
    setStats(INITIAL_STATS);
    setRoster(INITIAL_ROSTER);
    setMatches(INITIAL_MATCHES);
    setMerch(INITIAL_MERCH);
    setMedia(INITIAL_MEDIA);
    setApplications([]);
    setMessages([]);
    localStorage.clear();
    showToast('All data reset to official defaults', 'info');
  };

  const exportDataJson = () => {
    const data = {
      stats,
      roster,
      matches,
      merch,
      media,
      applications,
      messages,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJson = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.roster && data.matches) {
        if (data.stats) setStats(data.stats);
        if (data.roster) setRoster(data.roster);
        if (data.matches) setMatches(data.matches);
        if (data.merch) setMerch(data.merch);
        if (data.media) setMedia(data.media);
        if (data.applications) setApplications(data.applications);
        if (data.messages) setMessages(data.messages);
        showToast('Data imported successfully!', 'success');
        return true;
      }
      throw new Error('Invalid structure');
    } catch {
      showToast('Failed to import data: invalid JSON structure', 'error');
      return false;
    }
  };

  return (
    <EsportsContext.Provider
      value={{
        stats,
        roster,
        matches,
        merch,
        media,
        instagramPosts,
        applications,
        messages,
        selectedPlayer,
        setSelectedPlayer,
        selectedMerch,
        setSelectedMerch,
        selectedMedia,
        setSelectedMedia,
        isAdminOpen,
        setIsAdminOpen,
        isContactModalOpen,
        setIsContactModalOpen,
        contactPrefill,
        openContactModal,
        legalModalType,
        setLegalModalType,
        toasts,
        showToast,
        removeToast,
        sendEmailMessage,
        markMessageRead,
        deleteMessage,
        updateStats,
        addPlayer,
        updatePlayer,
        deletePlayer,
        addMatch,
        updateMatch,
        deleteMatch,
        submitApplication,
        updateApplicationStatus,
        resetAllData,
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </EsportsContext.Provider>
  );
};

export const useEsports = () => {
  const context = useContext(EsportsContext);
  if (!context) {
    throw new Error('useEsports must be used within an EsportsProvider');
  }
  return context;
};
