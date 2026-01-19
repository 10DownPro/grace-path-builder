import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Bell, BookOpen, Clock, User, Moon, Shield, HelpCircle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingsGroups = [
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Daily Reminders',
          description: 'Get notified for your daily session',
          type: 'toggle' as const,
          value: notifications,
          onChange: setNotifications
        },
        {
          icon: Clock,
          label: 'Session Time',
          description: '6:00 AM',
          type: 'link' as const
        },
        {
          icon: BookOpen,
          label: 'Bible Translation',
          description: 'KJV',
          type: 'link' as const
        },
        {
          icon: Moon,
          label: 'Dark Mode',
          description: 'Switch to dark theme',
          type: 'toggle' as const,
          value: darkMode,
          onChange: setDarkMode
        },
      ]
    },
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Profile',
          description: 'Manage your account',
          type: 'link' as const
        },
        {
          icon: Shield,
          label: 'Privacy',
          description: 'Data and privacy settings',
          type: 'link' as const
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
          type: 'link' as const
        },
        {
          icon: Heart,
          label: 'About',
          description: 'Version 1.0.0',
          type: 'link' as const
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
            <div className="spiritual-card divide-y divide-border/50">
              {group.items.map((item, index) => (
                <div key={item.label} className="flex items-center gap-4 p-4">
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
        <Button variant="outline" className="w-full">
          Sign Out
        </Button>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Made with 🙏 for believers everywhere
        </p>
      </div>
    </PageLayout>
  );
}
