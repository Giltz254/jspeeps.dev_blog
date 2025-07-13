import {
  FileText,
  Scale,
  Users,
  AlertTriangle,
  Mail,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TermsOfService = () => {
  const sections = [
    {
      id: "acceptance-of-terms",
      title: "Acceptance of Terms",
      icon: FileText,
      content: [
        "By accessing and using JSPeeps, you accept and agree to be bound by these Terms of Service",
        "If you do not agree to these terms, please do not use our services",
        "We reserve the right to update these terms at any time with notice to users",
        "Continued use of our services after changes constitutes acceptance of new terms",
      ],
    },
    {
      id: "user-accounts",
      title: "User Accounts & Responsibilities",
      icon: Users,
      content: [
        "You are responsible for maintaining the security of your account credentials",
        "You must provide accurate and complete information when creating an account",
        "You are responsible for all activities that occur under your account",
        "You must notify us immediately of any unauthorized use of your account",
        "Users must be at least 13 years old to create an account",
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable Use Policy",
      icon: Shield,
      content: [
        "Use our services only for lawful purposes and in accordance with these terms",
        "Do not attempt to interfere with or disrupt our services or servers",
        "Do not upload, share, or distribute malicious code or harmful content",
        "Respect intellectual property rights of JSPeeps and other users",
        "Do not use our services to spam, harass, or harm other users",
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      icon: Scale,
      content: [
        "All content, features, and functionality on JSPeeps are owned by us or our licensors",
        "Our educational content, courses, and materials are protected by copyright",
        "You may use our content for personal, non-commercial learning purposes only",
        "You retain ownership of any original code you create while using our platform",
        "Trademark and brand elements of JSPeeps may not be used without permission",
      ],
    },
    {
      id: "service-availability",
      title: "Service Availability & Modifications",
      icon: AlertTriangle,
      content: [
        "We strive to maintain high availability but cannot guarantee uninterrupted service",
        "We may modify, suspend, or discontinue any part of our services at any time",
        "Scheduled maintenance and updates may temporarily limit service availability",
        "We are not liable for any disruption or loss of data due to service unavailability",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-500 via-blue-500 to-blue-600 rounded-2xl mb-6 shadow-medium">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Terms of Service
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              These terms govern your use of JSPeeps and outline the rights and
              responsibilities for all users of our JavaScript learning
              platform.
            </p>
          </div>
        </div>
      </section>
      <section className="pb-16 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-12 shadow-none border">
              <CardContent className="p-8 lg:p-12">
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
                  Welcome to JSPeeps
                </h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p className="mb-4">
                    These Terms of Service ("Terms") govern your access to and
                    use of JSPeeps services, including our website, educational
                    content, courses, and any related services. Please read
                    these terms carefully.
                  </p>
                  <p className="mb-4">
                    By accessing or using JSPeeps, you agree to be bound by
                    these Terms. If you disagree with any part of these terms,
                    then you may not access our services.
                  </p>
                  <p>
                    We reserve the right to update these Terms at any time. We
                    will notify users of any material changes, and continued use
                    of our services constitutes acceptance of the updated Terms.
                  </p>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-8">
              {sections.map((section, index) => (
                <Card
                  key={section.id}
                  className="shadow-none pt-0 border overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="bg-gray-50 rounded-t-xl p-6 lg:p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-slate-500 via-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-soft">
                          <section.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl lg:text-2xl font-bold text-foreground">
                            {section.title}
                          </h3>
                          <p className="text-muted-foreground">
                            Section {index + 1} of {sections.length}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 lg:p-8">
                      <ul className="space-y-4">
                        {section.content.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-start gap-3"
                          >
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-muted-foreground leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <Card className="shadow-none border">
                <CardContent className="p-6 lg:p-8">
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    Limitation of Liability
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    JSPeeps provides educational content "as is" without
                    warranties. We are not liable for any indirect, incidental,
                    or consequential damages.
                  </p>
                  <p className="text-muted-foreground">
                    Our total liability shall not exceed the amount you paid for
                    our services in the 12 months prior to the claim.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-none border">
                <CardContent className="p-6 lg:p-8">
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    Termination
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You may terminate your account at any time. We may suspend
                    or terminate your access for violations of these terms.
                  </p>
                  <p className="text-muted-foreground">
                    Upon termination, your right to use our services ceases
                    immediately, but these terms remain in effect.
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card className="mt-8 shadow-none border">
              <CardContent className="p-6 lg:p-8">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Governing Law & Disputes
                </h3>
                <div className="text-muted-foreground space-y-3">
                  <p>
                    These Terms are governed by and construed in accordance with
                    applicable laws. Any disputes arising from these terms or
                    your use of our services will be resolved through binding
                    arbitration.
                  </p>
                  <p>
                    If any provision of these Terms is found to be
                    unenforceable, the remaining provisions will remain in full
                    force and effect.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="mt-12 shadow-none border">
              <CardContent className="p-8 lg:p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-500 via-blue-500 to-blue-600 rounded-2xl mb-6">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Questions About These Terms?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  If you have any questions about these Terms of Service or need
                  clarification on any provisions, please don't hesitate to
                  contact our legal team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-gradient-primary border-0 shadow-soft hover:shadow-medium transition-all">
                    Contact Legal Team
                  </Button>
                  <Link
                    href="/jspeeps-privacy-policy"
                    className="inline-block px-5 py-2.5 text-white text-sm font-medium shadow-sm transition duration-300 ease-in-out
      bg-gradient-to-r from-slate-500 via-blue-500 to-blue-600
      hover:from-slate-600 hover:via-blue-600 hover:to-blue-700
      focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
                  >
                    View Privacy Policy
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
