import { useTestimonies, TESTIMONY_TYPE_CONFIG } from '@/hooks/useTestimonies';
import { Button } from '@/components/ui/button';
import { Star, BookOpen, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TestimonyOfTheWeekCard() {
  const { featuredTestimony, loading } = useTestimonies();
  const navigate = useNavigate();

  if (loading || !featuredTestimony) return null;

  const typeConfig = TESTIMONY_TYPE_CONFIG[featuredTestimony.testimony_type];
  const truncatedText = featuredTestimony.testimony_text.length > 150
    ? featuredTestimony.testimony_text.slice(0, 150) + '...'
    : featuredTestimony.testimony_text;

  const totalReactions = Object.values(featuredTestimony.reaction_counts || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="gym-card p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-warning/10 rounded-bl-full" />
      
      <div className="relative space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-warning fill-current" />
          <span className="font-display text-sm uppercase tracking-wider text-warning">
            Testimony of the Week
          </span>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-success" />
          <h3 className="font-display text-base uppercase tracking-wide text-foreground">
            "{featuredTestimony.title}"
          </h3>
        </div>

        {/* Author */}
        <p className="text-sm text-muted-foreground">
          by @{featuredTestimony.user_name}
        </p>

        {/* Preview */}
        <p className="text-sm text-foreground/80 leading-relaxed">
          "{truncatedText}"
        </p>

        {/* Reactions */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>🙏 Amen {featuredTestimony.reaction_counts?.amen || 0}</span>
          <span>🔥 {featuredTestimony.reaction_counts?.fire || 0}</span>
        </div>

        {/* CTA */}
        <Button 
          variant="outline" 
          className="w-full border-success/50 text-success hover:bg-success/10"
          onClick={() => navigate('/feed?tab=testimonies')}
        >
          Read Full Testimony
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
