import { useState, useEffect } from 'react';
import { Shield, Loader2, RefreshCw, Download, Share2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useScripture, BibleTranslation, translationNames } from '@/hooks/useScripture';
import { useVerseImage } from '@/hooks/useVerseImage';
import { Scripture } from '@/types/faith';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function BattleVerse() {
  const [translation, setTranslation] = useState<BibleTranslation>('kjv');
  const [scripture, setScripture] = useState<Scripture | null>(null);
  const { fetchDailyVerse, loading, error } = useScripture();
  const { 
    generateImage, 
    getFallbackGradient, 
    selectThemeFromVerse,
    loading: imageLoading, 
    imageData 
  } = useVerseImage();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<string>('iron');

  useEffect(() => {
    loadVerse();
  }, [translation]);

  const loadVerse = async () => {
    const verse = await fetchDailyVerse(translation);
    if (verse) {
      setScripture(verse);
      // Determine theme from verse content
      const theme = selectThemeFromVerse(verse.text);
      setCurrentTheme(theme);
      setBackgroundImage(null); // Reset to show gradient initially
    }
  };

  const handleGenerateBackground = async () => {
    if (!scripture) return;
    
    toast.info('Generating battle background...', { duration: 2000 });
    const result = await generateImage(scripture.text, scripture.reference, currentTheme);
    
    if (result?.imageUrl) {
      setBackgroundImage(result.imageUrl);
      toast.success('Background generated! 💪');
    } else {
      toast.error('Failed to generate background. Using fallback.');
    }
  };

  const handleShare = async () => {
    if (!scripture) return;
    
    const shareText = `"${scripture.text}" — ${scripture.reference}\n\n#FaithTraining #BattleVerse`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Battle Verse',
          text: shareText,
        });
      } catch (err) {
        // User cancelled or share failed
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Verse copied to clipboard!');
  };

  const handleDownload = async () => {
    if (!scripture || !backgroundImage) {
      toast.error('Generate a background first!');
      return;
    }

    try {
      // Create a link to download the image
      const link = document.createElement('a');
      link.href = backgroundImage;
      link.download = `battle-verse-${scripture.reference.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded!');
    } catch {
      toast.error('Failed to download image');
    }
  };

  const backgroundStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: getFallbackGradient(currentTheme) };

  return (
    <div className="gym-card overflow-hidden relative">
      {/* Header */}
      <div className="bg-primary/10 px-5 py-4 border-b-2 border-border flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-primary" />
          <h3 className="font-display text-xl text-primary uppercase tracking-wide">
            Battle Verse
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Select value={translation} onValueChange={(v) => setTranslation(v as BibleTranslation)}>
            <SelectTrigger className="w-20 h-8 text-xs bg-muted border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(translationNames) as BibleTranslation[]).map((t) => (
                <SelectItem key={t} value={t}>
                  {t.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content with Background */}
      <div 
        className={cn(
          "relative min-h-[280px] transition-all duration-500",
          backgroundImage && "shadow-inner"
        )}
        style={backgroundStyle}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        
        {/* Content */}
        <div className="relative z-10 p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="font-display text-sm text-foreground/70 uppercase">
                Loading ammo...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-sm text-foreground/70">Failed to load verse</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadVerse}
                className="border-2 border-primary/50 hover:border-primary bg-black/30"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : scripture ? (
            <div className="space-y-5">
              {/* Verse Text */}
              <div className="relative">
                <span className="absolute -left-1 -top-3 text-7xl text-primary/40 font-display select-none">
                  "
                </span>
                <p className="text-xl font-bold text-white leading-relaxed pl-8 pr-4 drop-shadow-lg">
                  {scripture.text}
                </p>
                <span className="absolute -right-1 bottom-0 text-7xl text-primary/40 font-display rotate-180 select-none">
                  "
                </span>
              </div>
              
              {/* Reference */}
              <p className="font-display text-lg text-primary uppercase tracking-widest pl-8 drop-shadow-md">
                — {scripture.reference}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 pl-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateBackground}
                  disabled={imageLoading}
                  className="border-2 border-primary/60 hover:border-primary bg-black/40 hover:bg-primary/20 text-foreground"
                >
                  {imageLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  {imageLoading ? 'Generating...' : 'Generate Art'}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="hover:bg-primary/20 text-foreground"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                
                {backgroundImage && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    className="hover:bg-primary/20 text-foreground"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-foreground/60 py-8">No verse available</p>
          )}
        </div>

        {/* Theme Badge */}
        {scripture && (
          <div className="absolute top-4 right-4 z-10">
            <span className="px-2 py-1 rounded-md bg-black/50 text-xs font-display text-primary uppercase tracking-wider">
              {currentTheme}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
