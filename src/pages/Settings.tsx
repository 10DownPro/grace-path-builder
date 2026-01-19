import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Bell, BookOpen, Clock, User, Moon, Shield, HelpCircle, Heart, LogOut, Sun } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'sonner';
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
  const { preferences: notifPrefs, scheduleNotification, permissionStatus, sendTestNotification } = useNotifications();
  
  // Settings state
  const [notifications, setNotifications] = useState(notifPrefs?.enabled ?? true);
  const [darkMode, setDarkMode] = useState(true);
  
  // Dialog states
  const [sessionTimeOpen, setSessionTimeOpen] = useState(false);
  const [translationOpen, setTranslationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [commitmentOpen, setCommitmentOpen] = useState(false);
  
  // Form states
  const [sessionTime, setSessionTime] = useState(profile?.preferred_time || '6:00 AM');
  const [selectedTranslation, setSelectedTranslation] = useState('KJV');
  const [profileName, setProfileName] = useState(profile?.name || '');
  const [commitment, setCommitment] = useState<'starter' | 'committed' | 'warrior'>(profile?.commitment as 'starter' | 'committed' | 'warrior' || 'committed');

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
    document.documentElement.classList.toggle('dark', enabled);
    document.documentElement.classList.toggle('light', !enabled);
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
          onClick: () => toast.info('Faith Training v1.0.0 - Made with 🙏 for believers')
        },
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
        <p className="text-center text-sm text-muted-foreground">
          Made with 🙏 for believers everywhere
        </p>
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
    </PageLayout>
  );
}
