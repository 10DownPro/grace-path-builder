import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  ArrowLeft, 
  HelpCircle, 
  BookOpen, 
  Sparkles, 
  Users, 
  Trophy, 
  Shield, 
  Mail,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Help() {
  const faqSections = [
    {
      icon: Sparkles,
      title: 'Sessions & Daily Walk',
      faqs: [
        {
          question: 'How do I start a session?',
          answer: 'Tap "Continue Journey" on Home or open the Session page. Choose your focus and follow the guided prompts — worship, scripture, prayer, and reflection — at your pace.'
        },
        {
          question: 'What counts toward my streak?',
          answer: 'Completing at least one session per day keeps your streak going. Full sessions count, and so do micro-actions like a quick prayer, gratitude note, or breath prayer.'
        },
        {
          question: 'Can I customize my schedule?',
          answer: 'Yes. Go to Settings > Preferences to set your weekly goal, preferred time of day, and focus areas like prayer, scripture, or worship.'
        }
      ]
    },
    {
      icon: BookOpen,
      title: 'Scripture & Bible',
      faqs: [
        {
          question: "What's the difference between Bible and Scripture?",
          answer: "Bible is the full reader — browse any book and chapter at your pace. Scripture is curated: today's verse, saved verses, search by reference, and verses tied to your Journey lessons."
        },
        {
          question: 'Which Bible translations are available?',
          answer: 'FaithFit supports KJV, NLT, CSB, and AMP translations. You can switch between them while reading any passage.'
        },
        {
          question: 'How do I save verses for later?',
          answer: 'Tap the bookmark icon on any verse to save it. Access saved verses from the Scripture page under "Saved Verses."'
        }
      ]
    },
    {
      icon: Users,
      title: 'Community & Faith Circles',
      faqs: [
        {
          question: 'How do I join a Faith Circle?',
          answer: 'Open the Community tab and choose Faith Circles. Pick a circle that fits where you are — Starting Faith, Coming Back, Healing, Consistency, or Prayer — and tap Join Circle.'
        },
        {
          question: 'What is Walking Together?',
          answer: 'Walking Together is the shared community feed. Share reflections, post encouragements, and lift others up in prayer. Keep it kind, honest, and Christ-centered.'
        },
        {
          question: 'What are Prayer Partners?',
          answer: 'Prayer Partners is an optional 1-on-1 pairing. Opt in when you\'re ready and we\'ll match you with someone else walking with God so you can check in and pray for each other.'
        }
      ]
    },

    {
      icon: Trophy,
      title: 'Progress & Rewards',
      faqs: [
        {
          question: 'How do I earn points?',
          answer: 'Complete sessions, keep a steady walk, encourage others, pray for someone, and join challenges. Points unlock items in the Rewards shop.'
        },
        {
          question: 'What is the Daily Spin?',
          answer: 'Each day you can spin the mystery wheel for a small bonus. Complete your daily session to unlock your spin.'
        },
        {
          question: 'Do my streaks reset if I miss a day?',
          answer: 'Streaks here aren\'t about shame. Missing a day pauses your streak, but Streak Freezes from the Rewards shop can protect a day off.'
        }
      ]
    },
    {
      icon: Shield,
      title: 'Account & Privacy',
      faqs: [
        {
          question: 'How do I redeem my book code?',
          answer: 'If you have the FaithFit companion book, go to Settings > Redeem Book Code and enter the unique code from inside the book. This unlocks premium features.'
        },
        {
          question: 'Is my prayer journal private?',
          answer: 'Yes. Your personal prayers are private by default. You can choose to share specific prayers with your Faith Circle, but nothing is shared without your explicit action.'
        },
        {
          question: 'How do I delete my account?',
          answer: 'Go to Settings > Account > Delete Account. This permanently removes all your data including prayers, progress, and circle memberships. This action cannot be undone.'
        }
      ]
    },
    {
      icon: MessageSquare,
      title: 'Troubleshooting',
      faqs: [
        {
          question: 'The app isn\'t loading properly',
          answer: 'Try refreshing the page or clearing your browser cache. If issues persist, try logging out and back in. For mobile, ensure you have a stable internet connection.'
        },
        {
          question: 'My streak disappeared',
          answer: 'Streaks are tracked in your timezone. If you finished close to midnight, it may have registered for the next day. Contact support if you believe this is an error.'
        },
        {
          question: 'I can\'t see my circle\'s posts',
          answer: 'Make sure you\'re signed in and have accepted any pending circle invitations. If you belong to several circles, check that you\'re viewing the right one.'
        }
      ]
    }
  ];

  return (
    <PageLayout showNav={false}>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/settings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-3xl text-primary uppercase tracking-wide">
              Help & FAQ
            </h1>
            <p className="text-sm text-muted-foreground">
              Get answers to common questions
            </p>
          </div>
        </div>

        {/* Quick Help Card */}
        <Card className="gym-card border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Need more help?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Can't find what you're looking for? Reach out to our support team.
                </p>
                <a href="mailto:support@faithfit.app">
                  <Button size="sm" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Contact Support
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Sections */}
        <div className="space-y-4">
          {faqSections.map((section, index) => (
            <Card key={index} className="gym-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Accordion type="single" collapsible className="w-full">
                  {section.faqs.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`${index}-${faqIndex}`}>
                      <AccordionTrigger className="text-left text-sm font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back Button */}
        <div className="pt-4 pb-8">
          <Link to="/settings">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Settings
            </Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
