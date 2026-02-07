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
  Dumbbell, 
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
      icon: Dumbbell,
      title: 'Training & Sessions',
      faqs: [
        {
          question: 'How do I start a training session?',
          answer: 'Tap the "Train" button in the bottom navigation or go to the Session page. Choose your workout type and follow the guided prompts to complete your daily spiritual training.'
        },
        {
          question: 'What counts toward my streak?',
          answer: 'Completing at least one training session per day maintains your streak. This includes full workouts, battle verse practice, or prayer sessions. Micro-actions like quick prayers also count!'
        },
        {
          question: 'Can I customize my training schedule?',
          answer: 'Yes! Go to Settings > Training Preferences to set your weekly goal, preferred training time, and focus areas like prayer, scripture memory, or worship.'
        }
      ]
    },
    {
      icon: BookOpen,
      title: 'Scripture & Battle Verses',
      faqs: [
        {
          question: 'What are Battle Verses?',
          answer: 'Battle Verses are powerful scriptures for spiritual warfare. Each day features a new verse to memorize and meditate on. Practice them in Battle Mode to strengthen your spiritual armor.'
        },
        {
          question: 'Which Bible translations are available?',
          answer: 'FaithFit supports KJV, NIV, ESV, and NLT translations. You can switch between them in Settings or while viewing any scripture passage.'
        },
        {
          question: 'How do I save verses for later?',
          answer: 'Tap the bookmark icon on any verse to save it to your collection. Access saved verses from the Scripture page under "My Verses."'
        }
      ]
    },
    {
      icon: Users,
      title: 'Squads & Community',
      faqs: [
        {
          question: 'How do I join a squad?',
          answer: 'Go to the Squad page and tap "Join Squad." Enter the squad code shared by your squad leader, or browse public squads to find one that fits your goals.'
        },
        {
          question: 'What can I do in The Trenches?',
          answer: 'The Trenches is our community discussion space. Share prayer requests, post testimonies, ask theological questions, and encourage fellow believers. Remember: attack ideas, not people!'
        },
        {
          question: 'How do friend codes work?',
          answer: 'Your unique friend code is in Settings. Share it with others so they can add you as a friend. You can also add friends by entering their code in the Squad page.'
        }
      ]
    },
    {
      icon: Trophy,
      title: 'Rewards & Progress',
      faqs: [
        {
          question: 'How do I earn points?',
          answer: 'Complete training sessions, maintain streaks, send encouragements, pray for others, and participate in challenges. Points unlock rewards in the Rewards shop.'
        },
        {
          question: 'What is the Daily Spin?',
          answer: 'Each day you can spin the mystery wheel for bonus rewards. Complete your daily training to unlock your spin. Prizes include bonus points, streak shields, and exclusive content.'
        },
        {
          question: 'Do my streaks reset if I miss a day?',
          answer: 'Yes, missing a day resets your streak to zero. However, you can earn Streak Shields through rewards that protect your streak for one missed day.'
        }
      ]
    },
    {
      icon: Shield,
      title: 'Account & Privacy',
      faqs: [
        {
          question: 'How do I redeem my book code?',
          answer: 'If you have the Faith Training Guide book, go to Settings > Redeem Book Code and enter the unique code from inside the book. This unlocks premium features.'
        },
        {
          question: 'Is my prayer journal private?',
          answer: 'Yes, your personal prayers are completely private by default. You can choose to share specific prayers with your squad, but nothing is shared without your explicit action.'
        },
        {
          question: 'How do I delete my account?',
          answer: 'Go to Settings > Account > Delete Account. This permanently removes all your data including prayers, progress, and squad memberships. This action cannot be undone.'
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
          answer: 'Streaks are tracked in your timezone. If you completed training close to midnight, it may have registered for the next day. Contact support if you believe this is an error.'
        },
        {
          question: 'I can\'t see my squad\'s posts',
          answer: 'Make sure you\'re logged in and have accepted any pending squad invitations. Check that you\'re viewing the correct squad if you\'re a member of multiple groups.'
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
