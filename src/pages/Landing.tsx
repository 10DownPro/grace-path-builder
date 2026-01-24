import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Flame, Menu, X, BarChart3, Swords, BookOpen, ArrowRight, Shield, Users, Trophy } from "lucide-react";
import logo from "@/assets/logo.png";
import { useState } from "react";

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b-2 border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Faith Training" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
              <span className="font-display text-xl md:text-2xl tracking-wider text-primary">FT</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-muted-foreground hover:text-foreground transition-colors font-body uppercase tracking-wide text-sm">
                Features
              </button>
              <button onClick={() => scrollToSection('book')} className="text-muted-foreground hover:text-foreground transition-colors font-body uppercase tracking-wide text-sm">
                Book
              </button>
              <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors font-body uppercase tracking-wide text-sm">
                Login
              </Link>
              <Link to="/signup">
                <Button className="btn-gym">
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border animate-slide-up">
              <div className="flex flex-col gap-4">
                <button onClick={() => scrollToSection('features')} className="text-left text-muted-foreground hover:text-foreground transition-colors font-body uppercase tracking-wide">
                  Features
                </button>
                <button onClick={() => scrollToSection('book')} className="text-left text-muted-foreground hover:text-foreground transition-colors font-body uppercase tracking-wide">
                  Book
                </button>
                <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors font-body uppercase tracking-wide">
                  Login
                </Link>
                <Link to="/signup">
                  <Button className="btn-gym w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        
        {/* Accent Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8">
              <Flame className="w-4 h-4 text-primary" />
              <span className="text-sm font-body uppercase tracking-wide text-primary">Daily Spiritual Training</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight mb-6 leading-none">
              FAITH WON'T
              <span className="block text-primary">BUILD ITSELF</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground font-body max-w-2xl mx-auto mb-10 leading-relaxed">
              Put in the work. Track your progress. Transform your walk with Christ through 
              <span className="text-foreground font-medium"> structured daily training</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/signup">
                <Button className="btn-gym text-lg px-8 py-6 group">
                  START TRAINING TODAY
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-muted-foreground hover:text-foreground transition-colors font-body uppercase tracking-wide flex items-center gap-2"
              >
                See How It Works
              </button>
            </div>

            {/* App Preview Mockup */}
            <div className="relative max-w-sm mx-auto">
              <div className="gym-card p-6 rounded-2xl border-2 transform rotate-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Current Streak</p>
                      <p className="font-display text-2xl text-primary">7 DAY GRIND</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="exercise-box-complete flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                    <span className="font-body text-sm">Worship Complete</span>
                  </div>
                  <div className="exercise-box-complete flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                    <span className="font-body text-sm">Scripture Read</span>
                  </div>
                  <div className="exercise-box flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">3</span>
                    </div>
                    <span className="font-body text-sm text-muted-foreground">Prayer Time</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-warning/10 rounded-full blur-xl" />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-4">
              TRAIN <span className="text-primary">DAILY</span>
            </h2>
            <p className="text-muted-foreground font-body max-w-xl mx-auto">
              Transform your spiritual life with structured training, measurable progress, and accountability that works.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="gym-card p-8 rounded-xl relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Flame className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl tracking-wide mb-3">STRUCTURED TRAINING</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  4-part daily sessions: Worship, Scripture, Prayer, and Reflection. No guesswork, just growth.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="gym-card p-8 rounded-xl relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-warning/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-warning/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-7 h-7 text-warning" />
                </div>
                <h3 className="font-display text-xl tracking-wide mb-3">TRACK PROGRESS</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  Streaks, milestones, and achievements. See your growth with heat maps and weekly recaps.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="gym-card p-8 rounded-xl relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Swords className="w-7 h-7 text-success" />
                </div>
                <h3 className="font-display text-xl tracking-wide mb-3">BATTLE VERSES</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  Struggling? Find Scripture for 28 specific battles—anxiety, grief, doubt, and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-16 border-y-2 border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <p className="stat-number text-primary">600+</p>
              <p className="text-muted-foreground font-body text-sm uppercase tracking-wide mt-1">Battle Verses</p>
            </div>
            <div>
              <p className="stat-number text-primary">28</p>
              <p className="text-muted-foreground font-body text-sm uppercase tracking-wide mt-1">Struggle Categories</p>
            </div>
            <div>
              <p className="stat-number text-primary">7</p>
              <p className="text-muted-foreground font-body text-sm uppercase tracking-wide mt-1">Reading Levels</p>
            </div>
            <div>
              <p className="stat-number text-primary">40+</p>
              <p className="text-muted-foreground font-body text-sm uppercase tracking-wide mt-1">Achievements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Book Section */}
      <section id="book" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="gym-card rounded-2xl p-8 md:p-12 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, hsl(var(--primary)) 0, hsl(var(--primary)) 1px, transparent 0, transparent 50%)',
                    backgroundSize: '20px 20px'
                  }}
                />
              </div>

              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                {/* Book Image Placeholder */}
                <div className="relative">
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg border-2 border-primary/30 flex items-center justify-center">
                    <div className="text-center p-6">
                      <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
                      <p className="font-display text-2xl tracking-wide">FAITH</p>
                      <p className="font-display text-2xl tracking-wide text-primary">TRAINING</p>
                      <p className="font-display text-lg tracking-wide mt-2">GUIDE</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl" />
                </div>

                {/* Book Info */}
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 border border-warning/30 mb-6">
                    <Trophy className="w-4 h-4 text-warning" />
                    <span className="text-xs font-body uppercase tracking-wide text-warning">Lifetime Premium</span>
                  </div>
                  
                  <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-4">
                    GET THE <span className="text-primary">BOOK</span>
                  </h2>
                  
                  <p className="text-muted-foreground font-body mb-6 leading-relaxed">
                    The Faith Training Guide is your companion workbook for deeper growth. Each chapter 
                    connects directly to the app with QR codes and reflection prompts.
                  </p>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3 text-sm font-body">
                      <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                        <span className="text-success text-xs">✓</span>
                      </div>
                      <span>Lifetime premium features—no subscription</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm font-body">
                      <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                        <span className="text-success text-xs">✓</span>
                      </div>
                      <span>90-day structured training program</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm font-body">
                      <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                        <span className="text-success text-xs">✓</span>
                      </div>
                      <span>Audio devotionals for each chapter</span>
                    </li>
                  </ul>

                  <a href="https://amazon.com" target="_blank" rel="noopener noreferrer">
                    <Button className="btn-gym text-lg group">
                      BUY THE BOOK
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 md:py-32 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-4">
              TRAIN <span className="text-primary">TOGETHER</span>
            </h2>
            <p className="text-muted-foreground font-body max-w-xl mx-auto">
              Accountability partners, family groups, and squad challenges. Faith grows stronger in community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="gym-card p-6 rounded-xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg tracking-wide mb-2">SQUAD UP</h3>
                <p className="text-muted-foreground font-body text-sm">
                  Create or join squads for group accountability. See who's training and encourage each other.
                </p>
              </div>
            </div>

            <div className="gym-card p-6 rounded-xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="font-display text-lg tracking-wide mb-2">FAMILY STUDY</h3>
                <p className="text-muted-foreground font-body text-sm">
                  Multi-level Bible studies—the same passage adapted for every age from toddlers to seniors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-4xl md:text-6xl tracking-tight mb-6">
              DAY ONE STARTS <span className="text-primary">NOW</span>
            </h2>
            <p className="text-muted-foreground font-body text-lg mb-10">
              No more excuses. Your spiritual growth deserves the same focus you give everything else.
            </p>
            <Link to="/signup">
              <Button className="btn-gym text-xl px-10 py-7 group">
                START TRAINING
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t-2 border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {/* Logo Column */}
              <div>
                <Link to="/" className="flex items-center gap-2 mb-4">
                  <img src={logo} alt="Faith Training" className="w-10 h-10 object-contain" />
                  <span className="font-display text-xl tracking-wider text-primary">FAITH TRAINING</span>
                </Link>
                <p className="text-muted-foreground font-body text-sm">
                  Put in the work. Transform your walk.
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="font-display text-sm tracking-wide mb-4">APP</h4>
                <ul className="space-y-2">
                  <li><Link to="/signup" className="text-muted-foreground hover:text-foreground text-sm font-body transition-colors">Sign Up</Link></li>
                  <li><Link to="/login" className="text-muted-foreground hover:text-foreground text-sm font-body transition-colors">Login</Link></li>
                  <li><button onClick={() => scrollToSection('features')} className="text-muted-foreground hover:text-foreground text-sm font-body transition-colors">Features</button></li>
                </ul>
              </div>

              <div>
                <h4 className="font-display text-sm tracking-wide mb-4">RESOURCES</h4>
                <ul className="space-y-2">
                  <li><button onClick={() => scrollToSection('book')} className="text-muted-foreground hover:text-foreground text-sm font-body transition-colors">Faith Training Guide</button></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm font-body transition-colors">Support</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-display text-sm tracking-wide mb-4">LEGAL</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm font-body transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm font-body transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-muted-foreground text-sm font-body">
                © {new Date().getFullYear()} Faith Training. All rights reserved.
              </p>
              <p className="font-display text-primary tracking-widest">NO DAYS OFF</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
