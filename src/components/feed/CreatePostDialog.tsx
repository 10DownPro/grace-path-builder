import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useCommunityFeed } from '@/hooks/useCommunityFeed';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Image, Link, Music, BookOpen, HandHeart, 
  X, Loader2, ExternalLink, Play, Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type MediaType = 'none' | 'image' | 'link' | 'youtube' | 'spotify' | 'verse' | 'prayer_request';

interface LinkPreview {
  title: string;
  description: string;
  image: string;
  domain: string;
  url: string;
}

export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  const { user } = useAuth();
  const { createPost, refetch } = useCommunityFeed();
  
  const [postText, setPostText] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('none');
  const [mediaUrl, setMediaUrl] = useState('');
  const [linkPreview, setLinkPreview] = useState<LinkPreview | null>(null);
  const [visibility, setVisibility] = useState<'public' | 'squad_only' | 'friends_only'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const resetForm = () => {
    setPostText('');
    setMediaType('none');
    setMediaUrl('');
    setLinkPreview(null);
    setVisibility('public');
    setUploadedImages([]);
  };

  const detectMediaType = (url: string): MediaType => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    }
    if (url.includes('spotify.com')) {
      return 'spotify';
    }
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return 'image';
    }
    return 'link';
  };

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const extractSpotifyUri = (url: string): { type: string; id: string } | null => {
    const match = url.match(/spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
    if (match) {
      return { type: match[1], id: match[2] };
    }
    return null;
  };

  const fetchLinkPreview = async (url: string) => {
    setIsLoadingPreview(true);
    try {
      // Simple preview using Open Graph - in production you'd use a backend service
      // For now, we'll create a basic preview from the URL
      const domain = new URL(url).hostname.replace('www.', '');
      setLinkPreview({
        title: domain,
        description: url,
        image: '',
        domain: domain,
        url: url
      });
    } catch (error) {
      console.error('Failed to fetch link preview:', error);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleMediaUrlChange = useCallback((url: string) => {
    setMediaUrl(url);
    if (!url) {
      setMediaType('none');
      setLinkPreview(null);
      return;
    }
    
    const detected = detectMediaType(url);
    setMediaType(detected);
    
    if (detected === 'link') {
      fetchLinkPreview(url);
    } else {
      setLinkPreview(null);
    }
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;
    
    if (uploadedImages.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setIsUploading(true);
    const newImages: string[] = [];

    for (const file of Array.from(files)) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max 2MB.`);
        continue;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('community-feed-images')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('community-feed-images')
        .getPublicUrl(data.path);

      newImages.push(urlData.publicUrl);
    }

    setUploadedImages(prev => [...prev, ...newImages]);
    setMediaType('image');
    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    if (uploadedImages.length === 1) {
      setMediaType('none');
    }
  };

  const handleSubmit = async () => {
    if (!postText.trim() && !mediaUrl && uploadedImages.length === 0) {
      toast.error('Please add some content to your post');
      return;
    }

    setIsSubmitting(true);

    try {
      const contentData: Record<string, unknown> = {
        text: postText,
      };

      // Add media data based on type
      if (mediaType === 'youtube') {
        const videoId = extractYouTubeId(mediaUrl);
        contentData.youtube_id = videoId;
        contentData.media_url = mediaUrl;
      } else if (mediaType === 'spotify') {
        const spotifyData = extractSpotifyUri(mediaUrl);
        contentData.spotify_type = spotifyData?.type;
        contentData.spotify_id = spotifyData?.id;
        contentData.media_url = mediaUrl;
      } else if (mediaType === 'link' && linkPreview) {
        contentData.link_preview = linkPreview;
        contentData.media_url = mediaUrl;
      } else if (mediaType === 'image' && uploadedImages.length > 0) {
        contentData.images = uploadedImages;
      } else if (mediaType === 'prayer_request') {
        contentData.is_prayer_request = true;
      }

      const { error } = await createPost(
        'testimony', // Using testimony as general user post type
        contentData,
        visibility
      );

      if (error) throw error;

      toast.success('Posted successfully! 🎉');
      resetForm();
      onOpenChange(false);
      refetch();
    } catch (error) {
      console.error('Post error:', error);
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMediaPreview = () => {
    if (mediaType === 'youtube') {
      const videoId = extractYouTubeId(mediaUrl);
      if (videoId) {
        return (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
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

    if (mediaType === 'spotify') {
      const spotifyData = extractSpotifyUri(mediaUrl);
      if (spotifyData) {
        return (
          <div className="rounded-lg overflow-hidden">
            <iframe
              src={`https://open.spotify.com/embed/${spotifyData.type}/${spotifyData.id}`}
              width="100%"
              height="152"
              allow="encrypted-media"
              className="rounded-lg"
            />
          </div>
        );
      }
    }

    if (mediaType === 'link' && linkPreview) {
      return (
        <div className="rounded-lg border border-border bg-muted/50 overflow-hidden">
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1">{linkPreview.domain}</p>
            <p className="font-medium text-sm line-clamp-2">{linkPreview.title}</p>
            <a 
              href={linkPreview.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary mt-2 inline-flex items-center gap-1 hover:underline"
            >
              Open link <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      );
    }

    if (mediaType === 'image' && uploadedImages.length > 0) {
      return (
        <div className={cn(
          "grid gap-2",
          uploadedImages.length === 1 && "grid-cols-1",
          uploadedImages.length === 2 && "grid-cols-2",
          uploadedImages.length >= 3 && "grid-cols-3"
        )}>
          {uploadedImages.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display uppercase tracking-wide">Create Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Text Input */}
          <div>
            <Textarea
              placeholder="What's on your heart?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right mt-1">
              {postText.length}/500
            </p>
          </div>

          {/* Attachment Tabs */}
          <Tabs defaultValue="none" className="w-full">
            <TabsList className="grid grid-cols-5 h-auto p-1">
              <TabsTrigger value="none" className="text-xs py-2 px-1">
                None
              </TabsTrigger>
              <TabsTrigger value="image" className="text-xs py-2 px-1">
                <Image className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="link" className="text-xs py-2 px-1">
                <Link className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="music" className="text-xs py-2 px-1">
                <Music className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="prayer" className="text-xs py-2 px-1">
                <HandHeart className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="none" className="mt-4">
              <p className="text-sm text-muted-foreground text-center py-4">
                No attachments - text only
              </p>
            </TabsContent>

            <TabsContent value="image" className="mt-4 space-y-3">
              <Label className="text-sm">Upload Images (max 5)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={isUploading || uploadedImages.length >= 5}
                />
                <label
                  htmlFor="image-upload"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-colors",
                    "bg-muted hover:bg-muted/80 text-sm",
                    (isUploading || uploadedImages.length >= 5) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Upload
                </label>
                <span className="text-xs text-muted-foreground">
                  {uploadedImages.length}/5 images
                </span>
              </div>
            </TabsContent>

            <TabsContent value="link" className="mt-4 space-y-3">
              <Label className="text-sm">Paste URL</Label>
              <Input
                type="url"
                placeholder="https://..."
                value={mediaUrl}
                onChange={(e) => handleMediaUrlChange(e.target.value)}
              />
              {isLoadingPreview && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading preview...
                </div>
              )}
            </TabsContent>

            <TabsContent value="music" className="mt-4 space-y-3">
              <Label className="text-sm">YouTube or Spotify URL</Label>
              <Input
                type="url"
                placeholder="Paste YouTube or Spotify link..."
                value={mediaUrl}
                onChange={(e) => handleMediaUrlChange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Supports YouTube videos and Spotify tracks/playlists
              </p>
            </TabsContent>

            <TabsContent value="prayer" className="mt-4">
              <div 
                className={cn(
                  "p-4 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
                  mediaType === 'prayer_request' 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => setMediaType(mediaType === 'prayer_request' ? 'none' : 'prayer_request')}
              >
                <div className="flex items-center gap-3">
                  <HandHeart className={cn(
                    "h-8 w-8",
                    mediaType === 'prayer_request' ? "text-primary" : "text-muted-foreground"
                  )} />
                  <div>
                    <p className="font-medium text-sm">Mark as Prayer Request</p>
                    <p className="text-xs text-muted-foreground">
                      Add "Pray with me?" button to your post
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Media Preview */}
          {renderMediaPreview()}

          {/* Visibility */}
          <div className="flex items-center gap-3">
            <Label className="text-sm">Visibility:</Label>
            <Select value={visibility} onValueChange={(v: typeof visibility) => setVisibility(v)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="squad_only">Squad Only</SelectItem>
                <SelectItem value="friends_only">Friends Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || (!postText.trim() && !mediaUrl && uploadedImages.length === 0)}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}