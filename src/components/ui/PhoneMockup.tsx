import appPreview from '@/assets/app-preview-mobile.png';

interface PhoneMockupProps {
  className?: string;
}

export function PhoneMockup({ className = "" }: PhoneMockupProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Phone Frame */}
      <div className="relative mx-auto w-[260px] md:w-[300px]">
        {/* Phone outer shell */}
        <div className="relative rounded-[2.5rem] bg-gradient-to-b from-muted to-muted/80 p-2 shadow-2xl ring-1 ring-border">
          {/* Notch */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-background rounded-full z-10" />
          
          {/* Screen */}
          <div className="relative rounded-[2rem] overflow-hidden bg-background">
            <img 
              src={appPreview} 
              alt="FaithFit App Preview" 
              className="w-full aspect-[9/19.5] object-cover object-top"
            />
            
            {/* Screen reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
        
        {/* Side buttons */}
        <div className="absolute left-0 top-20 w-1 h-6 bg-muted rounded-l-sm" />
        <div className="absolute left-0 top-32 w-1 h-10 bg-muted rounded-l-sm" />
        <div className="absolute right-0 top-28 w-1 h-12 bg-muted rounded-r-sm" />
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-transparent to-warning/20 rounded-full" />
      </div>
    </div>
  );
}
