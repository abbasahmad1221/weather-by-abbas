"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setSaving(true);
    const res = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Could not change password.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("Password changed successfully.");
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-bold text-storm-900">Admin Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Change the password used to access the admin dashboard.</p>
      <form onSubmit={changePassword} className="mt-6 space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <Field label="Current password" value={currentPassword} onChange={setCurrentPassword} />
        <Field label="New password" value={newPassword} onChange={setNewPassword} />
        <Field label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} />
        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {message && <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">{message}</div>}
        <button type="submit" disabled={saving} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-storm-950 hover:bg-amber-400 disabled:opacity-60">
          {saving ? "Changing…" : "Change password"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <input type="password" required minLength={12} value={value} onChange={(e) => onChange(e.target.value)} className="input" />
    </label>
  );
}
