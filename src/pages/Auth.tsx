import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { User, Session } from "@supabase/supabase-js";
import { Mail, Lock, User as UserIcon } from "lucide-react";

const emailSchema = z.string().trim().email({ message: "Имэйл хаяг буруу байна" });
const passwordSchema = z.string().min(6, { message: "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой" });

const Auth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) navigate("/");
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) navigate("/");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("signup-email") as string;
    const password = formData.get("signup-password") as string;
    const username = formData.get("username") as string;

    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ variant: "destructive", title: "Алдаа", description: error.errors[0].message });
        setLoading(false);
        return;
      }
    }

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
      toast({
        variant: "destructive",
        title: error.message.includes("already registered") ? "Бүртгэлтэй имэйл" : "Алдаа",
        description: error.message.includes("already registered")
          ? "Энэ имэйл бүртгэлтэй байна. Нэвтрэх хэсгээр орно уу."
          : error.message,
      });
    } else {
      toast({ title: "Амжилттай!", description: "Бүртгэл амжилттай үүслээ!" });
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("signin-email") as string;
    const password = formData.get("signin-password") as string;

    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ variant: "destructive", title: "Алдаа", description: error.errors[0].message });
        setLoading(false);
        return;
      }
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({
        variant: "destructive",
        title: "Нэвтрэх алдаа",
        description: error.message.includes("Invalid login credentials")
          ? "Имэйл эсвэл нууц үг буруу байна."
          : error.message,
      });
    } else {
      toast({ title: "Тавтай морил!", description: "Амжилттай нэвтэрлээ." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f3] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/olivin-logo.png"
            alt="Olivin Beauty"
            className="h-12 w-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-foreground font-['Jost']">
              Olivin Beauty-д тавтай морил! 🌿
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-['Jost']">
              Нэвтрэх эсвэл шинэ бүртгэл үүсгэх
            </p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#f5f5f3] rounded-xl p-1">
              <TabsTrigger
                value="signin"
                className="rounded-lg font-['Jost'] text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Нэвтрэх
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-lg font-['Jost'] text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Бүртгүүлэх
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="signin-email" className="text-sm font-['Jost'] text-foreground/80">Имэйл</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      name="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      disabled={loading}
                      className="pl-10 h-12 rounded-xl border-border/60 bg-[#fafaf9] focus-visible:ring-[#7d9b6e] focus-visible:border-[#7d9b6e] font-['Jost'] text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signin-password" className="text-sm font-['Jost'] text-foreground/80">Нууц үг</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      name="signin-password"
                      type="password"
                      placeholder="••••••••"
                      required
                      disabled={loading}
                      className="pl-10 h-12 rounded-xl border-border/60 bg-[#fafaf9] focus-visible:ring-[#7d9b6e] focus-visible:border-[#7d9b6e] font-['Jost'] text-sm"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[#7d9b6e] hover:bg-[#6b8a5e] text-white font-['Jost'] text-sm font-medium shadow-none"
                >
                  {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-sm font-['Jost'] text-foreground/80">Хэрэглэгчийн нэр</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="johndoe"
                      disabled={loading}
                      className="pl-10 h-12 rounded-xl border-border/60 bg-[#fafaf9] focus-visible:ring-[#7d9b6e] focus-visible:border-[#7d9b6e] font-['Jost'] text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-email" className="text-sm font-['Jost'] text-foreground/80">Имэйл</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      name="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      disabled={loading}
                      className="pl-10 h-12 rounded-xl border-border/60 bg-[#fafaf9] focus-visible:ring-[#7d9b6e] focus-visible:border-[#7d9b6e] font-['Jost'] text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-password" className="text-sm font-['Jost'] text-foreground/80">Нууц үг</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      name="signup-password"
                      type="password"
                      placeholder="••••••••"
                      required
                      disabled={loading}
                      className="pl-10 h-12 rounded-xl border-border/60 bg-[#fafaf9] focus-visible:ring-[#7d9b6e] focus-visible:border-[#7d9b6e] font-['Jost'] text-sm"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground font-['Jost']">Хамгийн багадаа 6 тэмдэгт</p>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[#7d9b6e] hover:bg-[#6b8a5e] text-white font-['Jost'] text-sm font-medium shadow-none"
                >
                  {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border/60" />
            <span className="text-xs text-muted-foreground font-['Jost']">Эсвэл</span>
            <div className="flex-1 h-px bg-border/60" />
          </div>

          {/* Social Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full h-12 rounded-xl border border-border/60 bg-white hover:bg-[#fafaf9] flex items-center justify-center gap-3 text-sm font-['Jost'] text-foreground/80 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google-ээр нэвтрэх
            </button>
            <button
              type="button"
              className="w-full h-12 rounded-xl border border-border/60 bg-white hover:bg-[#fafaf9] flex items-center justify-center gap-3 text-sm font-['Jost'] text-foreground/80 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook-ээр нэвтрэх
            </button>
          </div>

          {/* Guest */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-xs text-muted-foreground hover:text-foreground font-['Jost'] transition-colors"
            >
              Зочноор үргэлжлүүлэх →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
