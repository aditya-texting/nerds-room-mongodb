"use client";

import React, { useState } from "react";
import RegistrationModal from "./RegistrationModal";
import { TeamRegistrationModal } from "./TeamRegistrationModal";
import { useAuthContext } from "@/src/providers/auth-provider";
import { useMyTeam } from "../hooks/useEvents";
import { useRouter, usePathname } from "next/navigation";
import { Check, Users } from "lucide-react";

interface EventRegistrationButtonProps {
  event: any;
  isRegistered?: boolean;
}

export default function EventRegistrationButton({ event, isRegistered = false }: EventRegistrationButtonProps) {
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [registered, setRegistered] = useState(isRegistered);
  const { user } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  const type = event.participationType as "INDIVIDUAL" | "TEAM" | "BOTH";
  const isTeamEvent = type === "TEAM" || type === "BOTH";

  // Only fetch team status if this is a team event and user is logged in
  const { data: myTeamData } = useMyTeam(event.id, !!(isTeamEvent && user));
  const isInTeam = !!myTeamData?.team;

  React.useEffect(() => {
    setRegistered(isRegistered);
  }, [isRegistered]);

  const requireAuth = (callback: () => void) => {
    if (!user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    } else {
      callback();
    }
  };

  const handleIndividualClick = () => {
    if (registered) return;
    requireAuth(() => setIsRegModalOpen(true));
  };

  const handleTeamClick = () => {
    requireAuth(() => setIsTeamModalOpen(true));
  };

  const handleRegistrationSuccess = () => {
    setRegistered(true);
    setIsRegModalOpen(false);
    router.refresh();
  };

  return (
    <>
      <div className="flex flex-col gap-3 w-full">

        {/* Main Registration Button — ALWAYS shown */}
        <button
          onClick={handleIndividualClick}
          disabled={registered}
          className={`w-full font-black py-3.5 px-8 rounded-xl transition-all shadow-lg text-lg flex items-center justify-center gap-2 ${
            registered
              ? "bg-[#84CC16]/10 text-[#84CC16] border border-[#84CC16]/20 cursor-default"
              : "bg-[#00308F] text-white hover:bg-[#002266] hover:shadow-xl hover:-translate-y-0.5"
          }`}
        >
          {registered ? (
            <>
              <Check className="w-5 h-5" /> Registered
            </>
          ) : (
            "Register Now"
          )}
        </button>

        {/* Team button — shown ONLY after registration */}
        {isTeamEvent && registered && (
          <button
            onClick={handleTeamClick}
            className={`w-full font-black py-3.5 px-8 rounded-xl transition-all text-lg flex items-center justify-center gap-2 ${
              isInTeam
                ? "bg-[#84CC16]/10 text-[#84CC16] border-2 border-[#84CC16]/50 hover:bg-[#84CC16]/20"
                : "border-2 border-[#84CC16] text-[#84CC16] hover:bg-[#84CC16]/10 hover:shadow-lg hover:-translate-y-0.5"
            }`}
          >
            <Users className="w-5 h-5" />
            {isInTeam ? "View Team Details" : "Create / Join Team"}
          </button>
        )}

      </div>

      {/* Individual Registration Modal */}
      {(type === "INDIVIDUAL" || type === "BOTH") && (
        <RegistrationModal
          isOpen={isRegModalOpen}
          onClose={() => setIsRegModalOpen(false)}
          event={event}
          onSuccess={handleRegistrationSuccess}
        />
      )}

      {/* Team Registration Modal */}
      {isTeamEvent && (
        <TeamRegistrationModal
          isOpen={isTeamModalOpen}
          onClose={() => setIsTeamModalOpen(false)}
          event={event}
          onSuccess={() => setIsTeamModalOpen(false)}
        />
      )}
    </>
  );
}
