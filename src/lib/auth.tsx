import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface UserProfile {
  email: string;
  displayName: string;
  farmName: string;
  avatarInitials: string;
  notifications: boolean;
  language: string;
}

interface StoredAccount extends UserProfile {
  password: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  changePassword: (current: string, next: string) => Promise<void>;
}

const ACCOUNTS_KEY = "cropeye.accounts";
const SESSION_KEY = "cropeye.session";

const AuthContext = createContext<AuthContextValue | null>(null);

function readAccounts(): Record<string, StoredAccount> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeAccounts(accounts: Record<string, StoredAccount>) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function toProfile(account: StoredAccount): UserProfile {
  const { password: _pw, ...profile } = account;
  return profile;
}

function initialsFor(name: string, email: string) {
  const source = name.trim() || email;
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  const letters = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  return letters.toUpperCase() || "U";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const sessionEmail = localStorage.getItem(SESSION_KEY);
      if (sessionEmail) {
        const accounts = readAccounts();
        const account = accounts[sessionEmail];
        if (account) setUser(toProfile(account));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const login: AuthContextValue["login"] = async (email, password) => {
    const accounts = readAccounts();
    const account = accounts[email.toLowerCase()];
    if (!account) throw new Error("No account found with that email.");
    if (account.password !== password) throw new Error("Incorrect password.");
    localStorage.setItem(SESSION_KEY, email.toLowerCase());
    setUser(toProfile(account));
  };

  const signup: AuthContextValue["signup"] = async (email, password, displayName) => {
    const key = email.toLowerCase();
    const accounts = readAccounts();
    if (accounts[key]) throw new Error("An account with that email already exists.");
    const account: StoredAccount = {
      email: key,
      password,
      displayName: displayName.trim(),
      farmName: "",
      avatarInitials: initialsFor(displayName, key),
      notifications: true,
      language: "en",
    };
    accounts[key] = account;
    writeAccounts(accounts);
    localStorage.setItem(SESSION_KEY, key);
    setUser(toProfile(account));
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const updateProfile: AuthContextValue["updateProfile"] = (patch) => {
    if (!user) return;
    const accounts = readAccounts();
    const account = accounts[user.email];
    if (!account) return;
    const updated: StoredAccount = {
      ...account,
      ...patch,
      avatarInitials: initialsFor(patch.displayName ?? account.displayName, account.email),
    };
    accounts[user.email] = updated;
    writeAccounts(accounts);
    setUser(toProfile(updated));
  };

  const changePassword: AuthContextValue["changePassword"] = async (current, next) => {
    if (!user) throw new Error("Not signed in.");
    const accounts = readAccounts();
    const account = accounts[user.email];
    if (!account) throw new Error("Account missing.");
    if (account.password !== current) throw new Error("Current password is incorrect.");
    if (next.length < 6) throw new Error("New password must be at least 6 characters.");
    accounts[user.email] = { ...account, password: next };
    writeAccounts(accounts);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, updateProfile, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
