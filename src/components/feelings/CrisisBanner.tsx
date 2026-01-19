import { Phone, MessageCircle, ExternalLink, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CrisisResource } from '@/hooks/useFeelings';

interface CrisisBannerProps {
  resources: CrisisResource[];
  categoryName: string;
}

export function CrisisBanner({ resources, categoryName }: CrisisBannerProps) {
  // Find emergency resource (usually the main hotline)
  const emergencyResource = resources.find(r => r.is_emergency);
  const otherResources = resources.filter(r => !r.is_emergency);

  const handleCall = (number: string) => {
    window.location.href = `tel:${number.replace(/\D/g, '')}`;
  };

  const handleText = (number: string) => {
    window.location.href = `sms:${number.replace(/\D/g, '')}`;
  };

  return (
    <div className="sticky top-0 z-40 -mx-4 px-4 py-4 bg-gradient-to-r from-destructive via-destructive/90 to-primary border-b-4 border-destructive/80">
      <div className="max-w-lg mx-auto space-y-4">
        {/* Main Crisis Message */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 animate-pulse">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-display text-lg text-white uppercase tracking-wide">
              You're Not Alone
            </p>
            <p className="text-white/90 text-sm font-body mt-1">
              If you're in crisis, please reach out for help. Your life matters.
            </p>
          </div>
        </div>

        {/* Emergency Resource */}
        {emergencyResource && (
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
            <p className="font-display text-white text-sm uppercase tracking-wider mb-2">
              {emergencyResource.name}
            </p>
            <p className="text-white/80 text-xs mb-3 font-body">
              {emergencyResource.description}
            </p>
            <div className="flex gap-2">
              {emergencyResource.contact_info && (
                <>
                  <Button
                    onClick={() => handleCall(emergencyResource.contact_info!)}
                    className="flex-1 bg-white text-destructive hover:bg-white/90 font-display uppercase tracking-wide"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call {emergencyResource.contact_info}
                  </Button>
                  <Button
                    onClick={() => handleText(emergencyResource.contact_info!)}
                    variant="outline"
                    className="flex-1 border-white/50 text-white hover:bg-white/20 font-display uppercase tracking-wide"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Text
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Other Resources */}
        {otherResources.length > 0 && (
          <div className="space-y-2">
            <p className="text-white/70 text-xs font-display uppercase tracking-wider">
              Additional Support
            </p>
            <div className="grid grid-cols-2 gap-2">
              {otherResources.slice(0, 4).map((resource) => (
                <button
                  key={resource.id}
                  onClick={() => {
                    if (resource.contact_info?.startsWith('http')) {
                      window.open(resource.contact_info, '_blank');
                    } else if (resource.contact_info) {
                      handleCall(resource.contact_info);
                    }
                  }}
                  className="text-left p-2 rounded bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
                >
                  <p className="text-white text-xs font-medium truncate">
                    {resource.name}
                  </p>
                  <p className="text-white/60 text-[10px] truncate">
                    {resource.contact_info}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-white/50 text-[10px] text-center font-body">
          These verses provide spiritual support. For clinical mental health concerns, please consult a licensed professional.
        </p>
      </div>
    </div>
  );
}
