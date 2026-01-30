import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Lock, Eye, Database, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, including:
        • Account information (email, display name)
        • Prayer requests and journal entries you create
        • Progress data (session completions, streaks, milestones)
        • Social connections (friend codes, squad memberships)
        • Device information for app functionality`
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: `Your information is used to:
        • Provide and maintain the FaithFit app services
        • Track your spiritual growth progress and streaks
        • Enable social features like squads and challenges
        • Send relevant notifications and reminders
        • Improve our services and user experience`
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: `We implement industry-standard security measures:
        • End-to-end encryption for sensitive data
        • Secure cloud infrastructure (Lovable Cloud)
        • Row-level security for database access
        • Regular security audits and updates
        • No selling of personal data to third parties`
    },
    {
      icon: Shield,
      title: 'Your Rights',
      content: `You have the right to:
        • Access your personal data at any time
        • Request correction of inaccurate data
        • Delete your account and associated data
        • Export your data in a portable format
        • Opt out of non-essential communications`
    },
    {
      icon: Mail,
      title: 'Contact Us',
      content: `If you have questions about this Privacy Policy or our data practices, please contact us through the app's settings page or reach out to our support team. We're committed to addressing your privacy concerns.`
    }
  ];

  return (
    <PageLayout showNav={false}>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-3xl text-primary uppercase tracking-wide">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: January 2026
            </p>
          </div>
        </div>

        {/* Introduction */}
        <Card className="gym-card">
          <CardContent className="p-6">
            <p className="text-muted-foreground leading-relaxed">
              FaithFit ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and safeguard your 
              information when you use our faith training application. We believe your 
              spiritual journey is personal, and we treat your data with the respect 
              and security it deserves.
            </p>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, index) => (
            <Card key={index} className="gym-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed text-sm">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Children's Privacy */}
        <Card className="gym-card border-warning/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-warning">Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-muted-foreground text-sm leading-relaxed">
              FaithFit is intended for users aged 13 and older. We do not knowingly 
              collect personal information from children under 13. If you believe a 
              child under 13 has provided us with personal information, please contact 
              us immediately so we can remove such data.
            </p>
          </CardContent>
        </Card>

        {/* Policy Updates */}
        <Card className="gym-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Policy Updates</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-muted-foreground text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you 
              of any significant changes by posting the new policy in the app and 
              updating the "Last updated" date. Your continued use of FaithFit after 
              changes constitutes acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="pt-4 pb-8">
          <Link to="/">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
