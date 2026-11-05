/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SUPER_ADMIN_PORTAL_PATH } from '../config/adminConfig';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  User,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Activity,
  Users,
  LogOut,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Laptop,
  Trash2,
  UserCheck,
  UserPlus,
  Sun,
  Moon,
  Database,
  ArrowRight
} from 'lucide-react';

export const SuperAdminPortal: React.FC = () => {
  const { navigateTo, theme, toggleTheme } = useApp();

  // Authentication State
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('canabis_hub_super_admin_token') || null;
    } catch {
      return null;
    }
  });

  const [superAdminUser, setSuperAdminUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Forgot Password / Recovery State
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<'request' | 'verify'>('request');
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  // Active Dashboard Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'credentials' | 'sessions' | 'history' | 'admins'>('overview');

  // Overview Data
  const [overviewData, setOverviewData] = useState<any>(null);
  const [sessionsData, setSessionsData] = useState<any[]>([]);
  const [loginHistoryData, setLoginHistoryData] = useState<any[]>([]);
  const [auditLogsData, setAuditLogsData] = useState<any[]>([]);
  const [adminsList, setAdminsList] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Credential Management Forms State
  // 1. Username
  const [newUsername, setNewUsername] = useState('');
  const [usernamePassword, setUsernamePassword] = useState('');
  const [showUsernamePassword, setShowUsernamePassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [usernameLoading, setUsernameLoading] = useState(false);

  // 2. Email Address
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [emailStep, setEmailStep] = useState<'request' | 'confirm'>('request');
  const [emailStatus, setEmailStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);

  // 3. Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Add Admin Modal
  const [isNewAdminModalOpen, setIsNewAdminModalOpen] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'admin',
  });
  const [newAdminStatus, setNewAdminStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Toast Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Check Current Super Admin Profile
  const fetchSuperAdminProfile = async (currentToken: string) => {
    try {
      const res = await fetch('/api/super-admin/me', {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSuperAdminUser(data.user);
        setNewUsername(data.user.username || '');
        setNewEmail(data.user.email || '');
        return true;
      } else {
        handleLogout();
        return false;
      }
    } catch {
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSuperAdminProfile(token);
    } else {
      setAuthLoading(false);
    }
  }, [token]);

  // Load Dashboard Data
  const loadDashboardData = async () => {
    if (!token) return;
    setIsRefreshing(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [ovRes, sessRes, histRes, audRes, admRes] = await Promise.all([
        fetch('/api/super-admin/overview', { headers }),
        fetch('/api/super-admin/sessions', { headers }),
        fetch('/api/super-admin/login-history', { headers }),
        fetch('/api/admin/audit-logs', { headers }),
        fetch('/api/super-admin/admins', { headers }),
      ]);

      if (ovRes.ok) setOverviewData(await ovRes.json());
      if (sessRes.ok) setSessionsData(await sessRes.json());
      if (histRes.ok) setLoginHistoryData(await histRes.json());
      if (audRes.ok) setAuditLogsData(await audRes.json());
      if (admRes.ok) setAdminsList(await admRes.json());
    } catch (err) {
      console.error('Error fetching Super Admin data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (superAdminUser && token) {
      loadDashboardData();
    }
  }, [superAdminUser, token, activeTab]);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSubmitting(true);

    try {
      const res = await fetch('/api/super-admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      setLoginSubmitting(false);

      if (res.ok && data.token) {
        localStorage.setItem('canabis_hub_super_admin_token', data.token);
        setToken(data.token);
        setSuperAdminUser(data.user);
        setNewUsername(data.user.username || '');
        setNewEmail(data.user.email || '');
        setLoginPassword('');
        showToast('Super Administrator authenticated successfully.');
      } else {
        setLoginError(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setLoginSubmitting(false);
      setLoginError('Security gateway connection error. Please try again.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem('canabis_hub_super_admin_token');
    setToken(null);
    setSuperAdminUser(null);
    setLoginIdentifier('');
    setLoginPassword('');
  };

  // Handle Forgot Password Request
  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(null);
    setForgotLoading(true);

    try {
      const res = await fetch('/api/super-admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: forgotIdentifier }),
      });
      const data = await res.json();
      setForgotLoading(false);

      if (res.ok) {
        setForgotStep('verify');
        if (data.verificationHint) {
          setForgotCode(data.verificationHint);
          setForgotMsg({
            type: 'success',
            text: `Identity verification code generated: ${data.verificationHint}. Please enter your new password below.`,
          });
        } else {
          setForgotMsg({
            type: 'success',
            text: data.message || 'Identity verification instructions dispatched.',
          });
        }
      } else {
        setForgotMsg({ type: 'error', text: data.error || 'Recovery request could not be processed.' });
      }
    } catch {
      setForgotLoading(false);
      setForgotMsg({ type: 'error', text: 'Connection failed.' });
    }
  };

  // Handle Password Reset
  const handleForgotReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(null);
    setForgotLoading(true);

    try {
      const res = await fetch('/api/super-admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: forgotIdentifier,
          verificationCode: forgotCode,
          newPassword: forgotNewPassword,
        }),
      });
      const data = await res.json();
      setForgotLoading(false);

      if (res.ok) {
        setForgotMsg({ type: 'success', text: data.message });
        setTimeout(() => {
          setIsForgotOpen(false);
          setForgotStep('request');
          setForgotIdentifier('');
          setForgotCode('');
          setForgotNewPassword('');
          setForgotMsg(null);
        }, 2000);
      } else {
        setForgotMsg({ type: 'error', text: data.error || 'Password reset failed.' });
      }
    } catch {
      setForgotLoading(false);
      setForgotMsg({ type: 'error', text: 'Password reset request failed.' });
    }
  };

  // Credential Action 1: Update Username
  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameStatus(null);
    setUsernameLoading(true);

    try {
      const res = await fetch('/api/super-admin/credentials/username', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newUsername,
          currentPassword: usernamePassword,
        }),
      });

      const data = await res.json();
      setUsernameLoading(false);

      if (res.ok) {
        setUsernameStatus({ type: 'success', text: data.message });
        setUsernamePassword('');
        setSuperAdminUser({ ...superAdminUser, username: data.username });
        showToast('Username updated successfully.');
        loadDashboardData();
      } else {
        setUsernameStatus({ type: 'error', text: data.error || 'Failed to update username' });
      }
    } catch {
      setUsernameLoading(false);
      setUsernameStatus({ type: 'error', text: 'Network connection failed.' });
    }
  };

  // Credential Action 2: Request Email Verification Code
  const handleRequestEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailStatus(null);
    setEmailLoading(true);

    try {
      const res = await fetch('/api/super-admin/credentials/email/request-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newEmail,
          currentPassword: emailPassword,
        }),
      });

      const data = await res.json();
      setEmailLoading(false);

      if (res.ok) {
        setEmailStep('confirm');
        if (data.verificationCode) {
          setEmailVerificationCode(data.verificationCode);
        }
        setEmailStatus({ type: 'success', text: data.message });
      } else {
        setEmailStatus({ type: 'error', text: data.error || 'Failed to request email verification' });
      }
    } catch {
      setEmailLoading(false);
      setEmailStatus({ type: 'error', text: 'Network connection error.' });
    }
  };

  // Credential Action 2b: Confirm Email Update
  const handleConfirmEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailStatus(null);
    setEmailLoading(true);

    try {
      const res = await fetch('/api/super-admin/credentials/email/confirm', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ verificationCode: emailVerificationCode }),
      });

      const data = await res.json();
      setEmailLoading(false);

      if (res.ok) {
        setEmailStatus({ type: 'success', text: data.message });
        setEmailStep('request');
        setEmailPassword('');
        setEmailVerificationCode('');
        setSuperAdminUser({ ...superAdminUser, email: data.email });
        showToast('Email address successfully verified and updated.');
        loadDashboardData();
      } else {
        setEmailStatus({ type: 'error', text: data.error || 'Failed to confirm email update' });
      }
    } catch {
      setEmailLoading(false);
      setEmailStatus({ type: 'error', text: 'Confirmation request failed.' });
    }
  };

  // Credential Action 3: Update Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await fetch('/api/super-admin/credentials/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      setPasswordLoading(false);

      if (res.ok) {
        setPasswordStatus({ type: 'success', text: data.message });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        showToast('Super Admin password successfully updated. Other sessions revoked.');
        loadDashboardData();
      } else {
        setPasswordStatus({ type: 'error', text: data.error || 'Failed to update password' });
      }
    } catch {
      setPasswordLoading(false);
      setPasswordStatus({ type: 'error', text: 'Password change error.' });
    }
  };

  // Terminate Single Session
  const handleTerminateSession = async (sessionToken: string) => {
    if (!confirm('Are you sure you want to terminate this active session?')) return;
    try {
      const res = await fetch(`/api/super-admin/sessions/${sessionToken}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast('Session terminated.');
        loadDashboardData();
      }
    } catch {}
  };

  // Terminate All Other Sessions
  const handleTerminateOtherSessions = async () => {
    if (!confirm('Terminate all active sessions on other devices and browsers?')) return;
    try {
      const res = await fetch('/api/super-admin/sessions/terminate-others', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast('All other sessions invalidated.');
        loadDashboardData();
      }
    } catch {}
  };

  // Create Sub-Admin
  const handleCreateSubAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewAdminStatus(null);
    try {
      const res = await fetch('/api/super-admin/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAdminForm),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('New administrator account created.');
        setIsNewAdminModalOpen(false);
        setNewAdminForm({ name: '', username: '', email: '', password: '', role: 'admin' });
        loadDashboardData();
      } else {
        setNewAdminStatus({ type: 'error', text: data.error || 'Failed to create admin' });
      }
    } catch {
      setNewAdminStatus({ type: 'error', text: 'Error connecting to server' });
    }
  };

  // Update Sub-Admin Status/Role
  const handleUpdateAdminStatus = async (adminId: string, role: string, status: string) => {
    try {
      const res = await fetch(`/api/super-admin/admins/${adminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role, status }),
      });
      if (res.ok) {
        showToast('Administrator updated.');
        loadDashboardData();
      }
    } catch {}
  };

  // Delete Sub-Admin
  const handleDeleteAdmin = async (adminId: string, email: string) => {
    if (!confirm(`Are you sure you want to revoke and delete administrator ${email}?`)) return;
    try {
      const res = await fetch(`/api/super-admin/admins/${adminId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast('Administrator revoked.');
        loadDashboardData();
      }
    } catch {}
  };

  // Password Checklist Helper
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#031712] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#07543F] border-t-[#F28A19] rounded-full animate-spin"></div>
          <span className="text-xs uppercase tracking-widest text-emerald-300/70 font-mono">Initializing Super Admin Gateway...</span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 1. UNAUTHENTICATED: PRIVATE LOGIN GATE
  // -------------------------------------------------------------
  if (!superAdminUser || !token) {
    return (
      <div className="min-h-screen bg-[#031712] text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-[#F28A19]/30">
        <div className="w-full max-w-md">
          {/* Security Badge Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#07543F] to-[#04261C] border border-[#0E4F3D] shadow-2xl flex items-center justify-center mx-auto text-[#F28A19]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[10px] font-mono tracking-wider uppercase text-emerald-400 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Isolated Security Portal · Private Route
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white font-['Outfit']">
                Super Administrator Gateway
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Central Authority Console · Canabis Hub Germany
              </p>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-[#05231A] border border-[#0B3B2E] rounded-3xl p-8 shadow-2xl relative backdrop-blur-md">
            {loginError && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/70 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Username or Email Address
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Enter Admin username or email"
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#02140F] border border-[#0B3B2E] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#F28A19] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotOpen(true);
                      setForgotMsg(null);
                    }}
                    className="text-[11px] text-[#F28A19] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#02140F] border border-[#0B3B2E] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#F28A19] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    title={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loginSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F28A19] to-[#d9750d] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {loginSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying Security Token...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Authenticate & Access Console</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-[#0B3B2E] text-center text-[10px] text-slate-500 font-mono space-y-1">
              <div>Protected by PBKDF2/SHA-512 & Automated Lockout</div>
              <div>Rate-Limited Endpoint: Max 5 consecutive attempts</div>
            </div>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {isForgotOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="bg-[#05231A] text-slate-100 rounded-3xl max-w-md w-full p-8 border border-[#0B3B2E] shadow-2xl relative">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#0B3B2E]">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-[#F28A19]" />
                  <h3 className="font-bold text-base text-white">Super Admin Recovery</h3>
                </div>
                <button
                  onClick={() => setIsForgotOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {forgotMsg && (
                <div className={`mb-4 p-3 rounded-xl text-xs flex items-start gap-2 ${
                  forgotMsg.type === 'success'
                    ? 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-200'
                    : 'bg-rose-950/80 border border-rose-700/60 text-rose-200'
                }`}>
                  {forgotMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />}
                  <span>{forgotMsg.text}</span>
                </div>
              )}

              {forgotStep === 'request' ? (
                <form onSubmit={handleForgotRequest} className="space-y-4 text-xs">
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Enter your registered Super Admin username or email address to generate an authorized identity verification code.
                  </p>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Super Admin Username or Email
                    </label>
                    <input
                      type="text"
                      required
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="e.g. Admin or sajidiqbal4891@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#02140F] border border-[#0B3B2E] text-white focus:outline-none focus:border-[#F28A19]"
                    />
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="flex-1 py-3 rounded-xl bg-[#F28A19] hover:bg-[#d9750d] text-white font-bold transition-all"
                    >
                      {forgotLoading ? 'Verifying Account...' : 'Generate Verification Code'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsForgotOpen(false)}
                      className="px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleForgotReset} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Identity Verification Code (6-Digit)
                    </label>
                    <input
                      type="text"
                      required
                      value={forgotCode}
                      onChange={(e) => setForgotCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#02140F] border border-[#0B3B2E] text-white font-mono text-center tracking-widest text-base focus:outline-none focus:border-[#F28A19]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1">
                      New Super Admin Password
                    </label>
                    <div className="relative">
                      <input
                        type={showForgotNewPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 pr-10 py-2.5 rounded-xl bg-[#02140F] border border-[#0B3B2E] text-white focus:outline-none focus:border-[#F28A19]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="flex-1 py-3 rounded-xl bg-[#07543F] hover:bg-[#064232] text-white font-bold transition-all shadow-md"
                    >
                      {forgotLoading ? 'Updating Password...' : 'Save New Password & Reset'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setForgotStep('request')}
                      className="px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white"
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. AUTHENTICATED: SUPER ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#031712] text-slate-100' : 'bg-[#F8FAF7] text-[#1A2E26]'} transition-colors`}>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#05231A]/95 backdrop-blur-md border-b border-[#E9EDE7] dark:border-[#0B3B2E] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Super Admin Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#07543F] to-[#04261C] border border-[#0E4F3D] shadow-md flex items-center justify-center text-[#F28A19]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight font-['Outfit'] text-[#07543F] dark:text-emerald-400">
                  CANABIS HUB
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 uppercase">
                  ROOT SUPER ADMIN
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-emerald-200/60 font-mono">
                {superAdminUser.username} · {superAdminUser.email}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-[#E9EDE7] dark:border-[#0B3B2E] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              onClick={loadDashboardData}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl border border-[#E9EDE7] dark:border-[#0B3B2E] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              title="Refresh Audit Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#F28A19]' : ''}`} />
            </button>

            <button
              onClick={() => navigateTo('home')}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E9EDE7] dark:border-[#0B3B2E] text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E9EDE7] dark:border-[#0B3B2E]/60 flex items-center gap-2 overflow-x-auto py-2 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'overview'
                ? 'bg-[#07543F] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Overview & Health</span>
          </button>

          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'credentials'
                ? 'bg-[#07543F] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Account Security & Credentials</span>
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'sessions'
                ? 'bg-[#07543F] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Active Sessions ({sessionsData.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'history'
                ? 'bg-[#07543F] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Login History & Audit Logs</span>
          </button>

          <button
            onClick={() => setActiveTab('admins')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'admins'
                ? 'bg-[#07543F] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Administrator Accounts (RBAC)</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#07543F] text-white shadow-2xl border border-emerald-400/30 animate-fadeIn text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#F28A19] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB 1: OVERVIEW & SYSTEM HEALTH */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#05231A] p-6 rounded-3xl border border-[#E9EDE7] dark:border-[#0B3B2E] shadow-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Root Role</span>
                  <ShieldCheck className="w-4 h-4 text-[#F28A19]" />
                </div>
                <div className="text-2xl font-extrabold text-[#07543F] dark:text-emerald-300 font-['Outfit']">
                  Super Admin
                </div>
                <div className="text-[11px] text-slate-500 font-mono">Privileged Tier · Level 0</div>
              </div>

              <div className="bg-white dark:bg-[#05231A] p-6 rounded-3xl border border-[#E9EDE7] dark:border-[#0B3B2E] shadow-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Sessions</span>
                  <Laptop className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-extrabold font-['Outfit']">
                  {overviewData?.activeSessions ?? sessionsData.length}
                </div>
                <div className="text-[11px] text-slate-500">Authenticated Devices</div>
              </div>

              <div className="bg-white dark:bg-[#05231A] p-6 rounded-3xl border border-[#E9EDE7] dark:border-[#0B3B2E] shadow-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Sub-Admins</span>
                  <Users className="w-4 h-4 text-cyan-500" />
                </div>
                <div className="text-2xl font-extrabold font-['Outfit']">
                  {overviewData?.totalAdmins ?? adminsList.length}
                </div>
                <div className="text-[11px] text-slate-500">Staff / Support Team</div>
              </div>

              <div className="bg-white dark:bg-[#05231A] p-6 rounded-3xl border border-[#E9EDE7] dark:border-[#0B3B2E] shadow-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Audit Events</span>
                  <Activity className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-extrabold font-['Outfit']">
                  {overviewData?.totalAuditLogs ?? auditLogsData.length}
                </div>
                <div className="text-[11px] text-slate-500">Logged Security Operations</div>
              </div>
            </div>

            {/* Architecture Card */}
            <div className="bg-white dark:bg-[#05231A] p-8 rounded-3xl border border-[#E9EDE7] dark:border-[#0B3B2E] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-['Outfit']">Core Security Infrastructure</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">German CanG Standards & Multi-Layer Authorization</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Operational & Hardened
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#02140F] border border-[#E9EDE7] dark:border-[#0B3B2E] space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Password Hashing</span>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-mono">PBKDF2 with SHA-512 & 16-byte random salt per user</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#02140F] border border-[#E9EDE7] dark:border-[#0B3B2E] space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Endpoint Route Protection</span>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-mono">Isolated path: {SUPER_ADMIN_PORTAL_PATH} (Hidden from public navigation)</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#02140F] border border-[#E9EDE7] dark:border-[#0B3B2E] space-y-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Brute-Force Shield</span>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-mono">Automated 15-min lockout after 5 consecutive failed attempts</p>
                </div>
              </div>
            </div>

            {/* Recent Login Summary */}
            <div className="bg-white dark:bg-[#05231A] rounded-3xl border border-[#E9EDE7] dark:border-[#0B3B2E] shadow-xs overflow-hidden">
              <div className="p-6 border-b border-[#E9EDE7] dark:border-[#0B3B2E] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base font-['Outfit']">Recent Access Activity</h3>
                  <p className="text-xs text-slate-500">Real-time authentication attempts to the Super Admin console</p>
                </div>
                <button
                  onClick={() => setActiveTab('history')}
                  className="text-xs font-bold text-[#07543F] dark:text-[#F28A19] hover:underline flex items-center gap-1"
                >
                  <span>View All Logs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-[#02140F] text-slate-500 dark:text-slate-400 font-bold border-b border-[#E9EDE7] dark:border-[#0B3B2E]">
                    <tr>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Identifier</th>
                      <th className="p-4">IP Address</th>
                      <th className="p-4">Device / Browser</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9EDE7] dark:divide-[#0B3B2E] font-mono text-[11px]">
                    {overviewData?.recentLogins?.map((log: any) => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                        <td className="p-4 text-slate-500 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                        <td className="p-4 font-bold text-[#07543F] dark:text-emerald-300">{log.identifier}</td>
                        <td className="p-4">{log.ip_address}</td>
                        <td className="p-4 font-sans text-xs truncate max-w-xs">{log.user_agent}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            log.status === 'success'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB 2: EDITABLE LOGIN CREDENTIALS (USER REQUEST #5) */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'credentials' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold font-['Outfit']">Super Admin Credential Management</h2>
              <p className="text-xs text-slate-500">
                Update your Super Admin username, verified email address, and authentication password. All credential changes invalidate other active sessions and are recorded in the immutable security audit log.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 1. UPDATE USERNAME CARD */}
              <div className="bg-white dark:bg-[#05231A] p-6 rounded-3xl border border-[#E9EDE7] dark:border-[#0B3B2E] shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#E9EDE7] dark:border-[#0B3B2E]">
                    <User className="w-5 h-5 text-[#F28A19]" />
                    <h3 className="font-bold text-sm">1. Update Username</h3>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Change the username used to sign in to the Super Admin portal. Must be unique across all system users.
                  </p>

                  {usernameStatus && (
                    <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                      usernameStatus.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                    }`}>
                      {usernameStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                      <span>{usernameStatus.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleUpdateUsername} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Current Username</label>
                      <input
                        type="text"
                        disabled
                        value={superAdminUser?.username || 'Admin'}
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-[#E9EDE7] dark:border-[#0B3B2E] text-slate-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">New Username *</label>
                      <input
                        type="text"
                        required
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="e.g. RootAdmin"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#02140F] border border-[#E9EDE7] dark:border-[#0B3B2E] text-sm focus:outline-none focus:border-[#07543F]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Confirm with Current Password *</label>
                      <div className="relative">
                        <input
                          type={showUsernamePassword ? 'text' : 'password'}
                          required
                          value={usernamePassword}
                          onChange={(e) => setUsernamePassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full px-3 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-[#02140F] border border-[#E9EDE7] dark:border-[#0B3B2E] text-sm focus:outline-none focus:border-[#07543F]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowUsernamePassword(!showUsernamePassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showUsernamePassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={usernameLoading || newUsername === superAdminUser?.username}
                      className="w-full py-2.5 rounded-xl bg-[#07543F] hover:bg-[#064232] text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
                    >
                      {usernameLoading ? 'Saving Changes...' : 'Save New Username'}
                    </button>
                  </form>
                </div>
              </div>

              {/* 2. UPDATE EMAIL CARD */}
              <div className="bg-white dark:bg-[#05231A] p-6 rounded-3xl border border-[#E9EDE7] dark:border-[#0B3B2E] shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#E9EDE7] dark:border-[#0B3B2E]">
                    <Mail className="w-5 h-5 text-[#F28A19]" />
                    <h3 className="font-bold text-sm">2. Update Email Address</h3>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Update your primary account email. Requires identity verification before confirmation.
                  </p>

                  {emailStatus && (
                    <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                      emailStatus.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                    }`}>
                      {emailStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                      <span>{emailStatus.text}</span>
                    </div>
                  )}

                  {emailStep === 'request' ? (
                    <form onSubmit={handleRequestEmailVerification} className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Current Email</label>
                        <input
                          type="text"
                          disabled
                          value={superAdminUser?.email || ''}
                          className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-[#E9EDE7] dark:border-[#0B3B2E] text-slate-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">New Email Address *</label>
                        <input
                          type="email"
                          required
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="e.g. newadmin@domain.com"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#02140F] border border-[#E9EDE7] dark:border-[#0B3B2E] text-sm focus:outline-none focus:border-[#07543F]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Current Password *</label>
                        <div className="relative">
                          <input
                            type={showEmailPassword ? 'text' : 'password'}
                            required
                            value={emailPassword}
                            onChange={(e) => setEmailPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full px-3 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-[#02140F] border border-[#E9EDE7] dark:border-[#0B3B2E] text-sm focus:outline-none focus:border-[#07543F]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowEmailPassword(!showEmailPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                          >
                            {showEmailPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={emailLoading || newEmail === superAdminUser?.email}
                        className="w-full py-2.5 rounded-xl bg-[#07543F] hover:bg-[#064232] text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
                      >
                        {emailLoading ? 'Requesting Code...' : 'Request Verification Code'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleConfirmEmailUpdate} className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Target Email</label>
                        <input
                          type="text"
                          disabled
                          value={newEmail}
                          className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-[#E9EDE7] dark:border-[#0B3B2E] text-slate-600 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Verification Code (6-Digit) *</label>
                        <input
                          type="text"
                          required
                          value={emailVerificationCode}
                          onChange={(e) => setEmailVerificationCode(e.target.value)}
                          placeholder="e.g. 123456"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#02140F] border border-[#E9EDE7] dark:border-[#0B3B2E] text-center font-mono text-base font-bold focus:outline-none focus:border-[#07543F]"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={emailLoading}
                          className="flex-1 py-2.5 rounded-xl bg-[#07543F] hover:bg-[#064232] text-white font-bold text-xs shadow-sm transition-all"
                        >
                          {emailLoading ? 'Confirming...' : 'Confirm & Apply Email'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEmailStep('request')}
                          className="px-3 py-2.5 rounded-xl border border-[#E9EDE7] dark:border-[#0B3B2E] text-slate-500 hover:text-slate-800 dark:hover:text-white"
                        >
                          Back
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* 3. UPDATE PASSWORD CARD */}
              <div className="bg-white dark:bg-[#05231A] p-6 rounded-3xl border border-[#E9EDE7] dark:border-[#0B3B2E] shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#E9EDE7] dark:border-[#0B3B2E]">
                  <KeyRound className="w-5 h-5 text-[#F28A19]" />
                  <h3 className="font-bold text-sm">3. Change Super Admin Password</h3>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Enforces NIST complexity. Hashes via PBKDF2/SHA-512 with cryptographically secure salt.
                </p>

                {passwordStatus && (
                  <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                    passwordStatus.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                  }`}>
                    {passwordStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                    <span>{passwordStatus.text}</span>
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Current Password *</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-[#02140F] border border-[#E9EDE7] dark:border-[#0B3B2E] text-sm focus:outline-none focus:border-[#07543F]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">New Strong Password *</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-[#02140F] border border-[#E9EDE7] dark:border-[#0B3B2E] text-sm focus:outline-none focus:border-[#07543F]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Confirm New Password *</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-[#02140F] border border-[#E9EDE7] dark:border-[#0B3B2E] text-sm focus:outline-none focus:border-[#07543F]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Strength Checklist */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 space-y-1 text-[11px] font-mono">
                    <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                      <span>{hasMinLength ? '✓' : '○'}</span>
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasUpperCase ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                      <span>{hasUpperCase ? '✓' : '○'}</span>
                      <span>At least 1 uppercase letter (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasLowerCase ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                      <span>{hasLowerCase ? '✓' : '○'}</span>
                      <span>At least 1 lowercase letter (a-z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                      <span>{hasNumber ? '✓' : '○'}</span>
                      <span>At least 1 number (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                      <span>{hasSpecial ? '✓' : '○'}</span>
                      <span>At least 1 special character (!@#$%...)</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading || !hasMinLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecial}
                    className="w-full py-2.5 rounded-xl bg-[#07543F] hover:bg-[#064232] text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
                  >
                    {passwordLoading ? 'Updating Password...' : 'Save New Password'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB 3: ACTIVE SESSIONS */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'sessions' && (
          <div className="bg-white dark:bg-[#05231A] rounded-3xl border border-[#E9EDE7] dark:border-[#0B3B2E] shadow-xs overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-[#E9EDE7] dark:border-[#0B3B2E] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-bold text-base font-['Outfit']">Active Super Admin Sessions</h3>
                <p className="text-xs text-slate-500">Every active token has access to this portal. Terminate unrecognized sessions immediately.</p>
              </div>
              <button
                onClick={handleTerminateOtherSessions}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                Terminate All Other Sessions
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#02140F] text-slate-500 dark:text-slate-400 font-bold border-b border-[#E9EDE7] dark:border-[#0B3B2E]">
                  <tr>
                    <th className="p-4">Device & Client</th>
                    <th className="p-4">IP Address</th>
                    <th className="p-4">Created</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9EDE7] dark:divide-[#0B3B2E]">
                  {sessionsData.map((s) => (
                    <tr key={s.token} className="hover:bg-slate-50 dark:hover:bg-white/5 font-mono text-[11px]">
                      <td className="p-4 font-sans text-xs">
                        <div className="flex items-center gap-2">
                          <Laptop className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="font-semibold truncate max-w-sm">{s.user_agent}</span>
                        </div>
                      </td>
                      <td className="p-4">{s.ip_address}</td>
                      <td className="p-4 text-slate-500 whitespace-nowrap">{new Date(s.created_at).toLocaleString()}</td>
                      <td className="p-4">
                        {s.isCurrent ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-500/30">
                            CURRENT SESSION
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300">
                            ACTIVE
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {!s.isCurrent && (
                          <button
                            onClick={() => handleTerminateSession(s.token)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="Revoke Session"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB 4: LOGIN HISTORY & AUDIT LOGS */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'history' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Login History */}
            <div className="bg-white dark:bg-[#05231A] rounded-3xl border border-[#E9EDE7] dark:border-[#0B3B2E] shadow-xs overflow-hidden">
              <div className="p-6 border-b border-[#E9EDE7] dark:border-[#0B3B2E]">
                <h3 className="font-bold text-base font-['Outfit']">Detailed Login History</h3>
                <p className="text-xs text-slate-500">Every authentication attempt recorded with client IP, user identifier, and outcome status.</p>
              </div>

              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-slate-50 dark:bg-[#02140F] text-slate-500 dark:text-slate-400 font-bold border-b border-[#E9EDE7] dark:border-[#0B3B2E]">
                    <tr>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Attempted Identifier</th>
                      <th className="p-4">IP Address</th>
                      <th className="p-4">User Agent</th>
                      <th className="p-4">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9EDE7] dark:divide-[#0B3B2E] font-mono text-[11px]">
                    {loginHistoryData.map((lh) => (
                      <tr key={lh.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                        <td className="p-4 whitespace-nowrap text-slate-500">{new Date(lh.created_at).toLocaleString()}</td>
                        <td className="p-4 font-bold text-[#07543F] dark:text-emerald-300">{lh.identifier}</td>
                        <td className="p-4">{lh.ip_address}</td>
                        <td className="p-4 font-sans text-xs truncate max-w-sm">{lh.user_agent}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            lh.status === 'success'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}>
                            {lh.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Security Audit Logs */}
            <div className="bg-white dark:bg-[#05231A] rounded-3xl border border-[#E9EDE7] dark:border-[#0B3B2E] shadow-xs overflow-hidden">
              <div className="p-6 border-b border-[#E9EDE7] dark:border-[#0B3B2E]">
                <h3 className="font-bold text-base font-['Outfit']">System Security Audit Logs</h3>
                <p className="text-xs text-slate-500">Immutable record of sensitive credential updates, session revocations, and administrative modifications.</p>
              </div>

              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-slate-50 dark:bg-[#02140F] text-slate-500 dark:text-slate-400 font-bold border-b border-[#E9EDE7] dark:border-[#0B3B2E]">
                    <tr>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Actor</th>
                      <th className="p-4">Action</th>
                      <th className="p-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9EDE7] dark:divide-[#0B3B2E] font-mono text-[11px]">
                    {auditLogsData.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                        <td className="p-4 whitespace-nowrap text-slate-500">{new Date(log.created_at).toLocaleString()}</td>
                        <td className="p-4 font-bold text-[#07543F] dark:text-emerald-300">{log.user_name}</td>
                        <td className="p-4 font-bold text-[#F28A19]">{log.action}</td>
                        <td className="p-4 font-sans text-xs">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* TAB 5: ADMINISTRATOR ACCOUNTS (RBAC) */}
        {/* ------------------------------------------------------- */}
        {activeTab === 'admins' && (
          <div className="bg-white dark:bg-[#05231A] rounded-3xl border border-[#E9EDE7] dark:border-[#0B3B2E] shadow-xs overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-[#E9EDE7] dark:border-[#0B3B2E] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-bold text-base font-['Outfit']">Administrator Roles & Access Control</h3>
                <p className="text-xs text-slate-500">
                  Manage subordinate administrator tiers. Note: Regular administrators cannot view or modify the Super Administrator account.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsNewAdminModalOpen(true);
                  setNewAdminStatus(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#07543F] hover:bg-[#064232] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Sub-Administrator</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#02140F] text-slate-500 dark:text-slate-400 font-bold border-b border-[#E9EDE7] dark:border-[#0B3B2E]">
                  <tr>
                    <th className="p-4">Administrator</th>
                    <th className="p-4">Username</th>
                    <th className="p-4">Role Tier</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4">Created</th>
                    <th className="p-4 text-right">Protection Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9EDE7] dark:divide-[#0B3B2E]">
                  {adminsList.map((adm) => {
                    const isSelf = adm.role === 'super_admin';
                    return (
                      <tr key={adm.id} className="hover:bg-slate-50 dark:hover:bg-white/5 font-mono text-[11px]">
                        <td className="p-4 font-sans text-xs">
                          <div className="font-bold text-[#07543F] dark:text-emerald-300">{adm.name}</div>
                          <div className="text-slate-500 text-[11px]">{adm.email}</div>
                        </td>
                        <td className="p-4 font-bold">{adm.username || '—'}</td>
                        <td className="p-4 font-sans">
                          {isSelf ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 uppercase border border-rose-500/30">
                              SUPER ADMIN (ROOT)
                            </span>
                          ) : (
                            <select
                              value={adm.role}
                              onChange={(e) => handleUpdateAdminStatus(adm.id, e.target.value, adm.status)}
                              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-[#E9EDE7] dark:border-[#0B3B2E] text-xs font-semibold"
                            >
                              <option value="admin">Administrator</option>
                              <option value="content_manager">Content Manager</option>
                              <option value="support_agent">Support Agent</option>
                            </select>
                          )}
                        </td>
                        <td className="p-4 font-sans">
                          {isSelf ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                              ACTIVE (PERMANENT)
                            </span>
                          ) : (
                            <select
                              value={adm.status}
                              onChange={(e) => handleUpdateAdminStatus(adm.id, adm.role, e.target.value)}
                              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-[#E9EDE7] dark:border-[#0B3B2E] text-xs font-semibold"
                            >
                              <option value="active">Active</option>
                              <option value="suspended">Suspended</option>
                            </select>
                          )}
                        </td>
                        <td className="p-4 text-slate-500 whitespace-nowrap">{new Date(adm.created_at).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                          {isSelf ? (
                            <span className="text-[10px] text-slate-400 font-mono italic">
                              Immutable Master Account
                            </span>
                          ) : (
                            <button
                              onClick={() => handleDeleteAdmin(adm.id, adm.email)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                              title="Delete Sub-Admin"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Create Sub-Admin */}
        {isNewAdminModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-[#05231A] text-[#1A2E26] dark:text-slate-100 rounded-3xl max-w-md w-full p-8 border border-[#E9EDE7] dark:border-[#0B3B2E] shadow-2xl relative">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#E9EDE7] dark:border-[#0B3B2E]">
                <h3 className="font-bold text-base">Create Sub-Administrator</h3>
                <button onClick={() => setIsNewAdminModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              {newAdminStatus && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{newAdminStatus.text}</span>
                </div>
              )}

              <form onSubmit={handleCreateSubAdmin} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newAdminForm.name}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                    placeholder="e.g. Klaus Hoffmann"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#02140F] border border-[#E9EDE7] dark:border-[#0B3B2E]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Username (Optional)</label>
                  <input
                    type="text"
                    value={newAdminForm.username}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, username: e.target.value })}
                    placeholder="e.g. klaus_admin"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#02140F] border border-[#E9EDE7] dark:border-[#0B3B2E]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newAdminForm.email}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                    placeholder="e.g. staff@domain.de"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#02140F] border border-[#E9EDE7] dark:border-[#0B3B2E]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Initial Password *</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newAdminForm.password}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#02140F] border border-[#E9EDE7] dark:border-[#0B3B2E]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Role Permission Tier</label>
                  <select
                    value={newAdminForm.role}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#02140F] border border-[#E9EDE7] dark:border-[#0B3B2E]"
                  >
                    <option value="admin">Administrator (General Ops)</option>
                    <option value="content_manager">Content Manager (Products & Blog)</option>
                    <option value="support_agent">Support Agent (Orders & Help Desk)</option>
                  </select>
                </div>
                <div className="pt-3 flex gap-2">
                  <button type="submit" className="flex-1 py-3 bg-[#07543F] text-white font-bold rounded-xl shadow-sm">
                    Create Sub-Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNewAdminModalOpen(false)}
                    className="px-4 py-3 border border-[#E9EDE7] dark:border-[#0B3B2E] rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
