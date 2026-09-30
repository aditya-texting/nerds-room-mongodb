'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { X, Users, Copy, CheckCircle2, ShieldAlert, Loader2, LogIn, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMyTeam, useCreateTeam, useJoinTeam, useSubmitTeamApplication } from '../hooks/useEvents';
import toast from 'react-hot-toast';
import { useAuthContext } from '@/src/providers/auth-provider';
import { useRouter } from 'next/navigation';

interface TeamRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  onSuccess?: () => void;
}

export function TeamRegistrationModal({ isOpen, onClose, event, onSuccess }: TeamRegistrationModalProps) {
  const [mounted, setMounted] = React.useState(false);
  const { user } = useAuthContext();
  const router = useRouter();
  
  const { data: myTeamData, isLoading: isLoadingTeam, refetch: refetchTeam, isFetching } = useMyTeam(event.id, isOpen, isOpen ? 5000 : false);
  const { mutateAsync: createTeam, isPending: isCreating } = useCreateTeam(event.id);
  const { mutateAsync: joinTeam, isPending: isJoining } = useJoinTeam(event.id);
  const { mutateAsync: submitApplication, isPending: isSubmitting } = useSubmitTeamApplication(event.id);

  const [mode, setMode] = React.useState<'SELECT' | 'CREATE' | 'JOIN'>('SELECT');
  const [teamName, setTeamName] = React.useState('');
  const [joinCode, setJoinCode] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return toast.error("Team name is required");
    try {
      await createTeam(teamName);
      toast.success("Team created successfully!");
      setTeamName('');
      await refetchTeam();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create team");
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return toast.error("Join code is required");
    try {
      await joinTeam(joinCode);
      toast.success("Joined team successfully!");
      setJoinCode('');
      await refetchTeam();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to join team");
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Join code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitApplication = async () => {
    try {
      await submitApplication();
      toast.success("Team Registered Successfully! 🎉");
      await refetchTeam();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to submit application");
    }
  };

  if (!mounted) return null;

  const renderContent = () => {
    if (!user) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-3">Login Required</h3>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            You need to be logged in to create or join a team for this event.
          </p>
          <button
            onClick={() => {
              onClose();
              router.push('/login');
            }}
            className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition"
          >
            Go to Login
          </button>
        </div>
      );
    }

    if (isLoadingTeam) {
      return (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
    }

    const team = myTeamData?.team;
    const role = myTeamData?.role;

    if (team) {
      const isComplete = team.teamMembers.length >= team.minMembers;
      const isFull = team.teamMembers.length >= team.maxMembers;
      const fillPct = Math.min((team.teamMembers.length / team.maxMembers) * 100, 100);
      
      return (
        <div className="space-y-6">
          {/* Header with live indicator */}
          <div className="text-center relative">
            <h3 className="text-2xl font-bold text-foreground">{team.name}</h3>
            <p className="text-muted-foreground text-sm mt-1">Your Team Dashboard</p>
            <div className="absolute top-0 right-0 flex items-center gap-1.5 text-xs text-green-500 font-medium">
              {isFetching
                ? <RefreshCcw className="w-3 h-3 animate-spin" />
                : <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
              }
              Live
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-muted-foreground">Team Progress</span>
              <span className={isComplete ? 'text-green-500' : 'text-muted-foreground'}>
                {team.teamMembers.length} / {team.maxMembers} members {isComplete ? '✓ Ready!' : `(min ${team.minMembers})`}
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-primary'}`}
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>
          
          <div className="bg-secondary/30 rounded-xl border border-border/50 p-4 flex flex-col items-center justify-center">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Team Join Code</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black tracking-widest text-primary font-mono">{team.joinCode}</span>
              <button 
                onClick={() => handleCopyCode(team.joinCode)}
                className="p-2 hover:bg-secondary rounded-lg transition text-muted-foreground hover:text-foreground"
              >
                {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            {!isFull && (
              <p className="text-xs text-muted-foreground mt-2">Share this code with your friends to let them join!</p>
            )}
            {isFull && (
              <p className="text-xs text-yellow-500 font-semibold mt-2">Team is full! No more members can join.</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-end mb-3">
              <h4 className="font-semibold text-foreground">Team Members</h4>
              <span className="text-xs font-medium text-muted-foreground">
                {team.teamMembers.length} / {team.maxMembers} (Min: {team.minMembers})
              </span>
            </div>
            <div className="space-y-2">
              {team.teamMembers.map((member: any) => (
                <div key={member.userId} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border/50 min-w-0">
                  {/* Avatar */}
                  <div className="w-9 h-9 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    {member.user.name.charAt(0).toUpperCase()}
                  </div>
                  {/* Name + Badge + Email */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-foreground truncate">{member.user.name}</p>
                      {member.role === 'LEADER' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded-full uppercase shrink-0">
                          Leader
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            {(() => {
              const regStatus = myTeamData?.registration?.status;
              const isSubmitted = regStatus === "SUBMITTED" || regStatus === "CONFIRMED";

              if (isSubmitted) {
                return (
                  <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                    <p className="font-bold text-green-500 text-lg">Team Registered Successfully!</p>
                    <p className="text-xs text-muted-foreground">Your team application has been submitted.</p>
                  </div>
                );
              }

              if (role === 'LEADER') {
                return (
                  <button
                    onClick={handleSubmitApplication}
                    disabled={!isComplete || isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting
                      ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                      : !isComplete
                        ? <><ShieldAlert className="w-5 h-5" /> Need at least {team.minMembers} members to submit</>
                        : "Submit Team Application"
                    }
                  </button>
                );
              }

              return (
                <div className="p-4 rounded-xl bg-secondary/50 text-center">
                  <p className="text-sm text-muted-foreground">Only the Team Leader can submit the final application.</p>
                </div>
              );
            })()}
          </div>
        </div>
      );
    }

    if (mode === 'SELECT') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <button
            onClick={() => setMode('CREATE')}
            className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-border/50 bg-secondary/20 hover:bg-secondary hover:border-primary/50 transition group"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-foreground text-lg">Create a Team</h3>
              <p className="text-xs text-muted-foreground mt-1">Start a new team and invite others</p>
            </div>
          </button>
          
          <button
            onClick={() => setMode('JOIN')}
            className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-border/50 bg-secondary/20 hover:bg-secondary hover:border-primary/50 transition group"
          >
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <LogIn className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-foreground text-lg">Join a Team</h3>
              <p className="text-xs text-muted-foreground mt-1">Have an invite code? Join here</p>
            </div>
          </button>
        </div>
      );
    }

    if (mode === 'CREATE') {
      return (
        <form onSubmit={handleCreateTeam} className="space-y-6 pt-4">
          <button type="button" onClick={() => setMode('SELECT')} className="text-sm text-primary font-medium hover:underline mb-2 block">
            &larr; Back
          </button>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Team Name</label>
            <input
              type="text"
              required
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              placeholder="e.g. The Innovators"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Team'}
          </button>
        </form>
      );
    }

    if (mode === 'JOIN') {
      return (
        <form onSubmit={handleJoinTeam} className="space-y-6 pt-4">
          <button type="button" onClick={() => setMode('SELECT')} className="text-sm text-primary font-medium hover:underline mb-2 block">
            &larr; Back
          </button>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Invite Code</label>
            <input
              type="text"
              required
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              placeholder="e.g. A1B2C3D4"
              className="w-full px-4 py-3 font-mono text-lg tracking-widest bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isJoining}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {isJoining ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Join Team'}
          </button>
        </form>
      );
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Modal — full width slide-up on mobile, centered card on sm+ */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full sm:max-w-2xl bg-background border-t sm:border border-border/60 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-border/50 flex items-center justify-between bg-secondary/30 shrink-0">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">Team Registration</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary/80 rounded-full transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto">
              {renderContent()}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
