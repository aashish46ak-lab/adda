import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

type Mode = "login" | "signup" | "verify" | "forgot" | "reset";

const AuthModal = () => {
  const { user, isAuthModalOpen, closeAuthModal, authNext, setGuest, refreshRoles } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [otpType, setOtpType] = useState<"signup" | "recovery">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [code, setCode] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const cleanEmail = email.trim().toLowerCase();

  useEffect(() => {
    if (user && isAuthModalOpen) closeAuthModal();
  }, [user, isAuthModalOpen, closeAuthModal]);

  const finish = async () => {
    closeAuthModal();
    const roles = await refreshRoles();
    const staff = ["super_admin", "admin", "manager", "staff"];
    const isStaff = roles.some((r) => staff.includes(r));
    if (authNext) {
      window.location.assign(authNext);
      return;
    }
    if (isStaff) {
      window.location.assign("/admin");
      return;
    }
  };

  const loginWithGoogle = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    setBusy(false);
    if (error) toast.error(error.message || "Google sign-in failed. Enable Google provider in Supabase Auth.");
  };

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
    setBusy(false);
    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        setOtpType("signup");
        setMode("verify");
        const { error: rErr } = await supabase.auth.resend({ type: "signup", email: cleanEmail });
        if (rErr) return toast.error(`Could not resend: ${rErr.message}`);
        return toast.success("Please verify your email — we sent you a new code");
      }
      return toast.error(error.message === "Invalid login credentials" ? "Incorrect email or password" : error.message);
    }
    toast.success("Welcome back");
    await finish();
  };

  const signup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: { data: { full_name: name.trim() } },
    });
    setBusy(false);
    if (error) {
      if (error.message.toLowerCase().includes("already registered")) {
        toast.error("An account with this email already exists. Please sign in.");
        setMode("login");
        return;
      }
      return toast.error(error.message);
    }
    if (data.session) {
      toast.success("Account created");
      await finish();
      return;
    }
    setOtpType("signup");
    setMode("verify");
    toast.success("Check your email for a verification code");
  };

  const verify = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({ email: cleanEmail, token: code.trim(), type: otpType });
    setBusy(false);
    if (error) return toast.error(error.message);
    if (otpType === "recovery") {
      setMode("reset");
      toast.success("Code verified — set a new password");
      return;
    }
    toast.success("Email verified");
    await finish();
  };

  const forgot = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/`,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setOtpType("recovery");
    setMode("verify");
    toast.success("Reset code sent to your email");
  };

  const resetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    await finish();
  };

  const field =
    "w-full border border-border rounded-lg px-4 py-3 font-body text-sm bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  const titles: Record<Mode, [string, string]> = {
    login: ["Welcome back", "Sign in to your ADDA account."],
    signup: ["Create account", "Join ADDA to shop, track orders and follow sellers."],
    verify:
      otpType === "signup"
        ? ["Verify your email", `Enter the 6-digit code sent to ${cleanEmail}.`]
        : ["Reset code sent", `Enter the 6-digit code sent to ${cleanEmail}.`],
    forgot: ["Forgot password", "We will email you a reset code."],
    reset: ["New password", "Choose a strong password for your account."],
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <div className="flex flex-col items-center text-center mb-2">
          <img src="/adda-logo.svg" alt="ADDA" className="h-12 w-auto mb-3" />
          <DialogTitle className="font-display text-xl font-bold">{titles[mode][0]}</DialogTitle>
          <DialogDescription className="font-body text-sm text-muted-foreground mt-1">{titles[mode][1]}</DialogDescription>
        </div>

        <div className="space-y-4">
          {(mode === "login" || mode === "signup") && (
            <>
              <Button type="button" variant="outline" className="w-full h-11 font-semibold gap-2" disabled={busy} onClick={loginWithGoogle}>
                {busy ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                Continue with Google
              </Button>
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>
            </>
          )}

          {mode === "login" && (
            <form onSubmit={login} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${field} pl-10`} />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input required type={show ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${field} pl-10 pr-10`} />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button type="button" onClick={() => setMode("forgot")} className="text-xs text-primary hover:underline">Forgot password?</button>
              <Button disabled={busy} className="w-full h-11">{busy ? <Loader2 className="animate-spin" size={16} /> : null} Sign in</Button>
              <p className="text-xs text-center text-muted-foreground">
                No account?{" "}
                <button type="button" onClick={() => setMode("signup")} className="text-primary font-semibold hover:underline">Sign up</button>
              </p>
            </form>
          )}

          {mode === "signup" && (
            <form onSubmit={signup} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className={`${field} pl-10`} />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${field} pl-10`} />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input required type={show ? "text" : "password"} placeholder="Password (min 6)" value={password} onChange={(e) => setPassword(e.target.value)} className={`${field} pl-10 pr-10`} />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <input required type={show ? "text" : "password"} placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={field} />
              <Button disabled={busy} className="w-full h-11">{busy ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />} Create account</Button>
              <p className="text-xs text-center text-muted-foreground">
                Have an account?{" "}
                <button type="button" onClick={() => setMode("login")} className="text-primary font-semibold hover:underline">Sign in</button>
              </p>
            </form>
          )}

          {mode === "verify" && (
            <form onSubmit={verify} className="space-y-4">
              <input required inputMode="numeric" placeholder="6-digit code" value={code} onChange={(e) => setCode(e.target.value)} className={field} />
              <Button disabled={busy} className="w-full h-11">{busy ? <Loader2 className="animate-spin" size={16} /> : null} Verify</Button>
            </form>
          )}

          {mode === "forgot" && (
            <form onSubmit={forgot} className="space-y-4">
              <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
              <Button disabled={busy} className="w-full h-11">{busy ? <Loader2 className="animate-spin" size={16} /> : null} Send code</Button>
              <button type="button" onClick={() => setMode("login")} className="text-xs text-primary hover:underline w-full text-center">Back to sign in</button>
            </form>
          )}

          {mode === "reset" && (
            <form onSubmit={resetPassword} className="space-y-4">
              <input required type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={field} />
              <Button disabled={busy} className="w-full h-11">{busy ? <Loader2 className="animate-spin" size={16} /> : null} Update password</Button>
            </form>
          )}

          {(mode === "login" || mode === "signup") && (
            <>
              <Button type="button" variant="ghost" className="w-full h-10 text-muted-foreground" onClick={() => { setGuest(true); closeAuthModal(); }}>
                Continue as Guest
              </Button>
              <p className="text-[11px] text-muted-foreground text-center">Sign in required for checkout and order tracking.</p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
