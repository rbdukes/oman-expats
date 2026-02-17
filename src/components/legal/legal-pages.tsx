"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Scale,
  Shield,
  Cookie,
  AlertTriangle,
  Building,
  Briefcase,
  Heart,
  Globe,
} from "lucide-react";

const termsContent = `
# Terms of Service

**Effective Date:** January 1, 2024
**Last Updated:** January 15, 2024

## 1. Acceptance of Terms

By accessing and using Oman Expat ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.

## 2. Description of Service

Oman Expat is a community platform designed to serve expatriates living in or relocating to Oman. The Platform provides:
- Discussion forums and community interaction
- Classified advertisements
- Information guides and resources
- Networking opportunities

## 3. User Registration

To access certain features of the Platform, you must register for an account. You agree to:
- Provide accurate and complete information
- Maintain the security of your account credentials
- Promptly update your account information if it changes
- Accept responsibility for all activities under your account

## 4. User Conduct

Users agree NOT to:
- Post content that is illegal, harmful, threatening, abusive, or discriminatory
- Impersonate any person or entity
- Submit false or misleading information
- Violate any applicable laws or regulations
- Distribute spam or unsolicited communications
- Infringe on intellectual property rights
- Harass, abuse, or harm other users

## 5. Content Guidelines

All user-generated content must:
- Be relevant to the expatriate community in Oman
- Respect local laws and cultural norms
- Not contain offensive or inappropriate material
- Be original or properly attributed
- Not violate any third-party rights

## 6. Intellectual Property

Content you submit to the Platform grants Oman Expat a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and distribute such content in connection with the service.

## 7. Disclaimer of Warranties

THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. OMAN EXPAT DOES NOT WARRANT THAT:
- The service will be uninterrupted or error-free
- Information provided is accurate or complete
- Errors will be corrected

## 8. Limitation of Liability

OMAN EXPAT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES RESULTING FROM YOUR USE OF THE SERVICE.

## 9. Termination

We reserve the right to terminate or suspend accounts that violate these terms or for any other reason at our discretion.

## 10. Governing Law

These terms shall be governed by the laws of the Sultanate of Oman.

## 11. Contact Information

For questions about these Terms, please contact: legal@omanexpat.com
`;

const privacyContent = `
# Privacy Policy

**Effective Date:** January 1, 2024
**Last Updated:** January 15, 2024

## 1. Information We Collect

### Personal Information
- Name (first and last)
- Email address
- Nationality
- Current location
- Profession
- Company (optional)
- Phone number (optional)
- Profile photo (optional)

### Technical Information
- IP address
- Browser type
- Device information
- Cookies and similar technologies
- Usage data and analytics

## 2. How We Use Your Information

We use collected information to:
- Provide and maintain our service
- Process your registration
- Send notifications and updates
- Improve our Platform
- Ensure security and prevent fraud
- Comply with legal obligations
- Communicate with you about your account

## 3. Information Sharing

We do NOT sell your personal information. We may share information with:
- Service providers who assist our operations
- Legal authorities when required by law
- Other users (limited profile information)

## 4. Your Rights (GDPR)

Under GDPR, you have the right to:
- Access your personal data
- Correct inaccurate data
- Delete your data
- Object to processing
- Data portability
- Withdraw consent

## 5. Data Security

We implement appropriate security measures including:
- Encrypted data transmission (HTTPS/SSL)
- Secure password storage (hashing)
- Regular security audits
- Access controls and monitoring

## 6. Data Retention

We retain your data while your account is active and for a reasonable period thereafter for:
- Legal compliance
- Dispute resolution
- Security purposes

## 7. International Transfers

Your data may be processed in countries outside your country of residence. We ensure appropriate safeguards are in place.

## 8. Children's Privacy

Our Platform is not intended for users under 18. We do not knowingly collect data from children.

## 9. Changes to Policy

We may update this policy periodically. We will notify you of significant changes.

## 10. Contact

For privacy concerns or data requests: privacy@omanexpat.com
`;

const cookieContent = `
# Cookie Policy

**Effective Date:** January 1, 2024

## 1. What Are Cookies

Cookies are small text files stored on your device when you visit our Platform. They help us provide a better user experience.

## 2. Types of Cookies We Use

### Essential Cookies
- Session management
- Authentication
- Security features
- These cannot be disabled

### Functional Cookies
- Remember preferences
- Language settings
- Theme preferences

### Analytics Cookies
- Usage statistics
- Performance monitoring
- User behavior analysis

### Marketing Cookies
- Personalized content
- Relevant advertisements
- Social media integration

## 3. Third-Party Cookies

We may use cookies from:
- Google Analytics
- Social media platforms
- Advertising partners

## 4. Managing Cookies

You can manage cookies through:
- Browser settings
- Our cookie consent banner
- Opt-out mechanisms

## 5. Impact of Disabling Cookies

Disabling certain cookies may affect:
- Login functionality
- Preference persistence
- Site performance
- Personalization

## 6. Contact

For questions about cookies: privacy@omanexpat.com
`;

