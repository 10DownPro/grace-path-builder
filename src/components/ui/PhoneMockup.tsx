import appPreview from '@/assets/app-preview-mobile.png';

interface PhoneMockupProps {
  className?: string;
}

export function PhoneMockup({ className = "" }: PhoneMockupProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Phone Frame */}
      <div className="relative mx-auto w-[280px] md:w-[320px]">
        {/* Phone outer shell */}
        <div className="relative rounded-[3rem] bg-gradient-to-b from-zinc-700 to-zinc-900 p-3 shadow-2xl">
          {/* Phone inner bezel */}
          <div className="relative rounded-[2.5rem] bg-black overflow-hidden">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-b-2xl z-10" />
            
            {/* Screen content */}
            <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.3rem]">
              <img 
                src={appPreview} 
                alt="FaithFit App Preview" 
                className="w-full h-full object-cover object-top"
              />
              
              {/* Screen reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
        
        {/* Side buttons */}
        <div className="absolute left-0 top-24 w-1 h-8 bg-zinc-700 rounded-l-sm" />
        <div className="absolute left-0 top-36 w-1 h-12 bg-zinc-700 rounded-l-sm" />
        <div className="absolute left-0 top-52 w-1 h-12 bg-zinc-700 rounded-l-sm" />
        <div className="absolute right-0 top-32 w-1 h-16 bg-zinc-700 rounded-r-sm" />
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-transparent to-warning/30 rounded-full" />
      </div>
    </div>
  );
}
