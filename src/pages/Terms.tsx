import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, AlertTriangle, Scale, Users, Ban, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
  const sections = [
    {
      icon: FileText,
      title: 'Acceptance of Terms',
      content: `By accessing or using FaithFit, you agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any part of these terms, you may not access our service.

These terms apply to all users of the app, including registered members and visitors.`
    },
    {
      icon: Users,
      title: 'User Accounts',
      content: `When you create an account with us, you must:
        • Provide accurate and complete information
        • Maintain the security of your account credentials
        • Notify us immediately of any unauthorized access
        • Be at least 13 years of age to use the service
        
You are responsible for all activities that occur under your account.`
    },
    {
      icon: Scale,
      title: 'Acceptable Use',
      content: `You agree to use FaithFit only for lawful purposes and in accordance with these Terms. You agree NOT to:
        • Use the service for any illegal or unauthorized purpose
        • Post content that is offensive, harmful, or violates others' rights
        • Attempt to interfere with or disrupt the service
        • Impersonate others or misrepresent your affiliation
        • Harvest or collect user data without permission`
    },
    {
      icon: Ban,
      title: 'Prohibited Content',
      content: `The following content is strictly prohibited:
        • Hate speech, harassment, or bullying
        • Explicit or inappropriate material
        • Spam or misleading content
        • Content that infringes on intellectual property rights
        • False religious teaching or content contrary to biblical Christianity
        
We reserve the right to remove any content that violates these guidelines.`
    },
    {
      icon: RefreshCw,
      title: 'Service Modifications',
      content: `We reserve the right to:
        • Modify or discontinue any feature at any time
        • Update these Terms with reasonable notice
        • Terminate accounts that violate our policies
        • Change pricing for premium features with notice
        
We will make reasonable efforts to notify users of significant changes.`
    },
    {
      icon: AlertTriangle,
      title: 'Limitation of Liability',
      content: `FaithFit is provided "as is" without warranties of any kind. We are not liable for:
        • Any indirect, incidental, or consequential damages
        • Loss of data or service interruptions
        • Actions taken based on app content
        • Third-party links or services
        
FaithFit is a spiritual growth tool and is not a substitute for professional counseling, medical advice, or pastoral guidance.`
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
              Terms of Service
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
              Welcome to FaithFit! These Terms of Service ("Terms") govern your use of 
              our faith training application and related services. Please read these 
              Terms carefully before using FaithFit. Your access to and use of the 
              service is conditioned on your acceptance of these Terms.
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

        {/* Intellectual Property */}
        <Card className="gym-card border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-muted-foreground text-sm leading-relaxed">
              The FaithFit name, logo, and all related content, features, and functionality 
              are owned by FaithFit and are protected by copyright, trademark, and other 
              intellectual property laws. Bible verses are sourced from publicly available 
              translations. User-generated content (prayers, reflections, testimonies) 
              remains the property of the respective users.
            </p>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="gym-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-muted-foreground text-sm leading-relaxed">
              These Terms shall be governed by and construed in accordance with 
              applicable laws, without regard to conflict of law principles. Any 
              disputes arising from these Terms will be resolved through good-faith 
              negotiation or, if necessary, through binding arbitration.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="gym-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-muted-foreground text-sm leading-relaxed">
              If you have any questions about these Terms, please contact us through 
              the app's Settings page. We're here to help and will respond to your 
              inquiries as promptly as possible.
            </p>
          </CardContent>
        </Card>

        {/* Agreement Statement */}
        <Card className="gym-card bg-primary/5 border-primary/30">
          <CardContent className="p-6">
            <p className="text-sm text-center">
              By using FaithFit, you acknowledge that you have read, understood, and 
              agree to be bound by these Terms of Service.
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
