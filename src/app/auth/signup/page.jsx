"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert } from "@heroui/react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShoppingCart,
  FaStore,
  FaCheck,
  FaArrowRight,
} from "react-icons/fa";

import { signUp } from "@/lib/auth-client";
import {
  ALLOWED_SIGNUP_ROLES,
  DEFAULT_USER_ROLE,
  isAllowedSignupRole,
} from "@/lib/user-roles";

const RULES = [
  { id: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { id: "upper", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { id: "lower", label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { id: "number", label: "One number", test: (p) => /\d/.test(p) },
];

const initialForm = { name: "", email: "", password: "", role: DEFAULT_USER_ROLE };

const ROLE_META = {
  buyer: { icon: FaShoppingCart, label: "Buyer", sub: "Browse & buy" },
  seller: { icon: FaStore, label: "Seller", sub: "List & sell" },
};

function PasswordHints({ password }) {
  if (!password) return null;
  return (
    <div className="mt-2 grid grid-cols-2 gap-1">
      {RULES.map((rule) => {
        const ok = rule.test(password);
        return (
          <p key={rule.id} className={`flex items-center gap-1 text-xs transition-colors duration-300 ${ok ? "text-emerald-400" : "text-slate-500"}`}>
            {ok ? <FaCheck className="shrink-0 text-emerald-400" /> : <span className="h-[6px] w-[6px] rounded-full bg-slate-600 shrink-0" />}
            {rule.label}
          </p>
        );
      })}
    </div>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => 
    setForm((cur) => ({ ...cur, [e.target.name]: e.target.value }));

  const validateForm = () => {
    if (!form.name.trim()) return "Please enter your full name";
    if (!form.email.trim()) return "Please enter your email address";
    if (!isAllowedSignupRole(form.role)) return "Please select a valid role";
    const failed = RULES.find((r) => !r.test(form.password));
    return failed ? "Password needs: " + failed.label.toLowerCase() : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setSuccess("");
    
    const err = validateForm();
    if (err) { setError(err); return; }
    
    setLoading(true);
    try {
      const res = await signUp.email({ 
        name: form.name.trim(), 
        email: form.email.trim(), 
        password: form.password, 
        role: form.role 
      });
      
      if (res?.error) { 
        setError(res.error.message || "Unable to create account"); 
        return; 
      }
      
      setSuccess("Account created! Redirecting...");
      setTimeout(() => router.push("/"), 1500);
    } catch (err) { 
      setError(err?.message || "Something went wrong"); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Ambient Background Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/5 blur-[80px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-purple-600/5 blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden bg-slate-950 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-sm text-slate-400 mt-1.5">Start buying or selling in minutes</p>
        </div>

        {/* Role Selector */}
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-3">I want to</p>
          <div className="grid grid-cols-2 gap-3">
            {ALLOWED_SIGNUP_ROLES.map((role) => {
              const meta = ROLE_META[role];
              const Icon = meta.icon;
              const active = form.role === role;
              return (
                <button key={role} type="button" onClick={() => setForm((cur) => ({ ...cur, role }))}
                  className={`relative flex flex-col items-center gap-2 rounded-2xl p-4 transition-all duration-300 border-2 ${active ? (role === 'buyer' ? "bg-gradient-to-br from-blue-600 to-indigo-600 border-transparent shadow-lg shadow-blue-600/20" : "bg-gradient-to-br from-violet-600 to-purple-600 border-transparent shadow-lg shadow-purple-600/20") : "bg-white/5 border-white/10 hover:border-white/20"}`}
                >
                  <div className={`p-2 rounded-xl ${active ? "bg-white/20" : "bg-white/5"}`}>
                    <Icon className={`text-lg ${active ? "text-white" : "text-slate-500"}`} />
                  </div>
                  <p className={`text-sm font-semibold ${active ? "text-white" : "text-slate-300"}`}>{meta.label}</p>
                  {active && <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-white/25 flex items-center justify-center"><FaCheck className="text-white text-[9px]" /></div>}
                </button>
              );
            })}
          </div>
        </div>

        {error && <Alert className="mb-4" color="danger" title={error} />}
        {success && <Alert className="mb-4" color="success" title={success} />}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-3.5 top-3.5 text-slate-600" />
              <input name="name" value={form.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
            </div>
          </div>
          
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-3.5 text-slate-600" />
              <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-3.5 text-slate-600" />
              <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-slate-600 hover:text-white">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <PasswordHints password={form.password} />
          </div>

          <button type="submit" disabled={loading} className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70">
            {loading ? "Creating..." : "Create Account"}
            {!loading && <FaArrowRight className="text-xs" />}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-600">
          Already have an account? <Link href="/auth/signin" className="text-blue-400 hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}