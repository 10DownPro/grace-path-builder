import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Share, Plus, Smartphone, Bell, Wifi } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const { requestPermission, permissionStatus, sendTestNotification } = useNotifications();

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
      toast.success('App installed successfully!');
    }

    setDeferredPrompt(null);
  };

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast.success('Notifications enabled!');
      sendTestNotification();
    } else {
      toast.error('Notification permission denied');
    }
  };

  return (
    <PageLayout>
      <div className="container max-w-md mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl uppercase tracking-wide">Install App</h1>
          <p className="text-muted-foreground">
            Get the full experience with push notifications and offline access
          </p>
        </div>

        {/* Install Status */}
        {isInstalled ? (
          <Card className="border-success/50 bg-success/10">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
                <Smartphone className="h-8 w-8 text-success" />
              </div>
              <h3 className="font-display text-xl text-success">App Installed!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                You're running Grace Training as an app
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Android / Chrome Install */}
            {deferredPrompt && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    Install App
                  </CardTitle>
                  <CardDescription>
                    Add to your home screen for the best experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleInstall} className="w-full btn-gym">
                    <Plus className="h-4 w-4 mr-2" />
                    Install Grace Training
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* iOS Instructions */}
            {isIOS && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share className="h-5 w-5 text-primary" />
                    Install on iPhone/iPad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        1
                      </div>
                      <p className="text-sm">
                        Tap the <Share className="h-4 w-4 inline mx-1" /> Share button in Safari
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        2
                      </div>
                      <p className="text-sm">
                        Scroll down and tap "Add to Home Screen"
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        3
                      </div>
                      <p className="text-sm">
                        Tap "Add" in the top right corner
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Desktop Instructions */}
            {!isIOS && !deferredPrompt && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    Install from Browser
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Look for the install icon in your browser's address bar, or use the browser menu to "Install App" or "Add to Home Screen".
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Push Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Push Notifications
            </CardTitle>
            <CardDescription>
              Get daily reminders to keep your training streak going
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {permissionStatus === 'granted' ? (
              <div className="flex items-center gap-2 text-success">
                <Bell className="h-4 w-4" />
                <span className="text-sm">Notifications enabled</span>
              </div>
            ) : permissionStatus === 'denied' ? (
              <p className="text-sm text-destructive">
                Notifications are blocked. Please enable them in your browser settings.
              </p>
            ) : (
              <Button onClick={handleEnableNotifications} variant="outline" className="w-full">
                <Bell className="h-4 w-4 mr-2" />
                Enable Notifications
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Offline Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-primary" />
              Offline Access
            </CardTitle>
            <CardDescription>
              Access your training even without internet connection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Once installed, Grace Training works offline. Your progress syncs when you're back online.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
