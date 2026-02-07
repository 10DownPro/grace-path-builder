-- Drop the old constraint and add a new one that includes 'lightbulb'
ALTER TABLE public.feed_reactions 
DROP CONSTRAINT feed_reactions_reaction_type_check;

ALTER TABLE public.feed_reactions 
ADD CONSTRAINT feed_reactions_reaction_type_check 
CHECK (reaction_type = ANY (ARRAY['fire'::text, 'praying'::text, 'amen'::text, 'strong'::text, 'heart'::text, 'lightbulb'::text]));