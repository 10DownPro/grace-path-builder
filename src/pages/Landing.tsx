import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Flame, Menu, X, BarChart3, Swords, BookOpen, ArrowRight, 
  Shield, Users, Trophy, Star, CheckCircle2, Play, Zap, Heart, Target
} from "lucide-react";
import logo from "@/assets/logo.png";
import { useState, useEffect, useRef } from "react";

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
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

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const testimonials = [
    {
      name: "Marcus T.",
      role: "Youth Pastor",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      quote: "FaithFit transformed my daily routine. The streak system keeps me accountable in ways no other app has."
    },
    {
      name: "Sarah K.",
      role: "College Student",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      quote: "Finally, a faith app that feels like it was built for my generation. The gym aesthetic is 🔥"
    },
    {
      name: "David R.",
      role: "Business Owner",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      quote: "Battle Verses saved me during my hardest season. Having the right Scripture at my fingertips changed everything."
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Sticky Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="FaithFit" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
              <span className="font-display text-xl md:text-2xl tracking-wider text-primary">FAITHFIT</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-muted-foreground hover:text-foreground transition-colors font-body uppercase tracking-wide text-sm">
                Features
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-muted-foreground hover:text-foreground transition-colors font-body uppercase tracking-wide text-sm">
                How It Works
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="text-muted-foreground hover:text-foreground transition-colors font-body uppercase tracking-wide text-sm">
                Testimonials
              </button>
              <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors font-body uppercase tracking-wide text-sm">
                Login
              </Link>
              <Link to="/signup">
                <Button className="btn-gym">
                  START TRAINING
                </Button>
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border animate-slide-up bg-background/95 backdrop-blur-md">
              <div className="flex flex-col gap-4">
                <button onClick={() => scrollToSection('features')} className="text-left text-muted-foreground hover:text-foreground transition-colors font-body uppercase tracking-wide">
                  Features
                </button>
                <button onClick={() => scrollToSection('how-it-works')} className="text-left text-muted-foreground hover:text-foreground transition-colors font-body uppercase tracking-wide">
                  How It Works
                </button>
                <button onClick={() => scrollToSection('testimonials')} className="text-left text-muted-foreground hover:text-foreground transition-colors font-body uppercase tracking-wide">
                  Testimonials
                </button>
                <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors font-body uppercase tracking-wide">
                  Login
                </Link>
                <Link to="/signup">
                  <Button className="btn-gym w-full">
                    START TRAINING
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-warning/5 rounded-full blur-[120px]" />
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px),
                linear-gradient(hsl(var(--primary)) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Content */}
              <div className="text-center lg:text-left">
                {/* Trust Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center text-xs">⭐</div>
                    <div className="w-6 h-6 rounded-full bg-warning flex items-center justify-center text-xs">5</div>
                  </div>
                  <span className="text-sm font-body text-primary">Join 2,000+ Believers Training Daily</span>
                </div>

                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight mb-6 leading-[0.9]">
                  BUILD YOUR
                  <span className="block text-primary">FAITH LIKE</span>
                  <span className="block">AN ATHLETE</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground font-body max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                  Transform your spiritual life with structured daily training, progress tracking, and a community that pushes you to grow.
                  <span className="text-foreground font-medium"> No more inconsistent devotionals.</span>
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                  <Link to="/signup">
                    <Button className="btn-gym text-lg px-8 py-6 group">
                      START TRAINING
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <button 
                    onClick={() => scrollToSection('how-it-works')}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body"
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                      <Play className="w-5 h-5 ml-0.5" />
                    </div>
                    See How It Works
                  </button>
                </div>

                {/* Trust Signals */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Free Forever Plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>No Credit Card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Cancel Anytime</span>
                  </div>
                </div>
              </div>

              {/* Right: App Preview */}
              <div className="relative hidden lg:block">
                <div className="relative">
                  {/* Phone mockup */}
                  <div className="gym-card p-6 rounded-3xl border-2 shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-warning flex items-center justify-center">
                          <Flame className="w-6 h-6 text-background" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Current Streak</p>
                          <p className="font-display text-3xl text-primary">21 DAYS</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl">🔥</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 font-body">TODAY'S TRAINING</p>
                    
                    <div className="space-y-3">
                      <div className="exercise-box-complete flex items-center gap-3 p-4">
                        <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-background" />
                        </div>
                        <div className="flex-1">
                          <span className="font-body text-sm">Worship</span>
                          <p className="text-xs text-muted-foreground">15 min completed</p>
                        </div>
                        <span className="text-success text-sm font-bold">+10 XP</span>
                      </div>
                      <div className="exercise-box-complete flex items-center gap-3 p-4">
                        <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-background" />
                        </div>
                        <div className="flex-1">
                          <span className="font-body text-sm">Scripture</span>
                          <p className="text-xs text-muted-foreground">Psalm 23</p>
                        </div>
                        <span className="text-success text-sm font-bold">+10 XP</span>
                      </div>
                      <div className="exercise-box flex items-center gap-3 p-4 animate-pulse-glow">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-primary font-bold">3</span>
                        </div>
                        <div className="flex-1">
                          <span className="font-body text-sm">Prayer Time</span>
                          <p className="text-xs text-muted-foreground">10 min remaining</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating badges */}
                  <div className="absolute -top-4 -right-4 bg-success text-background px-4 py-2 rounded-full font-display text-sm shadow-lg animate-bounce">
                    +50 XP BONUS!
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-primary/20 rounded-full blur-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-primary" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" data-animate className={`py-20 md:py-32 transition-all duration-700 ${visibleSections.has('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-body uppercase tracking-wide text-primary">Powerful Features</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl tracking-tight mb-4">
              EVERYTHING YOU NEED TO
              <span className="text-primary"> GROW</span>
            </h2>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto text-lg">
              Transform your spiritual life with tools designed for real, measurable growth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="gym-card p-8 rounded-2xl relative overflow-hidden group hover:border-primary/50 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Flame className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-2xl tracking-wide mb-3">DAILY TRAINING</h3>
                <p className="text-muted-foreground font-body leading-relaxed mb-4">
                  4-part structured sessions: Worship, Scripture, Prayer, and Reflection. Build consistency that sticks.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Guided daily sessions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Streak tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Progress rewards</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="gym-card p-8 rounded-2xl relative overflow-hidden group hover:border-warning/50 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-40 h-40 bg-warning/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-warning/20 to-warning/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-8 h-8 text-warning" />
                </div>
                <h3 className="font-display text-2xl tracking-wide mb-3">TRACK PROGRESS</h3>
                <p className="text-muted-foreground font-body leading-relaxed mb-4">
                  Visual dashboards, heat maps, and weekly recaps. See your spiritual growth like never before.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Progress analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Achievement badges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Weekly insights</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="gym-card p-8 rounded-2xl relative overflow-hidden group hover:border-success/50 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-40 h-40 bg-success/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Swords className="w-8 h-8 text-success" />
                </div>
                <h3 className="font-display text-2xl tracking-wide mb-3">BATTLE VERSES</h3>
                <p className="text-muted-foreground font-body leading-relaxed mb-4">
                  600+ verses organized by 28 struggles. Anxiety, doubt, grief—find exactly what you need.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Searchable library</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Save favorites</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Share with friends</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y-2 border-border bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div className="group">
              <p className="stat-number text-primary group-hover:scale-110 transition-transform">2K+</p>
              <p className="text-muted-foreground font-body text-sm uppercase tracking-wide mt-1">Active Users</p>
            </div>
            <div className="group">
              <p className="stat-number text-primary group-hover:scale-110 transition-transform">600+</p>
              <p className="text-muted-foreground font-body text-sm uppercase tracking-wide mt-1">Battle Verses</p>
            </div>
            <div className="group">
              <p className="stat-number text-primary group-hover:scale-110 transition-transform">50K+</p>
              <p className="text-muted-foreground font-body text-sm uppercase tracking-wide mt-1">Sessions Completed</p>
            </div>
            <div className="group">
              <p className="stat-number text-primary group-hover:scale-110 transition-transform">4.9</p>
              <p className="text-muted-foreground font-body text-sm uppercase tracking-wide mt-1">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" data-animate className={`py-20 md:py-32 transition-all duration-700 ${visibleSections.has('how-it-works') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/30 mb-6">
              <Target className="w-4 h-4 text-success" />
              <span className="text-sm font-body uppercase tracking-wide text-success">Simple Process</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl tracking-tight mb-4">
              HOW IT <span className="text-primary">WORKS</span>
            </h2>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto text-lg">
              Start building your faith in three simple steps.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection lines - desktop only */}
              <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-warning to-success" />
              
              {/* Step 1 */}
              <div className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform">
                    <span className="font-display text-4xl text-background">1</span>
                  </div>
                </div>
                <h3 className="font-display text-2xl tracking-wide mb-3">SIGN UP FREE</h3>
                <p className="text-muted-foreground font-body">
                  Create your account in 30 seconds. No credit card required—ever for the free plan.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-warning to-warning/50 flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform">
                    <span className="font-display text-4xl text-background">2</span>
                  </div>
                </div>
                <h3 className="font-display text-2xl tracking-wide mb-3">TRAIN DAILY</h3>
                <p className="text-muted-foreground font-body">
                  Complete your 4-part session: Worship, Scripture, Prayer, and Reflection. Takes ~30 min.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-success to-success/50 flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform">
                    <span className="font-display text-4xl text-background">3</span>
                  </div>
                </div>
                <h3 className="font-display text-2xl tracking-wide mb-3">GROW STRONGER</h3>
                <p className="text-muted-foreground font-body">
                  Track your progress, earn achievements, and watch your faith transform over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" data-animate className={`py-20 md:py-32 bg-card/30 transition-all duration-700 ${visibleSections.has('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/30 mb-6">
              <Heart className="w-4 h-4 text-warning" />
              <span className="text-sm font-body uppercase tracking-wide text-warning">Loved by Thousands</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl tracking-tight mb-4">
              REAL <span className="text-primary">TRANSFORMATIONS</span>
            </h2>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto text-lg">
              See what believers are saying about their FaithFit journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="gym-card p-8 rounded-2xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-foreground font-body mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                  />
                  <div>
                    <p className="font-display text-lg">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-4xl md:text-6xl tracking-tight mb-6">
              READY TO START
              <span className="block text-primary">YOUR TRANSFORMATION?</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-body mb-10 max-w-2xl mx-auto">
              Join thousands of believers who are building unshakeable faith—one day at a time. 
              Your journey starts now.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link to="/signup">
                <Button className="btn-gym text-lg px-10 py-6 group">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-success" />
                <span>Free Forever Plan</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-success" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-success" />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-8">
            {/* Top Row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <img src={logo} alt="FaithFit" className="w-8 h-8 object-contain" />
                <span className="font-display text-xl tracking-wider text-primary">FAITHFIT</span>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <Link to="/waitlist" className="hover:text-foreground transition-colors">Join Waitlist</Link>
                <button onClick={() => scrollToSection('features')} className="hover:text-foreground transition-colors">Features</button>
                <button onClick={() => scrollToSection('testimonials')} className="hover:text-foreground transition-colors">Testimonials</button>
                <a href="mailto:support@faithfit.app" className="hover:text-foreground transition-colors">Contact</a>
                <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
              </div>
            </div>
            
            {/* Bottom Row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                © 2026 FaithFit. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
