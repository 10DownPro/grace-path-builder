import { useState } from 'react';
import { Bookmark, BookmarkCheck, Share2, RefreshCw, ChevronRight, Sparkles, Users, ImagePlus, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { FeelingVerse, SupportMessage } from '@/hooks/useFeelings';
import { ShareVerseToFeedDialog } from '@/components/feed/ShareVerseToFeedDialog';
import { useVerseImage } from '@/hooks/useVerseImage';
import { useNavigate } from 'react-router-dom';
interface VerseDisplayProps {
  verses: FeelingVerse[];
  supportMessage: SupportMessage | null;
  savedVerseIds: Set<string>;
  onSaveVerse: (verseId: string) => void;
  onUnsaveVerse: (verseId: string) => void;
  onRefresh: () => void;
  onLoadMore: () => void;
  loading?: boolean;
  hasMore?: boolean;
}

export function VerseDisplay({
  verses,
  supportMessage,
  savedVerseIds,
  onSaveVerse,
  onUnsaveVerse,
  onRefresh,
  onLoadMore,
  loading,
  hasMore
}: VerseDisplayProps) {
  const navigate = useNavigate();
  const [expandedVerse, setExpandedVerse] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [verseToShare, setVerseToShare] = useState<FeelingVerse | null>(null);
  const [generatingImageFor, setGeneratingImageFor] = useState<string | null>(null);
  const { generateImage, selectThemeFromVerse, getFallbackGradient, loading: imageLoading } = useVerseImage();

  const handleNativeShare = async (verse: FeelingVerse) => {
    const text = `"${verse.text_kjv}"\n\n— ${verse.reference}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: verse.reference,
          text
        });
      } catch (err) {
        // User cancelled or share failed
        copyToClipboard(text);
      }
    } else {
      copyToClipboard(text);
    }
  };

  const handleShareToFeed = (verse: FeelingVerse) => {
    setVerseToShare(verse);
    setShareDialogOpen(true);
  };

  const handleGenerateImage = async (verse: FeelingVerse) => {
    setGeneratingImageFor(verse.id);
    const theme = selectThemeFromVerse(verse.text_kjv || '');
    const result = await generateImage(verse.text_kjv || '', verse.reference, theme);
    setGeneratingImageFor(null);
    
    if (result) {
      // Open the image in a new tab or show it in a modal
      const link = document.createElement('a');
      link.href = result.imageUrl;
      link.download = `${verse.reference.replace(/[^a-zA-Z0-9]/g, '_')}_verse.png`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Verse image created! 🖼️');
    } else {
      toast.error('Failed to generate image');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Verse copied to clipboard');
  };

  const toggleSave = (verse: FeelingVerse) => {
    if (savedVerseIds.has(verse.id)) {
      onUnsaveVerse(verse.id);
      toast.success('Removed from Battle Verses');
    } else {
      onSaveVerse(verse.id);
      toast.success('Added to Battle Verses 🗡️');
    }
  };

  const handleReadInBible = (verse: FeelingVerse) => {
    // Navigate to Bible page - it will show book selector, user can find the chapter
    navigate('/bible');
    toast.success(`Opening Bible to read ${verse.book} ${verse.chapter}`);
  };

  return (
    <div className="space-y-4">
      {/* Support Message */}
      {supportMessage && (
        <div className="gym-card p-5 border-l-4 border-l-primary bg-gradient-to-r from-primary/10 to-transparent">
          <p className="font-body text-lg text-foreground leading-relaxed">
            {supportMessage.message_text}
          </p>
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">
          {verses.length} Verses For Your Battle
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="text-primary hover:text-primary/80"
        >
          <RefreshCw className={cn("h-4 w-4 mr-1", loading && "animate-spin")} />
          <span className="font-display text-xs uppercase">Refresh</span>
        </Button>
      </div>

      {/* Verses List */}
      <div className="space-y-3 stagger-children">
        {verses.map((verse) => {
          const isSaved = savedVerseIds.has(verse.id);
          const isExpanded = expandedVerse === verse.id;

          return (
            <div
              key={verse.id}
              className={cn(
                "gym-card overflow-hidden transition-all duration-300",
                verse.is_power_verse && "ring-1 ring-primary/30",
                isExpanded && "ring-2 ring-primary"
              )}
            >
              {/* Power Verse Indicator */}
              {verse.is_power_verse && (
                <div className="flex items-center gap-1 px-4 py-1.5 bg-primary/10 border-b border-primary/20">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-display uppercase tracking-wider text-primary">
                    Power Verse
                  </span>
                </div>
              )}

              {/* Verse Content */}
              <button
                onClick={() => setExpandedVerse(isExpanded ? null : verse.id)}
                className="w-full p-4 text-left"
              >
                {/* Reference */}
                <p className="font-display text-sm text-primary uppercase tracking-wide mb-2">
                  {verse.reference}
                </p>

                {/* Verse Text */}
                <p className={cn(
                  "font-body text-base text-foreground leading-relaxed",
                  !isExpanded && verse.text_kjv && verse.text_kjv.length > 200 && "line-clamp-4"
                )}>
                  "{verse.text_kjv}"
                </p>

                {!isExpanded && verse.text_kjv && verse.text_kjv.length > 200 && (
                  <span className="text-primary text-sm mt-2 inline-flex items-center gap-1">
                    Read more <ChevronRight className="h-3 w-3" />
                  </span>
                )}
              </button>

              {/* Actions */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSave(verse)}
                    className={cn(
                      "h-8 px-3",
                      isSaved ? "text-primary" : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="h-4 w-4 mr-1" />
                    ) : (
                      <Bookmark className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-xs font-display uppercase">
                      {isSaved ? 'Saved' : 'Save'}
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNativeShare(verse)}
                    className="h-8 px-3 text-muted-foreground hover:text-foreground"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    <span className="text-xs font-display uppercase">Copy</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShareToFeed(verse)}
                    className="h-8 px-3 text-muted-foreground hover:text-primary"
                  >
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-xs font-display uppercase">Feed</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGenerateImage(verse)}
                    disabled={generatingImageFor === verse.id}
                    className="h-8 px-3 text-muted-foreground hover:text-primary"
                  >
                    <ImagePlus className={cn("h-4 w-4 mr-1", generatingImageFor === verse.id && "animate-pulse")} />
                    <span className="text-xs font-display uppercase">
                      {generatingImageFor === verse.id ? 'Creating...' : 'Image'}
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReadInBible(verse)}
                    className="h-8 px-3 text-muted-foreground hover:text-primary"
                  >
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span className="text-xs font-display uppercase">Read More</span>
                  </Button>
                </div>

                {/* Book info */}
                <span className="text-[10px] text-muted-foreground font-display uppercase">
                  {verse.book} {verse.chapter}
                </span>
              </div>

              {/* Context Note (if expanded) */}
              {isExpanded && verse.context_note && (
                <div className="px-4 py-3 border-t border-border bg-muted/50">
                  <p className="text-xs text-muted-foreground font-body italic">
                    {verse.context_note}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Load More */}
      {hasMore && (
        <Button
          variant="outline"
          onClick={onLoadMore}
          disabled={loading}
          className="w-full h-12 border-2 border-border hover:border-primary/50 font-display uppercase tracking-wide"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : null}
          Show Me More
        </Button>
      )}

      {/* Footer Disclaimer */}
      <p className="text-center text-[10px] text-muted-foreground py-4 font-body">
        Scripture from the King James Version • Tap a verse to expand
      </p>

      {/* Share to Feed Dialog */}
      {verseToShare && (
        <ShareVerseToFeedDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          verse={{
            reference: verseToShare.reference,
            text: verseToShare.text_kjv || '',
            book: verseToShare.book,
            chapter: verseToShare.chapter,
          }}
        />
      )}
    </div>
  );
}
