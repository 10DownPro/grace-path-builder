import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu, X, ArrowRight, Heart, BookOpen, MessageCircle, Sparkles,
  CheckCircle2, Compass, Sunrise, HandHeart
} from "lucide-react";
import logo from "@/assets/logo.png";
import { useState, useEffect } from "react";

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Sticky Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/90 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="FaithFit" className="w-10 h-10 md:w-11 md:h-11 object-contain" />
              <span className="font-wordmark text-xl md:text-2xl tracking-wider text-foreground">FAITHFIT</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('how-it-works')} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                How it works
              </button>
              <button onClick={() => scrollToSection('tracks')} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Guided tracks
              </button>
              <button onClick={() => scrollToSection('audience')} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Who it's for
              </button>
              <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                Sign in
              </Link>
              <Link to="/waitlist">
                <Button className="btn-gym">Join the Waitlist</Button>
              </Link>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-foreground">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border animate-slide-up bg-background/95 backdrop-blur-md">
              <div className="flex flex-col gap-4">
                <button onClick={() => scrollToSection('how-it-works')} className="text-left text-muted-foreground hover:text-foreground">How it works</button>
                <button onClick={() => scrollToSection('tracks')} className="text-left text-muted-foreground hover:text-foreground">Guided tracks</button>
                <button onClick={() => scrollToSection('audience')} className="text-left text-muted-foreground hover:text-foreground">Who it's for</button>
                <Link to="/login" className="text-muted-foreground hover:text-foreground">Sign in</Link>
                <Link to="/waitlist"><Button className="btn-gym w-full">Join the Waitlist</Button></Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 gradient-dawn" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[140px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border mb-8">
              <Sparkles className="w-3.5 h-3.5 text-accent-warm" />
              <span className="text-xs font-medium text-muted-foreground tracking-wide">
                A gentle guide for the start — or the return
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight mb-6 leading-[1.05] text-balance">
              Build or Rebuild
              <span className="block text-primary">Your Walk With God.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Whether you're just getting started or finding your way back, FaithFit guides you through
              worship, scripture, prayer, and reflection — one day at a time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link to="/waitlist">
                <Button className="btn-gym text-base px-8 py-6 group">
                  Join the Waitlist
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm underline-offset-4 hover:underline"
              >
                See how it works
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary" /> No experience required</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary" /> 5 minutes a day</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary" /> Always free to begin</span>
            </div>
          </div>
        </div>
      </section>

      {/* Audience */}
      <section id="audience" data-animate className={`py-20 md:py-28 transition-all duration-700 ${visibleSections.has('audience') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-4">Made for two journeys.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Wherever you're starting from, you're welcome here.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="gym-card p-8 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-5">
                <Compass className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-2xl mb-3">New to faith</h3>
              <p className="text-muted-foreground leading-relaxed">
                You want to follow God but don't know where to start. We'll walk you through it gently —
                what prayer is, who Jesus is, how to read the Bible, and what salvation means.
              </p>
            </div>
            <div className="gym-card p-8 hover:border-secondary/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center mb-5">
                <HandHeart className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-display text-2xl mb-3">Coming back to God</h3>
              <p className="text-muted-foreground leading-relaxed">
                You drifted, and now you want to come home. No shame. No catching up. Just a fresh start —
                rebuilding trust, prayer, and rhythm one quiet day at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — Today's Walk */}
      <section id="how-it-works" data-animate className={`py-20 md:py-28 transition-all duration-700 ${visibleSections.has('how-it-works') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-[0.2em] text-primary mb-3">Today's Walk</p>
            <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-4">Four quiet steps. One day at a time.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Each day brings a guided rhythm — short, simple, and meaningful. No pressure to perform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Heart, title: 'Worship', body: 'A song to settle your heart and turn toward God.' },
              { icon: BookOpen, title: 'Scripture', body: 'A short passage with gentle context — no jargon.' },
              { icon: HandHeart, title: 'Prayer', body: 'A guided prompt for honest conversation with God.' },
              { icon: MessageCircle, title: 'Reflection', body: 'One question to help you carry today with you.' },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="gym-card p-6">
                <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-xl mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guided Tracks */}
      <section id="tracks" data-animate className={`py-20 md:py-28 transition-all duration-700 ${visibleSections.has('tracks') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-[0.2em] text-secondary mb-3">Guided Tracks</p>
            <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-4">Start where you are.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Two short tracks meet you at the doorway — no Bible college required.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="gym-card p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Track A</p>
              <h3 className="font-display text-2xl mb-4">Starting Faith</h3>
              <ul className="space-y-2 text-muted-foreground">
                {['Who is God?', 'Who is Jesus?', 'What is prayer?', 'How do I read the Bible?', 'What does salvation mean?'].map((t) => (
                  <li key={t} className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary" />{t}</li>
                ))}
              </ul>
            </div>
            <div className="gym-card p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-secondary mb-3">Track B</p>
              <h3 className="font-display text-2xl mb-4">Coming Back</h3>
              <ul className="space-y-2 text-muted-foreground">
                {['Starting over', 'Guilt and shame', 'Trusting God again', 'Rebuilding consistency', 'Returning to prayer', "Hearing God's voice"].map((t) => (
                  <li key={t} className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-secondary" />{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Sunrise className="w-10 h-10 text-accent-warm mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-5xl tracking-tight mb-6 text-balance">
            "I can do this."
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">
            FaithFit will never shame you for missing a day. If you step away,
            we'll just say <span className="text-foreground italic">welcome back</span> — and pick up
            wherever you are.
          </p>
          <Link to="/waitlist">
            <Button className="btn-gym text-base px-8 py-6">
              Join the Waitlist
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="FaithFit" className="w-7 h-7 object-contain" />
            <span className="font-wordmark text-lg tracking-wider">FAITHFIT</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/waitlist" className="hover:text-foreground">Waitlist</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
