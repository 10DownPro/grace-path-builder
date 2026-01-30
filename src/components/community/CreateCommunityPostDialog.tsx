import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useCommunityPosts, PostType, PrayerUrgency, PollData } from '@/hooks/useCommunityPosts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Image, Link, Music, HandHeart, BarChart3,
  X, Loader2, Upload, Plus, Trash2, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateCommunityPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PostTab = 'text' | 'prayer' | 'image' | 'music' | 'link' | 'poll';

export function CreateCommunityPostDialog({ open, onOpenChange }: CreateCommunityPostDialogProps) {
  const { user } = useAuth();
  const { createPost, refetch } = useCommunityPosts();
  
  const [activeTab, setActiveTab] = useState<PostTab>('text');
  const [postText, setPostText] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [visibility, setVisibility] = useState<'public' | 'squad_only' | 'friends_only'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Prayer request specific
  const [prayerUrgency, setPrayerUrgency] = useState<PrayerUrgency>('routine');
  
  // Poll specific
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState<PollData['duration']>('24h');
  
  // Tags
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const resetForm = () => {
    setPostText('');
    setMediaUrl('');
    setUploadedImages([]);
    setVisibility('public');
    setPrayerUrgency('routine');
    setPollQuestion('');
    setPollOptions(['', '']);
    setPollDuration('24h');
    setTagInput('');
    setTags([]);
    setActiveTab('text');
  };

  const detectMediaType = (url: string): 'youtube' | 'spotify' | 'link' => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('spotify.com')) return 'spotify';
    return 'link';
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;
    
    if (uploadedImages.length + files.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }

    setIsUploading(true);
    const newImages: string[] = [];

    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max 5MB.`);
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
    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const addPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleSubmit = async () => {
    if (!postText.trim() && activeTab !== 'poll') {
      toast.error('Please add some content to your post');
      return;
    }

    if (activeTab === 'poll') {
      if (!pollQuestion.trim()) {
        toast.error('Please add a poll question');
        return;
      }
      const validOptions = pollOptions.filter(o => o.trim());
      if (validOptions.length < 2) {
        toast.error('Please add at least 2 options');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let postType: PostType = 'text';
      let contentData: Record<string, unknown> = {};
      let mediaType: string | undefined;

      switch (activeTab) {
        case 'text':
          postType = 'text';
          break;
          
        case 'prayer':
          postType = 'prayer_request';
          contentData.is_prayer_request = true;
          break;
          
        case 'image':
          postType = 'image';
          contentData.images = uploadedImages;
          break;
          
        case 'music':
        case 'link':
          const detected = detectMediaType(mediaUrl);
          postType = detected === 'youtube' || detected === 'spotify' ? 'music' : 'link';
          mediaType = detected;
          
          if (detected === 'youtube') {
            const match = mediaUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
            contentData.youtube_id = match?.[1];
          } else if (detected === 'spotify') {
            const match = mediaUrl.match(/spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
            if (match) {
              contentData.spotify_type = match[1];
              contentData.spotify_id = match[2];
            }
          } else {
            try {
              const domain = new URL(mediaUrl).hostname.replace('www.', '');
              contentData.link_preview = { url: mediaUrl, domain, title: domain };
            } catch {}
          }
          break;
          
        case 'poll':
          postType = 'poll';
          break;
      }

      await createPost(postType, postText, {
        mediaType,
        mediaUrl: mediaUrl || undefined,
        contentData,
        visibility,
        prayerUrgency: activeTab === 'prayer' ? prayerUrgency : undefined,
        pollData: activeTab === 'poll' ? {
          question: pollQuestion,
          options: pollOptions.filter(o => o.trim()).map(text => ({ text, votes: 0 })),
          duration: pollDuration,
          anonymous: false
        } : undefined,
        tags
      });

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display uppercase tracking-wide">Create Post</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PostTab)} className="w-full">
          <TabsList className="grid grid-cols-6 h-auto p-1">
            <TabsTrigger value="text" className="text-xs py-2 px-1">💭</TabsTrigger>
            <TabsTrigger value="prayer" className="text-xs py-2 px-1">🙏</TabsTrigger>
            <TabsTrigger value="image" className="text-xs py-2 px-1"><Image className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="music" className="text-xs py-2 px-1"><Music className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="link" className="text-xs py-2 px-1"><Link className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="poll" className="text-xs py-2 px-1"><BarChart3 className="h-4 w-4" /></TabsTrigger>
          </TabsList>

          {/* Text Post */}
          <TabsContent value="text" className="mt-4 space-y-4">
            <Textarea
              placeholder="What's on your heart?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground text-right">{postText.length}/2000</p>
          </TabsContent>

          {/* Prayer Request */}
          <TabsContent value="prayer" className="mt-4 space-y-4">
            <div className="space-y-3">
              <Label>Urgency Level</Label>
              <RadioGroup value={prayerUrgency} onValueChange={(v) => setPrayerUrgency(v as PrayerUrgency)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="routine" id="routine" />
                  <Label htmlFor="routine" className="font-normal">Routine</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="urgent" id="urgent" />
                  <Label htmlFor="urgent" className="font-normal text-orange-500">Urgent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="crisis" id="crisis" />
                  <Label htmlFor="crisis" className="font-normal text-red-500 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" /> Crisis
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <Textarea
              placeholder="Share your prayer request..."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground text-right">{postText.length}/2000</p>
          </TabsContent>

          {/* Image Post */}
          <TabsContent value="image" className="mt-4 space-y-4">
            <Label>Upload Images (max 4, 5MB each)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={isUploading || uploadedImages.length >= 4}
              />
              <label
                htmlFor="image-upload"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-colors",
                  "bg-muted hover:bg-muted/80 text-sm",
                  (isUploading || uploadedImages.length >= 4) && "opacity-50 cursor-not-allowed"
                )}
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Upload
              </label>
              <span className="text-xs text-muted-foreground">{uploadedImages.length}/4</span>
            </div>

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
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
            )}
            
            <Textarea
              placeholder="Add a caption..."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
          </TabsContent>

          {/* Music/Audio */}
          <TabsContent value="music" className="mt-4 space-y-4">
            <Label>YouTube or Spotify URL</Label>
            <Input
              type="url"
              placeholder="Paste YouTube or Spotify link..."
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Supports YouTube videos and Spotify tracks/playlists
            </p>
            
            <Textarea
              placeholder="Why are you sharing this? (optional)"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
          </TabsContent>

          {/* Link */}
          <TabsContent value="link" className="mt-4 space-y-4">
            <Label>Link URL</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
            />
            
            <Textarea
              placeholder="Add your commentary..."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
          </TabsContent>

          {/* Poll */}
          <TabsContent value="poll" className="mt-4 space-y-4">
            <div>
              <Label>Poll Question</Label>
              <Input
                placeholder="What do you want to ask?"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                maxLength={200}
                className="mt-1"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Options (2-6)</Label>
              {pollOptions.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updatePollOption(index, e.target.value)}
                    maxLength={100}
                  />
                  {pollOptions.length > 2 && (
                    <Button variant="ghost" size="icon" onClick={() => removePollOption(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {pollOptions.length < 6 && (
                <Button variant="outline" size="sm" onClick={addPollOption}>
                  <Plus className="h-4 w-4 mr-1" /> Add Option
                </Button>
              )}
            </div>
            
            <div>
              <Label>Poll Duration</Label>
              <Select value={pollDuration} onValueChange={(v) => setPollDuration(v as PollData['duration'])}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 hours</SelectItem>
                  <SelectItem value="3d">3 days</SelectItem>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="none">No expiration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Textarea
              placeholder="Add context for your poll (optional)"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="min-h-[60px] resize-none"
              maxLength={300}
            />
          </TabsContent>
        </Tabs>

        {/* Tags */}
        <div className="space-y-2 pt-4 border-t">
          <Label>Tags (max 5)</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1"
            />
            <Button variant="outline" onClick={addTag} disabled={tags.length >= 5}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  #{tag}
                  <button onClick={() => removeTag(tag)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

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
          <Button variant="outline" onClick={() => { resetForm(); onOpenChange(false); }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Posting...</>
            ) : (
              'Post'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
