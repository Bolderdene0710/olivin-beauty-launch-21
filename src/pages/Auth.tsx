import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowLeft, ArrowRight, Loader2, Leaf, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import olivinLogo from "@/assets/olivin-logo.png";
import olivinLogoWhite from "@/assets/olivin-logo-white.png";
import heroImage from "@/assets/hero-skincare.jpg";

const emailSchema = z.string().trim().email({ message: "Имэйл хаяг буруу байна" });
const passwordSchema = z.string().min(6, { message: "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой" });

type Mode = "signin" | "signup" | "forgot" | "recovery";

const PERKS = [
  { icon: Leaf, text: "100% жинхэнэ K-Beauty" },
  { icon: Truck, text: "Улаанбаатар даяар хурдан хүргэлт" },
  { icon: Sparkles, text: "Гишүүдэд онцгой урамшуулал" },
];

const validate = (fn: () => void) => {
  try {
    fn();
    return null;
  } catch (error) {
    return error instanceof z.ZodError ? error.errors[0].message : "Алдаа гарлаа";
  }
};

const passwordStrength = (pw: string) => {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

const STRENGTH_LABELS = ["Хэт богино", "Сул", "Дунд", "Сайн", "Маш сайн"];
const STRENGTH_COLORS = ["bg-destructive", "bg-destructive", "bg-amber-400", "bg-primary", "bg-primary-dark"];

const Auth = () => {
  const [mode, setMode] = useState<Mode>("signin");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signupPassword, setSignupPassword] = useState("");
  const [resetSentTo, setResetSentTo] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: storeSettings } = useStoreSettings();
  const logoSrc = storeSettings?.logo_url || olivinLogo;
  const storeName = storeSettings?.store_name || "Olivin Beauty";

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Reset-password link logs the user in; let them set a new password first.
      if (event === "PASSWORD_RECOVERY") {
        setMode("recovery");
        return;
      }
      if (session?.user && event === "SIGNED_IN") navigate("/");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      const isRecoveryLink = window.location.hash.includes("type=recovery");
      if (session?.user && !isRecoveryLink) navigate("/");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fail = (description: string, title = "Алдаа") => {
    toast({ variant: "destructive", title, description });
    setLoading(false);
  };

  const switchMode = (next: Mode) => {
    setShowPassword(false);
    setMode(next);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("signup-email") as string;
    const password = formData.get("signup-password") as string;
    const username = formData.get("username") as string;

    const invalid = validate(() => {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    });
    if (invalid) return fail(invalid);

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { username: username || email.split("@")[0] },
      },
    });

    setLoading(false);
    if (error) {
      const registered = error.message.includes("already registered");
      fail(
        registered ? "Энэ имэйл бүртгэлтэй байна. Нэвтрэх хэсгээр орно уу." : error.message,
        registered ? "Бүртгэлтэй имэйл" : "Алдаа"
      );
    } else {
      toast({ title: "Амжилттай!", description: "Бүртгэл амжилттай үүслээ!" });
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("signin-email") as string;
    const password = formData.get("signin-password") as string;

    const invalid = validate(() => {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    });
    if (invalid) return fail(invalid);

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      fail(
        error.message.includes("Invalid login credentials") ? "Имэйл эсвэл нууц үг буруу байна." : error.message,
        "Нэвтрэх алдаа"
      );
    } else {
      toast({ title: "Тавтай морил!", description: "Амжилттай нэвтэрлээ." });
    }
  };

  const handleForgot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("forgot-email") as string;
    const invalid = validate(() => emailSchema.parse(email));
    if (invalid) return fail(invalid);

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth`,
    });
    setLoading(false);
    if (error) return fail(error.message);
    setResetSentTo(email.trim());
  };

  const handleRecovery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = new FormData(e.currentTarget).get("new-password") as string;
    const invalid = validate(() => passwordSchema.parse(password));
    if (invalid) return fail(invalid);

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return fail(error.message);
    toast({ title: "Нууц үг шинэчлэгдлээ", description: "Шинэ нууц үгээрээ нэвтэрсэн байна." });
    navigate("/");
  };

  const handleOAuth = async (provider: "google" | "facebook") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) fail(error.message);
  };

  const heading: Record<Mode, { title: string; subtitle: string }> = {
    signin: { title: "Эргээд тавтай морил", subtitle: "Бүртгэлдээ нэвтэрч захиалгаа удирдаарай" },
    signup: { title: "Бүртгэл үүсгэх", subtitle: "Гишүүн болж онцгой урамшууллаа аваарай" },
    forgot: { title: "Нууц үг сэргээх", subtitle: "Бүртгэлтэй имэйл рүү тань сэргээх холбоос илгээнэ" },
    recovery: { title: "Шинэ нууц үг", subtitle: "Бүртгэлдээ шинэ нууц үг тохируулна уу" },
  };

  const strength = passwordStrength(signupPassword);

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr] bg-background">
      {/* Visual side */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 text-white">
        <motion.img
          src={heroImage}
          alt=""
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(100_25%_14%/0.92)] via-[hsl(100_22%_20%/0.45)] to-[hsl(100_22%_20%/0.15)]" />

        <button onClick={() => navigate("/")} className="relative self-start">
          <img
            src={storeSettings?.logo_url || olivinLogoWhite}
            alt={storeName}
            className="h-8 w-auto object-contain brightness-0 invert"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = olivinLogo;
            }}
          />
        </button>

        <div className="relative max-w-md">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-serif-display text-5xl xl:text-6xl font-light leading-[1.05] tracking-tight"
          >
            Сөүлээс <em className="italic text-sage-light">таны арьсанд</em>
          </motion.h2>
          <ul className="mt-8 space-y-3">
            {PERKS.map(({ icon: Icon, text }, i) => (
              <motion.li
                key={text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.45 + i * 0.1 }}
                className="flex items-center gap-3 text-sm text-white/90"
              >
                <span className="w-8 h-8 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </span>
                {text}
              </motion.li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Form side */}
      <main className="relative flex flex-col min-h-screen">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,hsl(var(--sage-light)/0.35),transparent_55%)]"
        />

        <header className="relative flex items-center justify-between px-6 md:px-10 pt-6">
          <button onClick={() => navigate("/")} className="lg:hidden">
            <img
              src={logoSrc}
              alt={storeName}
              className="h-7 w-auto object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = olivinLogo;
              }}
            />
          </button>
          <button
            onClick={() => navigate("/")}
            className="ml-auto inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Зочноор үргэлжлүүлэх <ArrowRight className="w-4 h-4" />
          </button>
        </header>

        <div className="relative flex-1 flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode + (resetSentTo ?? "")}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                {(mode === "forgot" || mode === "recovery") && (
                  <button
                    onClick={() => {
                      setResetSentTo(null);
                      switchMode("signin");
                    }}
                    className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4" /> Нэвтрэх рүү буцах
                  </button>
                )}

                <h1 className="font-serif-display text-4xl font-light tracking-tight text-foreground">
                  {heading[mode].title}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">{heading[mode].subtitle}</p>

                {(mode === "signin" || mode === "signup") && (
                  <div className="mt-8 grid grid-cols-2 p-1 rounded-2xl bg-secondary">
                    {(["signin", "signup"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => switchMode(m)}
                        className={`relative h-10 rounded-xl text-sm font-medium transition-colors ${
                          mode === m ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {mode === m && (
                          <motion.span
                            layoutId="auth-mode"
                            className="absolute inset-0 rounded-xl bg-background shadow-sm"
                            transition={{ type: "spring", stiffness: 450, damping: 35 }}
                          />
                        )}
                        <span className="relative">{m === "signin" ? "Нэвтрэх" : "Бүртгүүлэх"}</span>
                      </button>
                    ))}
                  </div>
                )}

                {mode === "signin" && (
                  <form onSubmit={handleSignIn} className="mt-6 space-y-4">
                    <Field id="signin-email" label="Имэйл" icon={Mail} type="email" placeholder="you@example.com" autoComplete="email" disabled={loading} />
                    <Field
                      id="signin-password"
                      label="Нууц үг"
                      icon={Lock}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      disabled={loading}
                      labelAction={
                        <button
                          type="button"
                          onClick={() => switchMode("forgot")}
                          className="text-xs font-medium text-primary-dark hover:underline underline-offset-4"
                        >
                          Нууц үгээ мартсан?
                        </button>
                      }
                      trailing={<PasswordToggle shown={showPassword} onToggle={() => setShowPassword((s) => !s)} />}
                    />
                    <SubmitButton loading={loading} label="Нэвтрэх" loadingLabel="Нэвтэрч байна..." />
                  </form>
                )}

                {mode === "signup" && (
                  <form onSubmit={handleSignUp} className="mt-6 space-y-4">
                    <Field id="username" label="Хэрэглэгчийн нэр" icon={UserIcon} placeholder="Таны нэр" autoComplete="nickname" required={false} disabled={loading} />
                    <Field id="signup-email" label="Имэйл" icon={Mail} type="email" placeholder="you@example.com" autoComplete="email" disabled={loading} />
                    <div>
                      <Field
                        id="signup-password"
                        label="Нууц үг"
                        icon={Lock}
                        type={showPassword ? "text" : "password"}
                        placeholder="Хамгийн багадаа 6 тэмдэгт"
                        autoComplete="new-password"
                        disabled={loading}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        trailing={<PasswordToggle shown={showPassword} onToggle={() => setShowPassword((s) => !s)} />}
                      />
                      {signupPassword && (
                        <div className="mt-2.5 flex items-center gap-3">
                          <div className="flex-1 grid grid-cols-4 gap-1">
                            {[1, 2, 3, 4].map((i) => (
                              <span
                                key={i}
                                className={`h-1 rounded-full transition-colors duration-300 ${
                                  i <= strength ? STRENGTH_COLORS[strength] : "bg-border"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-muted-foreground w-20 text-right">{STRENGTH_LABELS[strength]}</span>
                        </div>
                      )}
                    </div>
                    <SubmitButton loading={loading} label="Бүртгүүлэх" loadingLabel="Бүртгэж байна..." />
                    <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
                      Бүртгүүлснээр та үйлчилгээний нөхцөлийг зөвшөөрч байна.
                    </p>
                  </form>
                )}

                {mode === "forgot" &&
                  (resetSentTo ? (
                    <div className="mt-8 p-6 rounded-3xl bg-primary/[0.07] border border-primary/20 text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary-dark" />
                      </div>
                      <p className="mt-4 font-medium text-foreground">Имэйлээ шалгана уу</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        <span className="text-foreground">{resetSentTo}</span> хаяг руу нууц үг сэргээх холбоос илгээлээ.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleForgot} className="mt-8 space-y-4">
                      <Field id="forgot-email" label="Имэйл" icon={Mail} type="email" placeholder="you@example.com" autoComplete="email" disabled={loading} />
                      <SubmitButton loading={loading} label="Холбоос илгээх" loadingLabel="Илгээж байна..." />
                    </form>
                  ))}

                {mode === "recovery" && (
                  <form onSubmit={handleRecovery} className="mt-8 space-y-4">
                    <Field
                      id="new-password"
                      label="Шинэ нууц үг"
                      icon={Lock}
                      type={showPassword ? "text" : "password"}
                      placeholder="Хамгийн багадаа 6 тэмдэгт"
                      autoComplete="new-password"
                      disabled={loading}
                      trailing={<PasswordToggle shown={showPassword} onToggle={() => setShowPassword((s) => !s)} />}
                    />
                    <SubmitButton loading={loading} label="Хадгалах" loadingLabel="Хадгалж байна..." />
                  </form>
                )}

                {(mode === "signin" || mode === "signup") && (
                  <>
                    <div className="flex items-center gap-3 my-7">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">эсвэл</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <SocialButton label="Google" onClick={() => handleOAuth("google")}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      </SocialButton>
                      <SocialButton label="Facebook" onClick={() => handleOAuth("facebook")}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </SocialButton>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <footer className="relative px-6 pb-6 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5" /> Таны мэдээлэл шифрлэгдэн хамгаалагдсан
        </footer>
      </main>
    </div>
  );
};

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  labelAction?: React.ReactNode;
  trailing?: React.ReactNode;
}

const Field = ({ id, label, icon: Icon, labelAction, trailing, required = true, ...input }: FieldProps) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="text-sm font-medium text-foreground/80">
        {label}
      </label>
      {labelAction}
    </div>
    <div className="group relative flex items-center rounded-2xl bg-secondary/70 border border-transparent transition-all focus-within:bg-background focus-within:border-primary focus-within:shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]">
      <Icon className="absolute left-4 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary-dark" />
      <input
        id={id}
        name={id}
        required={required}
        className="w-full h-12 bg-transparent pl-11 pr-11 text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none disabled:opacity-60"
        {...input}
      />
      {trailing && <div className="absolute right-2">{trailing}</div>}
    </div>
  </div>
);

const PasswordToggle = ({ shown, onToggle }: { shown: boolean; onToggle: () => void }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={shown ? "Нууц үг нуух" : "Нууц үг харах"}
    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
  >
    {shown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
  </button>
);

const SubmitButton = ({ loading, label, loadingLabel }: { loading: boolean; label: string; loadingLabel: string }) => (
  <button
    type="submit"
    disabled={loading}
    className="group w-full h-12 mt-2 rounded-2xl bg-foreground text-background text-[15px] font-medium flex items-center justify-center gap-2 hover:bg-primary-dark active:scale-[0.99] transition-all disabled:opacity-70 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.4)]"
  >
    {loading ? (
      <>
        <Loader2 className="w-4 h-4 animate-spin" /> {loadingLabel}
      </>
    ) : (
      <>
        {label}
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </>
    )}
  </button>
);

const SocialButton = ({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className="h-12 rounded-2xl border border-border bg-background hover:bg-secondary/70 hover:border-foreground/20 flex items-center justify-center gap-2.5 text-sm font-medium text-foreground transition-all"
  >
    {children}
    {label}
  </button>
);

export default Auth;
