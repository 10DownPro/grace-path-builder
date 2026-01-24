import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Crown, ChevronRight } from 'lucide-react';
import { StudyGroup, GROUP_TYPES } from '@/hooks/useStudyGroups';

interface GroupsListProps {
  groups: StudyGroup[];
  onSelectGroup: (groupId: string) => void;
}

export function GroupsList({ groups, onSelectGroup }: GroupsListProps) {
  const getGroupTypeInfo = (type: string) => {
    return GROUP_TYPES.find(t => t.value === type) || GROUP_TYPES[5]; // Default to custom
  };

  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-lg flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        Training Squads ({groups.length})
      </h2>
      
      {groups.map(group => {
        const typeInfo = getGroupTypeInfo(group.group_type);
        
        return (
          <Card
            key={group.id}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => onSelectGroup(group.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {/* Group Avatar */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                  {group.group_avatar_emoji || typeInfo.emoji}
                </div>
                
                {/* Group Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{group.group_name}</h3>
                    {group.is_creator && (
                      <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {typeInfo.label}
                    </Badge>
                    <span>•</span>
                    <span>{group.member_count || 0} members</span>
                  </div>
                </div>
                
                {/* Arrow */}
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              
              {group.description && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {group.description}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
