// app/society/[slug]/members/MemberManagerClient.tsx

"use client";

import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { addCoreTeamMember, deleteCoreTeamMember, transferPresidency } from "@/actions/memberActions";
import { ImagePlus, X, Crown, AlertTriangle } from "lucide-react";

type Member = {
  id: string;
  name: string;
  designation: string;
  imageUrl: string | null;
};

export default function MemberManagerClient({ clubId, initialMembers }: { clubId: string, initialMembers: Member[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Add Member State
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Appoint President Modal State
  const [appointingMember, setAppointingMember] = useState<Member | null>(null);
  const [newPresidentEmail, setNewPresidentEmail] = useState("");
  const [myFutureAction, setMyFutureAction] = useState<"DEMOTE" | "DELETE">("DEMOTE");
  const [myNewDesignation, setMyNewDesignation] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  // --- Add/Delete Member Logic ---
  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function handleRemoveImage(e: React.MouseEvent) {
    e.preventDefault();
    setImagePreview(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const handleAddMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAdding(true);
    const formData = new FormData(e.currentTarget);
    formData.append("clubId", clubId);

    try {
      const result = await addCoreTeamMember(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Member added successfully!");
        setName("");
        setDesignation("");
        setImagePreview(null);
        setFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        router.refresh(); 
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    setDeletingId(memberId);
    try {
      const result = await deleteCoreTeamMember(memberId);
      if (result.error) toast.error(result.error);
      else {
        toast.success("Member removed!");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to delete member.");
    } finally {
      setDeletingId(null);
    }
  };

  // --- Transfer Presidency Logic ---
  const handleTransferPresidency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointingMember) return;
    
    if (myFutureAction === "DEMOTE" && !myNewDesignation) {
      toast.error("Please enter your new designation.");
      return;
    }

    if (!confirm("WARNING: This action will permanently transfer your administrative rights. Continue?")) return;

    setIsTransferring(true);
    try {
      const result = await transferPresidency(
        clubId,
        appointingMember.id,
        newPresidentEmail,
        myFutureAction,
        myNewDesignation
      );

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Presidency transferred successfully!");
        setAppointingMember(null);
        
        // Hard redirect to dashboard (or sign-in if deleted) to refresh auth state completely
        window.location.href = myFutureAction === "DELETE" ? "/sign-in" : "/dashboard";
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: Add New Member Form */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm lg:sticky lg:top-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add New Member</h2>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" placeholder="e.g. Jane Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Designation / Role</label>
              <input name="designation" type="text" required value={designation} onChange={(e) => setDesignation(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" placeholder="e.g. Vice President" />
            </div>

            {/* IMAGE UPLOAD SECTION */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">Member Photo (Optional)</label>
              <div className="mt-1 flex justify-center px-4 sm:px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-gray-50 dark:bg-gray-800/50 relative">
                {imagePreview ? (
                  <div className="flex flex-col items-center z-10">
                    <div className="relative inline-block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Preview" className="h-24 w-24 object-cover rounded-full border border-gray-200 dark:border-gray-600 shadow-sm" />
                      <button type="button" onClick={handleRemoveImage} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors cursor-pointer" title="Remove image">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="mt-3 text-xs font-medium text-gray-900 dark:text-gray-200 truncate w-32 text-center">{fileName}</p>
                  </div>
                ) : (
                  <label htmlFor="member-image-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                    <ImagePlus className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">Click to upload photo</span>
                  </label>
                )}
                <input id="member-image-upload" name="image" type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
              </div>
            </div>

            <button type="submit" disabled={isAdding} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors mt-2">
              {isAdding ? "Adding..." : "+ Add to Core Team"}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Current Members Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Current Core Team ({initialMembers.length})</h2>
          
          {initialMembers.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No members added manually yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {initialMembers.map((member) => (
                <div key={member.id} className="bg-white dark:bg-[#121827] border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between gap-3 shadow-sm group hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {member.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={member.imageUrl} alt={member.name} className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-gray-100 dark:ring-gray-800" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">{member.name}</h3>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wider truncate">{member.designation}</p>
                    </div>
                  </div>

                  {/* Actions for each member - CHANGED: Always visible */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setAppointingMember(member)}
                      title="Appoint as President"
                      className="p-2 text-gray-400 hover:bg-amber-50 hover:text-amber-600 dark:text-gray-500 dark:hover:bg-amber-900/20 dark:hover:text-amber-500 rounded-lg transition-colors"
                    >
                      <Crown className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      disabled={deletingId === member.id}
                      title="Remove Member"
                      className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:text-gray-500 dark:hover:bg-red-900/20 dark:hover:text-red-500 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deletingId === member.id ? (
                        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL: APPOINT PRESIDENT --- */}
      {appointingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center gap-3 mb-4 text-amber-600 dark:text-amber-500 border-b border-gray-100 dark:border-gray-800 pb-4">
              <Crown className="w-6 h-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Appoint President
              </h3>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              You are about to transfer full administrative rights to <strong>{appointingMember.name}</strong>. 
              They must already have an account on this platform.
            </p>

            <form onSubmit={handleTransferPresidency} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  1. New President's Email Address
                </label>
                <p className="text-xs text-gray-500 mb-2">The email {appointingMember.name} used to register their account.</p>
                <input
                  type="email"
                  required
                  value={newPresidentEmail}
                  onChange={(e) => setNewPresidentEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                  placeholder={`${appointingMember.name.split(' ')[0].toLowerCase()}@college.edu`}
                />
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/50 rounded-lg p-4">
                <label className="block text-sm font-semibold text-amber-900 dark:text-amber-500 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  2. What happens to your account?
                </label>
                
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="futureAction" 
                      value="DEMOTE" 
                      checked={myFutureAction === "DEMOTE"}
                      onChange={() => setMyFutureAction("DEMOTE")}
                      className="mt-1 text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <span className="block text-sm font-medium text-gray-900 dark:text-white">Step Down to Core Member</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">You will lose admin rights but stay logged in.</span>
                    </div>
                  </label>

                  {myFutureAction === "DEMOTE" && (
                    <div className="pl-7 mt-2">
                      <input
                        type="text"
                        value={myNewDesignation}
                        onChange={(e) => setMyNewDesignation(e.target.value)}
                        placeholder="Your new designation (e.g. Past President)"
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-900/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 dark:text-white"
                      />
                    </div>
                  )}

                  <label className="flex items-start gap-3 cursor-pointer pt-2 border-t border-amber-200/50 dark:border-amber-900/30">
                    <input 
                      type="radio" 
                      name="futureAction" 
                      value="DELETE" 
                      checked={myFutureAction === "DELETE"}
                      onChange={() => setMyFutureAction("DELETE")}
                      className="mt-1 text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <span className="block text-sm font-medium text-red-600 dark:text-red-400">Delete My Account</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">You will be logged out and your account will be erased.</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAppointingMember(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isTransferring}
                  className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                >
                  {isTransferring ? "Processing..." : "Transfer Ownership"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}