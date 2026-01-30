import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Bell, BookOpen, Clock, User, Moon, Shield, HelpCircle, Heart, LogOut, Sun, Crown, Sparkles, Check, Loader2, AlertCircle, ExternalLink, Share2, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useNotifications } from '@/hooks/useNotifications';
import { usePremium } from '@/hooks/usePremium';
import { useBookCode } from '@/hooks/useBookCode';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Settings() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { preferences: notifPrefs, scheduleNotification, sendTestNotification } = useNotifications();
  const { isPremium, premiumSource, bookCodeUsed, premiumActivatedAt, hideBookPromos, setHideBookPromos } = usePremium();
  const { redeemCode, formatCodeInput, validateCodeFormat, loading: redeemLoading } = useBookCode();
  
  // Settings state
  const [notifications, setNotifications] = useState(notifPrefs?.enabled ?? true);
  const [darkMode, setDarkMode] = useState(true);
  
  // Dialog states
  const [sessionTimeOpen, setSessionTimeOpen] = useState(false);
  const [translationOpen, setTranslationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [commitmentOpen, setCommitmentOpen] = useState(false);
  const [bookCodeOpen, setBookCodeOpen] = useState(false);
  
  // Form states
  const [sessionTime, setSessionTime] = useState(profile?.preferred_time || '6:00 AM');
  const [selectedTranslation, setSelectedTranslation] = useState('KJV');
  const [profileName, setProfileName] = useState(profile?.name || '');
  const [commitment, setCommitment] = useState<'starter' | 'committed' | 'warrior'>(profile?.commitment as 'starter' | 'committed' | 'warrior' || 'committed');
  const [bookCode, setBookCode] = useState('');
  const [bookCodeError, setBookCodeError] = useState<string | null>(null);

  // Load saved settings
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedNotifications = localStorage.getItem('notifications');
    const savedTranslation = localStorage.getItem('bibleTranslation');
    
    if (savedDarkMode !== null) setDarkMode(savedDarkMode === 'true');
    if (savedNotifications !== null) setNotifications(savedNotifications === 'true');
    if (savedTranslation) setSelectedTranslation(savedTranslation);
  }, []);

  // Update profile state when profile loads
  useEffect(() => {
    if (profile) {
      setProfileName(profile.name || '');
      setSessionTime(profile.preferred_time || '6:00 AM');
      setCommitment(profile.commitment || 'committed');
    }
  }, [profile]);

  // Handle dark mode toggle
  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    localStorage.setItem('darkMode', String(enabled));
    
    // Apply to document
    if (enabled) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    
    toast.success(enabled ? 'Dark mode enabled' : 'Light mode enabled');
  };

  // Handle notifications toggle
  const handleNotificationsToggle = async (enabled: boolean) => {
    setNotifications(enabled);
    localStorage.setItem('notifications', String(enabled));
    
    if (enabled) {
      // Request notification permission and schedule
      const result = await scheduleNotification(sessionTime);
      if (result.error) {
        toast.info('Please allow notifications in your browser settings');
        setNotifications(false);
      } else {
        toast.success('Daily reminders enabled');
        // Send a test notification
        setTimeout(() => sendTestNotification(), 1000);
      }
    } else {
      toast.success('Daily reminders disabled');
    }
  };

  // Handle book promos toggle
  const handleHidePromosToggle = async (hide: boolean) => {
    await setHideBookPromos(hide);
    toast.success(hide ? 'Book promotions hidden' : 'Book promotions enabled');
  };

  // Save session time
  const handleSaveSessionTime = async () => {
    // Map display time to profile time format
    const timeMap: Record<string, 'morning' | 'afternoon' | 'evening' | 'flexible'> = {
      '5:00 AM': 'morning', '6:00 AM': 'morning', '7:00 AM': 'morning', '8:00 AM': 'morning',
      '12:00 PM': 'afternoon', '6:00 PM': 'evening', '8:00 PM': 'evening', '9:00 PM': 'evening'
    };
    await updateProfile({ preferred_time: timeMap[sessionTime] || 'morning' });
    
    // Also update notification schedule if enabled
    if (notifications) {
      await scheduleNotification(sessionTime);
    }
    
    setSessionTimeOpen(false);
    toast.success('Session time updated');
  };

  // Save translation preference
  const handleSaveTranslation = () => {
    localStorage.setItem('bibleTranslation', selectedTranslation);
    setTranslationOpen(false);
    toast.success('Bible translation updated');
  };

  // Save profile name
  const handleSaveProfile = async () => {
    await updateProfile({ name: profileName });
    setProfileOpen(false);
    toast.success('Profile updated');
  };

  // Save commitment level
  const handleSaveCommitment = async () => {
    await updateProfile({ commitment });
    setCommitmentOpen(false);
    toast.success('Commitment level updated');
  };

  // Handle book code redemption
  const handleRedeemCode = async () => {
    if (!validateCodeFormat(bookCode)) {
      setBookCodeError('Please enter a valid code (Format: FT-XXXXXX)');
      return;
    }

    const result = await redeemCode(bookCode);
    
    if (result.success) {
      setBookCodeOpen(false);
      setBookCode('');
      toast.success('Premium unlocked! Welcome to the inner circle.', {
        icon: '🔥',
        duration: 5000,
      });
    } else {
      setBookCodeError(result.message);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      navigate('/');
    }
  };

  const settingsGroups = [
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Daily Reminders',
          description: notifications ? 'Enabled' : 'Disabled',
          type: 'toggle' as const,
          value: notifications,
          onChange: handleNotificationsToggle
        },
        {
          icon: Clock,
          label: 'Session Time',
          description: profile?.preferred_time || sessionTime,
          type: 'link' as const,
          onClick: () => setSessionTimeOpen(true)
        },
        {
          icon: BookOpen,
          label: 'Bible Translation',
          description: selectedTranslation,
          type: 'link' as const,
          onClick: () => setTranslationOpen(true)
        },
        {
          icon: darkMode ? Moon : Sun,
          label: 'Dark Mode',
          description: darkMode ? 'On' : 'Off',
          type: 'toggle' as const,
          value: darkMode,
          onChange: handleDarkModeToggle
        },
      ]
    },
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Profile',
          description: profile?.name || 'Set your name',
          type: 'link' as const,
          onClick: () => setProfileOpen(true)
        },
        {
          icon: Shield,
          label: 'Commitment Level',
          description: profile?.commitment ? profile.commitment.charAt(0).toUpperCase() + profile.commitment.slice(1) : 'Committed',
          type: 'link' as const,
          onClick: () => setCommitmentOpen(true)
        },
      ]
    },
      {
        title: 'Resources',
        items: [
          {
            icon: BookOpen,
            label: 'Buy the Faith Training Guide',
            description: 'Get the companion book',
            type: 'link' as const,
            onClick: () => window.open('#', '_blank') // Placeholder
          },
          {
            icon: Share2,
            label: 'Share Faith Training',
            description: 'Invite friends to train',
            type: 'link' as const,
            onClick: () => {
              if (navigator.share) {
                navigator.share({
                  title: 'Faith Training',
                  text: 'Your spiritual gym for building unshakeable faith',
                  url: window.location.origin
                });
              } else {
                navigator.clipboard.writeText(window.location.origin);
                toast.success('Link copied to clipboard!');
              }
            }
          },
          {
            icon: Star,
            label: 'Rate This App',
            description: 'Leave a review',
            type: 'link' as const,
            onClick: () => toast.info('App store link coming soon!')
          },
        ]
      },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help Center',
          description: 'FAQs and tutorials',
          type: 'link' as const,
          onClick: () => toast.info('Help center coming soon!')
        },
        {
          icon: Heart,
          label: 'About',
          description: 'Version 1.0.0',
          type: 'link' as const,
          onClick: () => toast.info('Faith Training v1.0.0 - Made with 💪 for believers putting in the work')
        },
        ...(!isPremium ? [{
          icon: ExternalLink,
          label: 'Hide Book Promotions',
          description: hideBookPromos ? 'Hidden' : 'Visible',
          type: 'toggle' as const,
          value: hideBookPromos,
          onChange: handleHidePromosToggle
        }] : []),
      ]
    }
  ];

  return (
    <PageLayout>
      <div className="px-4 pt-6 pb-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
        </div>

        {/* Premium Status Card */}
        <div className={cn(
          "p-4 rounded-xl border-2",
          isPremium 
            ? "bg-warning/10 border-warning"
            : "bg-muted border-border"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              isPremium ? "bg-warning/20" : "bg-muted"
            )}>
              {isPremium ? (
                <Crown className="h-6 w-6 text-warning" />
              ) : (
                <Sparkles className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              {isPremium ? (
                <>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-lg uppercase tracking-wider text-warning">
                      Premium Unlocked
                    </p>
                    <Check className="h-4 w-4 text-warning" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {premiumSource === 'book_code' ? 'Book Buyer - Lifetime Access' : 'Premium Member'}
                  </p>
                  {bookCodeUsed && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Code: {bookCodeUsed} 
                      {premiumActivatedAt && ` (Redeemed ${new Date(premiumActivatedAt).toLocaleDateString()})`}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="font-display text-lg uppercase tracking-wider text-foreground">
                    Free Account
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Unlock premium with a book code
                  </p>
                </>
              )}
            </div>
            {!isPremium && (
              <Button
                onClick={() => setBookCodeOpen(true)}
                className="btn-gym"
                size="sm"
              >
                <span className="font-display uppercase tracking-wider text-xs">Redeem</span>
              </Button>
            )}
          </div>
        </div>

        {/* Settings Groups */}
        {settingsGroups.map(group => (
          <div key={group.title} className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground px-1">{group.title}</h2>
            <div className="gym-card divide-y divide-border/50">
              {group.items.map((item) => (
                <div 
                  key={item.label} 
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={item.type === 'link' ? item.onClick : undefined}
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  {item.type === 'toggle' ? (
                    <Switch checked={item.value} onCheckedChange={item.onChange} />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Sign Out */}
        <Button 
          variant="outline" 
          className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>

        {/* Footer */}
        <div className="text-center space-y-2 pt-2">
          <p className="text-sm text-muted-foreground">
            Made with 💪 for believers putting in the work
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
              Terms of Service
            </Link>
          </div>
          <p className="text-xs text-muted-foreground/60">
            Version 1.0.0
          </p>
        </div>
      </div>

      {/* Session Time Dialog */}
      <Dialog open={sessionTimeOpen} onOpenChange={setSessionTimeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Session Time</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Preferred Time</Label>
              <Select value={sessionTime} onValueChange={setSessionTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5:00 AM">5:00 AM</SelectItem>
                  <SelectItem value="6:00 AM">6:00 AM</SelectItem>
                  <SelectItem value="7:00 AM">7:00 AM</SelectItem>
                  <SelectItem value="8:00 AM">8:00 AM</SelectItem>
                  <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                  <SelectItem value="6:00 PM">6:00 PM</SelectItem>
                  <SelectItem value="8:00 PM">8:00 PM</SelectItem>
                  <SelectItem value="9:00 PM">9:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSaveSessionTime} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Translation Dialog */}
      <Dialog open={translationOpen} onOpenChange={setTranslationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bible Translation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Translation</Label>
              <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KJV">KJV - King James Version</SelectItem>
                  <SelectItem value="NLT">NLT - New Living Translation</SelectItem>
                  <SelectItem value="CSB">CSB - Christian Standard Bible</SelectItem>
                  <SelectItem value="AMP">AMP - Amplified Bible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSaveTranslation} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input 
                value={profileName} 
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <Button onClick={handleSaveProfile} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Commitment Dialog */}
      <Dialog open={commitmentOpen} onOpenChange={setCommitmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Commitment Level</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Your Level</Label>
              <Select value={commitment} onValueChange={(v) => setCommitment(v as 'starter' | 'committed' | 'warrior')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter - Just beginning</SelectItem>
                  <SelectItem value="committed">Committed - Building consistency</SelectItem>
                  <SelectItem value="warrior">Warrior - All in, every day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSaveCommitment} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Book Code Redemption Dialog */}
      <Dialog open={bookCodeOpen} onOpenChange={(open) => {
        setBookCodeOpen(open);
        if (!open) {
          setBookCode('');
          setBookCodeError(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-xl uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-warning" />
              Unlock Premium
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground">
              Enter the unique code from your Faith Training Guide book to unlock lifetime premium features.
            </p>
            <div className="space-y-2">
              <Label>Book Code</Label>
              <Input 
                value={bookCode}
                onChange={(e) => {
                  setBookCodeError(null);
                  setBookCode(formatCodeInput(e.target.value));
                }}
                placeholder="FT-XXXXXX"
                className={cn(
                  "font-display text-lg uppercase tracking-widest text-center",
                  bookCodeError && "border-destructive"
                )}
                maxLength={9}
              />
              {bookCodeError && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {bookCodeError}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Find your code on the inside back cover of your book.
              </p>
            </div>
            <Button 
              onClick={handleRedeemCode} 
              className="w-full btn-gym"
              disabled={redeemLoading || bookCode.length < 9}
            >
              {redeemLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="font-display uppercase tracking-wider">Redeem Code</span>
              )}
            </Button>
            <div className="text-center">
              <button
                onClick={() => window.open('#', '_blank')} // Placeholder
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Don't have the book? Get it here
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
