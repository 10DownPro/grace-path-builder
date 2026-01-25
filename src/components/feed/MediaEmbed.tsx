import { ExternalLink, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaEmbedProps {
  mediaType?: string;
  mediaUrl?: string;
  contentData: Record<string, unknown>;
}

export function MediaEmbed({ mediaType, mediaUrl, contentData }: MediaEmbedProps) {
  // YouTube embed
  if (contentData.youtube_id || (mediaType === 'youtube' && mediaUrl)) {
    const videoId = contentData.youtube_id as string || extractYouTubeId(mediaUrl!);
    if (videoId) {
      return (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted mt-3">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
  }

  // Spotify embed
  if (contentData.spotify_id || (mediaType === 'spotify' && mediaUrl)) {
    const spotifyType = (contentData.spotify_type as string) || 'track';
    const spotifyId = contentData.spotify_id as string || extractSpotifyId(mediaUrl!);
    if (spotifyId) {
      return (
        <div className="rounded-lg overflow-hidden mt-3">
          <iframe
            src={`https://open.spotify.com/embed/${spotifyType}/${spotifyId}?theme=0`}
            width="100%"
            height="152"
            allow="encrypted-media"
            className="rounded-lg"
          />
        </div>
      );
    }
  }

  // Image gallery
  if (contentData.images && Array.isArray(contentData.images)) {
    const images = contentData.images as string[];
    return (
      <div className={cn(
        "grid gap-2 mt-3",
        images.length === 1 && "grid-cols-1",
        images.length === 2 && "grid-cols-2",
        images.length >= 3 && "grid-cols-3"
      )}>
        {images.map((url, index) => (
          <div 
            key={index} 
            className={cn(
              "relative rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity",
              images.length === 1 ? "aspect-video" : "aspect-square"
            )}
          >
            <img src={url} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    );
  }

  // Link preview
  if (contentData.link_preview && typeof contentData.link_preview === 'object') {
    const preview = contentData.link_preview as {
      title: string;
      description: string;
      image: string;
      domain: string;
      url: string;
    };
    
    return (
      <a 
        href={preview.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-3 rounded-lg border border-border bg-muted/30 overflow-hidden hover:border-primary/50 transition-colors"
      >
        {preview.image && (
          <div className="aspect-[2/1] bg-muted">
            <img src={preview.image} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-3">
          <p className="text-xs text-muted-foreground mb-1">{preview.domain}</p>
          <p className="font-medium text-sm line-clamp-2">{preview.title}</p>
          {preview.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{preview.description}</p>
          )}
        </div>
      </a>
    );
  }

  return null;
}

// Helper functions
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractSpotifyId(url: string): string | null {
  const match = url.match(/spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
  return match ? match[2] : null;
}