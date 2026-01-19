import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Swords, Flame, BookOpen, Heart, Clock } from 'lucide-react';

interface CreateChallengeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    challengeType: string,
    challengeName: string,
    targetValue: number,
    durationDays: number,
    description?: string
  ) => void;
}

const CHALLENGE_PRESETS = [
  {
    type: 'streak',
    name: '7-Day Streak Race',
    description: 'First to complete 7 consecutive days wins!',
    targetValue: 7,
    durationDays: 14,
    icon: Flame
  },
  {
    type: 'sessions',
    name: 'Session Sprint',
    description: 'Complete the most sessions in one week',
    targetValue: 7,
    durationDays: 7,
    icon: Clock
  },
  {
    type: 'prayers',
    name: 'Prayer Warrior Challenge',
    description: 'Log the most prayers in 2 weeks',
    targetValue: 14,
    durationDays: 14,
    icon: Heart
  },
  {
    type: 'verses',
    name: 'Scripture Showdown',
    description: 'Save the most verses in one week',
    targetValue: 20,
    durationDays: 7,
    icon: BookOpen
  }
];

export function CreateChallengeDialog({ open, onOpenChange, onSubmit }: CreateChallengeDialogProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customType, setCustomType] = useState('sessions');
  const [customTarget, setCustomTarget] = useState(7);
  const [customDuration, setCustomDuration] = useState(7);

  const handleSubmit = () => {
    if (customMode) {
      onSubmit(customType, customName, customTarget, customDuration, customDescription || undefined);
    } else if (selectedPreset) {
      const preset = CHALLENGE_PRESETS.find(p => p.name === selectedPreset);
      if (preset) {
        onSubmit(preset.type, preset.name, preset.targetValue, preset.durationDays, preset.description);
      }
    }
    
    // Reset
    setSelectedPreset(null);
    setCustomMode(false);
    setCustomName('');
    setCustomDescription('');
  };

  const canSubmit = customMode 
    ? customName.trim() && customTarget > 0 && customDuration > 0
    : selectedPreset !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-primary" />
            Create Challenge
          </DialogTitle>
          <DialogDescription>
            Challenge your friend to build faith together
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!customMode ? (
            <>
              {/* Preset Challenges */}
              <div className="space-y-2">
                {CHALLENGE_PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  const isSelected = selectedPreset === preset.name;
                  
                  return (
                    <button
                      key={preset.name}
                      onClick={() => setSelectedPreset(preset.name)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/5' 
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{preset.name}</h4>
                          <p className="text-sm text-muted-foreground">{preset.description}</p>
                          <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                            <span>Target: {preset.targetValue}</span>
                            <span>Duration: {preset.durationDays} days</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setCustomMode(true)}
              >
                Create Custom Challenge
              </Button>
            </>
          ) : (
            <>
              {/* Custom Challenge Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Challenge Name</Label>
                  <Input
                    placeholder="e.g., 30-Day Prayer Marathon"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Textarea
                    placeholder="Describe the challenge..."
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Challenge Type</Label>
                    <Select value={customType} onValueChange={setCustomType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sessions">Sessions</SelectItem>
                        <SelectItem value="streak">Streak Days</SelectItem>
                        <SelectItem value="prayers">Prayers</SelectItem>
                        <SelectItem value="verses">Saved Verses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Target</Label>
                    <Input
                      type="number"
                      min={1}
                      value={customTarget}
                      onChange={(e) => setCustomTarget(parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Duration (Days)</Label>
                  <Select value={String(customDuration)} onValueChange={(v) => setCustomDuration(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Days</SelectItem>
                      <SelectItem value="7">1 Week</SelectItem>
                      <SelectItem value="14">2 Weeks</SelectItem>
                      <SelectItem value="30">1 Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                variant="ghost" 
                className="w-full" 
                onClick={() => setCustomMode(false)}
              >
                ← Back to Presets
              </Button>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!canSubmit}
            className="bg-gradient-to-r from-primary to-orange-500"
          >
            <Swords className="h-4 w-4 mr-2" />
            Send Challenge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
