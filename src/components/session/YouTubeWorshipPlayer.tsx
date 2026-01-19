import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Bookmark, BookmarkCheck, Clock, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { worshipPlaylist, WorshipVideo } from '@/lib/sampleData';
import { cn } from '@/lib/utils';

interface YouTubeWorshipPlayerProps {
  onTimeUpdate?: (elapsed: number) => void;
}

export function YouTubeWorshipPlayer({ onTimeUpdate }: YouTubeWorshipPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [elapsedTime, setElapsedTime] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentVideo = worshipPlaylist[currentIndex];

  // Simulate elapsed time tracking (actual tracking would require YouTube API)
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          onTimeUpdate?.(newTime);
          return newTime;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, onTimeUpdate]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % worshipPlaylist.length);
    setElapsedTime(0);
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => prev === 0 ? worshipPlaylist.length - 1 : prev - 1);
    setElapsedTime(0);
  };

  const handleSelectVideo = (index: number) => {
    setCurrentIndex(index);
    setElapsedTime(0);
    setIsPlaying(true);
    setShowPlaylist(false);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  // Build YouTube embed URL with parameters
  const embedUrl = `https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1&showinfo=0`;

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black border-2 border-border">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={currentVideo.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        
        {/* Overlay when not playing */}
        {!isPlaying && (
          <div 
            className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer"
            onClick={handlePlay}
          >
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center glow-accent">
              <Play className="h-10 w-10 text-primary-foreground ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Now Playing Info */}
      <div className="flex items-center gap-4">
        <img 
          src={currentVideo.thumbnailUrl} 
          alt={currentVideo.title}
          className="w-14 h-14 rounded-lg object-cover border-2 border-border"
        />
        <div className="flex-1 min-w-0">
          <p className="font-display text-lg text-foreground uppercase tracking-wide truncate">
            {currentVideo.title}
          </p>
          <p className="text-sm text-muted-foreground">{currentVideo.artist}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleFavorite(currentVideo.id)}
          className={cn("hover:bg-primary/10", favorites.has(currentVideo.id) && "text-primary")}
        >
          {favorites.has(currentVideo.id) ? (
            <BookmarkCheck className="h-5 w-5 fill-current" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Timer Display */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="font-display">{formatTime(elapsedTime)}</span>
          <span className="text-muted-foreground/50">/</span>
          <span>{currentVideo.duration}</span>
        </div>
        <span className="text-xs text-primary font-display uppercase">
          {currentIndex + 1} / {worshipPlaylist.length}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          className="hover:bg-muted"
        >
          <SkipBack className="h-5 w-5" />
        </Button>

        <Button
          variant="default"
          size="icon"
          className="w-14 h-14 rounded-full btn-gym"
          onClick={isPlaying ? handlePause : handlePlay}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          className="hover:bg-muted"
        >
          <SkipForward className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="hover:bg-muted"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Playlist Toggle */}
      <Button
        variant="outline"
        onClick={() => setShowPlaylist(!showPlaylist)}
        className="w-full border-2 border-border hover:border-primary"
      >
        <Music className="h-4 w-4 mr-2" />
        {showPlaylist ? 'Hide Playlist' : 'Show Playlist'}
      </Button>

      {/* Playlist */}
      {showPlaylist && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {worshipPlaylist.map((video, index) => (
            <button
              key={video.id}
              onClick={() => handleSelectVideo(index)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-all",
                index === currentIndex 
                  ? "bg-primary/20 border-2 border-primary" 
                  : "bg-muted/30 border-2 border-transparent hover:border-primary/50"
              )}
            >
              <div className="relative">
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title}
                  className="w-12 h-12 rounded-md object-cover"
                />
                {index === currentIndex && isPlaying && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  </div>
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className={cn(
                  "font-medium text-sm truncate",
                  index === currentIndex ? "text-primary" : "text-foreground"
                )}>
                  {video.title}
                </p>
                <p className="text-xs text-muted-foreground">{video.artist}</p>
              </div>
              <span className="text-xs text-muted-foreground">{video.duration}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(video.id);
                }}
              >
                {favorites.has(video.id) ? (
                  <BookmarkCheck className="h-4 w-4 text-primary fill-current" />
                ) : (
                  <Bookmark className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