const gdprContent = `
# GDPR Compliance

**Effective Date:** January 1, 2024

## 1. Data Controller

Oman Expat is the data controller for personal data collected through this Platform.

## 2. Legal Basis for Processing

We process data based on:
- **Consent:** User registration and cookie usage
- **Contract:** Service provision and account management
- **Legitimate Interest:** Platform improvement and security
- **Legal Obligation:** Regulatory compliance

## 3. Your Rights Under GDPR

### Right to Access
Request a copy of your personal data.

### Right to Rectification
Request correction of inaccurate data.

### Right to Erasure
Request deletion of your data ("right to be forgotten").

### Right to Restriction
Request limited processing of your data.

### Right to Portability
Receive your data in a machine-readable format.

### Right to Object
Object to processing based on legitimate interests.

## 4. How to Exercise Your Rights

Submit requests to: gdpr@omanexpat.com

We will respond within 30 days.

## 5. Data Protection Officer

Contact our DPO at: dpo@omanexpat.com

## 6. Supervisory Authority

You have the right to lodge a complaint with a supervisory authority.

## 7. Automated Decision-Making

We do not use automated decision-making for significant decisions.
`;

const disclaimersContent = `
# Disclaimers

## General Disclaimer

Oman Expat is an independent community platform and is NOT affiliated with, endorsed by, or connected to the Government of Oman or any government agency.

## Content Accuracy

Information provided on this Platform is for general guidance purposes only. While we strive for accuracy, we cannot guarantee that all information is:
- Current or up-to-date
- Complete or comprehensive
- Applicable to your specific situation

**Always verify information with official sources.**

## Immigration & Visa Information

Immigration rules and visa requirements change frequently. Content regarding visas, residency, and work permits should NOT be considered as legal advice. Consult official sources:
- Royal Oman Police
- Ministry of Labour
- Official government portals

## Medical Information

Healthcare information is for general purposes only. It does NOT constitute medical advice. Always consult qualified healthcare professionals for medical decisions.

## Employment Information

Job listings and employment-related content are provided by third parties. We do NOT verify:
- Job legitimacy
- Employer credentials
- Salary accuracy
- Working conditions

## Classified Transactions

Classified listings are user-generated. We are NOT a party to any transactions. We do NOT guarantee:
- Product/service quality
- Seller/buyer reliability
- Transaction safety

## External Links

We are NOT responsible for content on external websites linked from our Platform.

## Limitation of Liability

To the fullest extent permitted by law, Oman Expat shall NOT be liable for any losses, damages, or claims arising from:
- Use of Platform content
- User interactions
- Classified transactions
- Third-party services

## No Professional Advice

Content on this Platform does NOT constitute:
- Legal advice
- Immigration advice
- Medical advice
- Financial advice
- Professional consultation

**Always seek qualified professional advice for important decisions.**
`;

export function LegalPages() {
  const [activeTab, setActiveTab] = useState("terms");

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Legal Information</h1>
          <p className="text-muted-foreground">
            Please read these documents carefully before using our Platform
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="terms" className="text-xs sm:text-sm">
              <Scale className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Terms</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="text-xs sm:text-sm">
              <Shield className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="cookies" className="text-xs sm:text-sm">
              <Cookie className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Cookies</span>
            </TabsTrigger>
            <TabsTrigger value="gdpr" className="text-xs sm:text-sm">
              <Globe className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">GDPR</span>
            </TabsTrigger>
            <TabsTrigger value="disclaimers" className="text-xs sm:text-sm">
              <AlertTriangle className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Disclaimers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="terms">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Terms of Service
                </CardTitle>
                <CardDescription>
                  The rules and guidelines for using Oman Expat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {termsContent}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy Policy
                </CardTitle>
                <CardDescription>
                  How we collect, use, and protect your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {privacyContent}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cookies">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5" />
                  Cookie Policy
                </CardTitle>
                <CardDescription>
                  Information about cookies and how we use them
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {cookieContent}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gdpr">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  GDPR Compliance
                </CardTitle>
                <CardDescription>
                  Your rights under the General Data Protection Regulation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {gdprContent}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disclaimers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Disclaimers
                </CardTitle>
                <CardDescription>
                  Important notices about Platform content and services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {disclaimersContent}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator className="my-8" />

        {/* Additional Disclaimers */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="h-4 w-4" />
                Government Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Always verify immigration, visa, and regulatory information with official 
              government sources such as the Royal Oman Police and Ministry of Labour.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Employment Listings
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Job listings are posted by third parties. We do not verify the legitimacy 
              of job offers or employers. Exercise caution when applying for positions.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Healthcare information is for general guidance only. Always consult 
              qualified medical professionals for health-related decisions.
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            For questions about our legal policies, please contact us at{" "}
            <a href="mailto:legal@omanexpat.com" className="text-primary hover:underline">
              legal@omanexpat.com
            </a>
          </p>
          <p className="mt-2">
            Last updated: January 15, 2024
          </p>
        </div>
      </div>
    </div>
  );
}
