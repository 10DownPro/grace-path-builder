import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  text: string;
  hashtags?: string[];
}

const socialPlatforms = [
  {
    name: 'X (Twitter)',
    icon: '𝕏',
    getUrl: (text: string, hashtags: string[]) => 
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${hashtags.join(',')}`,
  },
  {
    name: 'Facebook',
    icon: '📘',
    getUrl: (text: string) => 
      `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`,
  },
  {
    name: 'WhatsApp',
    icon: '💬',
    getUrl: (text: string) => 
      `https://wa.me/?text=${encodeURIComponent(text)}`,
  },
  {
    name: 'Telegram',
    icon: '✈️',
    getUrl: (text: string) => 
      `https://t.me/share/url?text=${encodeURIComponent(text)}`,
  },
  {
    name: 'Email',
    icon: '📧',
    getUrl: (text: string, _: string[], title: string) => 
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text)}`,
  },
];

export function ShareDialog({ isOpen, onClose, title, text, hashtags = ['FaithTraining', 'BattleVerse'] }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleShare = (platform: typeof socialPlatforms[0]) => {
    const url = platform.getUrl(text, hashtags, title);
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
        onClose();
      } catch {
        // User cancelled
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg uppercase tracking-wide">Share</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Preview */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground line-clamp-3">{text}</p>
          </div>

          {/* Native Share (mobile) */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <Button onClick={handleNativeShare} className="w-full" variant="default">
              <ExternalLink className="h-4 w-4 mr-2" />
              Share via Device
            </Button>
          )}

          {/* Social Platform Buttons */}
          <div className="grid grid-cols-5 gap-2">
            {socialPlatforms.map((platform) => (
              <Button
                key={platform.name}
                variant="outline"
                size="icon"
                className="h-12 w-full text-xl hover:bg-primary/10 hover:border-primary"
                onClick={() => handleShare(platform)}
                title={platform.name}
              >
                {platform.icon}
              </Button>
            ))}
          </div>

          {/* Copy Button */}
          <Button 
            variant="secondary" 
            className="w-full" 
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
