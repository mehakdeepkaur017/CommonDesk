import React, { useState } from "react";
import { ArrowLeft, ArrowRight, X, Plus, Mail } from "lucide-react";
import { Input } from "../../../components/ui/forms/Input";
import { Button } from "../../../components/ui/Button";

interface Props {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export const InviteMembersStep = ({ onNext, onBack, onSkip }: Props) => {
  const [invites, setInvites] = useState([{ email: "", role: "member" }]);

  const addInvite = () => setInvites([...invites, { email: "", role: "member" }]);
  const removeInvite = (index: number) => setInvites(invites.filter((_, i) => i !== index));
  
  const updateInvite = (index: number, field: string, value: string) => {
    const newInvites = [...invites];
    newInvites[index] = { ...newInvites[index], [field]: value };
    setInvites(newInvites);
  };

  const handleNext = () => {
    // In a real app, dispatch invites here
    console.log("Inviting:", invites.filter(i => i.email));
    onNext();
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-heading mb-2 text-text-primary">Invite your team</h2>
        <p className="text-text-secondary">CommonDesk is better together. Invite your team now or do it later.</p>
      </div>

      <div className="space-y-4 mb-6">
        {invites.map((invite, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                placeholder="name@company.com"
                type="email"
                icon={<Mail className="w-4 h-4" />}
                value={invite.email}
                onChange={(e) => updateInvite(index, "email", e.target.value)}
                autoFocus={index === 0}
              />
            </div>
            <div className="w-32">
              <select
                className="flex h-11 w-full rounded-xl border border-surface-border bg-surface-hover px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-indigo/50 focus:border-brand-indigo"
                value={invite.role}
                onChange={(e) => updateInvite(index, "role", e.target.value)}
              >
                <option value="member" className="bg-surface">Member</option>
                <option value="admin" className="bg-surface">Admin</option>
              </select>
            </div>
            {invites.length > 1 && (
              <button
                onClick={() => removeInvite(index)}
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-surface-hover hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        
        <button
          onClick={addInvite}
          className="text-sm font-medium text-brand-indigo hover:text-brand-violet transition-colors flex items-center gap-1.5 mt-2"
        >
          <Plus className="w-4 h-4" /> Add another
        </button>
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-surface-border">
        <button
          onClick={onBack}
          className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onSkip}
            className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
          >
            Skip for now
          </button>
          <Button onClick={handleNext}>
            Send Invites <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
