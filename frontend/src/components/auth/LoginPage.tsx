import React, { useState } from "react";
import { Leaf, LogIn, Loader2 } from "lucide-react";
import { login, signup } from "../../lib/api";

interface LoginPageProps {
  onSuccess: (email: string) => void;
}

export default function LoginPage({ onSuccess }: LoginPageProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("asha@ecosphere.test");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      onSuccess(email);
    } catch (err: any) {
      setError(
        mode === "login"
          ? "Invalid email or password."
          : "Signup failed — that email may already exist."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141216] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-green-env/10 border border-green-env/20 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-green-env" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">EcoSphere</h1>
            <p className="text-[10px] tracking-widest text-on-surface-variant font-semibold">
              ESG MANAGEMENT
            </p>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
          <h2 className="text-xl font-bold text-white mb-1">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-sm text-on-surface-variant mb-6">
            {mode === "login"
              ? "Sign in to your ESG workspace."
              : "Register a new ESG workspace account."}
          </p>

          {mode === "signup" && (
            <div className="mb-4">
              <label className="text-xs font-semibold text-on-surface-variant">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-env/50"
                placeholder="Your name"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="text-xs font-semibold text-on-surface-variant">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-env/50"
              placeholder="you@company.com"
            />
          </div>

          <div className="mb-6">
            <label className="text-xs font-semibold text-on-surface-variant">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-env/50"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="mb-4 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-env text-black font-bold rounded-xl py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>

          <div className="mt-5 text-center text-xs text-on-surface-variant">
            {mode === "login" ? (
              <>
                No account?{" "}
                <button onClick={() => { setMode("signup"); setError(null); }} className="text-green-env font-semibold">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => { setMode("login"); setError(null); }} className="text-green-env font-semibold">
                  Sign in
                </button>
              </>
            )}
          </div>

          {mode === "login" && (
            <div className="mt-4 text-center text-[10px] text-on-surface-variant/60">
              Demo: asha@ecosphere.test / password123
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
