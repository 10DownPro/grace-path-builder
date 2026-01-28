import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Flame, ArrowRight, CheckCircle2, Sparkles, Users, 
  Bell, Gift, Timer, Shield, Mail, Twitter, Instagram
} from "lucide-react";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(847); // Starting number for social proof
  const [referralCode, setReferralCode] = useState<string | null>(null);

  // Check URL for referral code
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('waitlist')
        .insert({
          email: email.toLowerCase().trim(),
          source: 'waitlist_page',
          referred_by: referralCode
        })
        .select('referral_code')
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error("You're already on the waitlist! We'll notify you soon.");
        } else {
          throw error;
        }
      } else {
        setIsSubmitted(true);
        setWaitlistCount(prev => prev + 1);
        toast.success("You're on the list! 🎉");
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: Flame,
      title: "Daily Training Sessions",
      description: "Structured 30-minute sessions covering Worship, Scripture, Prayer & Reflection"
    },
    {
      icon: Users,
      title: "Squad Accountability",
      description: "Train with friends, compete on leaderboards, and stay motivated together"
    },
    {
      icon: Shield,
      title: "Battle Verses Library",
      description: "600+ verses organized by struggle—anxiety, doubt, grief, and 25 more categories"
    }
  ];

  const earlyAccessBenefits = [
    "50% off Premium for life",
    "Founding Member badge",
    "Early access to new features",
    "Direct input on app development"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-warning/5 rounded-full blur-[100px]" />
        {/* Animated grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="FaithFit" className="w-10 h-10 object-contain" />
              <span className="font-display text-xl tracking-wider text-primary">FAITHFIT</span>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/30 mb-8 animate-pulse">
              <Timer className="w-4 h-4 text-warning" />
              <span className="text-sm font-body uppercase tracking-wide text-warning">Launching Soon</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl tracking-tight mb-6 leading-[0.9]">
              BE THE FIRST TO
              <span className="block text-primary">TRANSFORM YOUR</span>
              <span className="block">FAITH</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground font-body max-w-2xl mx-auto mb-10 leading-relaxed">
              FaithFit is launching soon. Join the waitlist to get exclusive early access, 
              founding member benefits, and be part of building something special.
            </p>

            {/* Waitlist Count */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-lg font-body">
                <span className="text-primary font-display text-2xl">{waitlistCount.toLocaleString()}</span>
                {" "}believers already waiting
              </span>
            </div>

            {/* Email Form */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-14 text-lg bg-card border-2 border-border focus:border-primary"
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="btn-gym h-14 px-8 text-lg whitespace-nowrap"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                        Joining...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Join Waitlist
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="max-w-md mx-auto mb-6 gym-card p-6 rounded-2xl border-2 border-success">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  </div>
                </div>
                <h3 className="font-display text-2xl text-success mb-2">YOU'RE ON THE LIST!</h3>
                <p className="text-muted-foreground font-body">
                  We'll email you as soon as FaithFit launches. Check your inbox for a confirmation.
                </p>
              </div>
            )}

            {/* Privacy Note */}
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              We respect your privacy. No spam, ever.
            </p>
          </div>
        </div>
      </section>

      {/* Early Access Benefits */}
      <section className="relative z-10 py-16 border-y border-border bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Gift className="w-4 h-4 text-primary" />
              <span className="text-sm font-body uppercase tracking-wide text-primary">Early Adopter Perks</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight">
              FIRST 500 SIGNUPS GET
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {earlyAccessBenefits.map((benefit, index) => (
              <div key={index} className="gym-card p-5 rounded-xl text-center hover:border-primary/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <p className="font-body text-sm">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="relative z-10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-4">
              WHAT'S <span className="text-primary">COMING</span>
            </h2>
            <p className="text-muted-foreground font-body max-w-xl mx-auto">
              A sneak peek at the features that will transform your daily faith practice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="gym-card p-8 rounded-2xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl tracking-wide mb-3">{feature.title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notification CTA */}
      <section className="relative z-10 py-16 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Bell className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-4">
              DON'T MISS THE LAUNCH
            </h2>
            <p className="text-muted-foreground font-body mb-8">
              We're putting the finishing touches on FaithFit. Join the waitlist above 
              to be the first to know when we go live.
            </p>
            {!isSubmitted && (
              <Button 
                onClick={() => document.querySelector('input')?.focus()}
                className="btn-gym"
              >
                Join the Waitlist
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <img src={logo} alt="FaithFit" className="w-8 h-8 object-contain" />
              <span className="font-display text-xl tracking-wider text-primary">FAITHFIT</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="mailto:hello@faithfit.app" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2025 FaithFit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Waitlist;
