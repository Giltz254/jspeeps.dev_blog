import {
  Shield,
  Eye,
  Database,
  Share2,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const PrivacyPolicy = () => {
  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: Database,
      content: [
        "Personal information you provide when creating an account or contacting us",
        "Usage data including pages visited, features used, and interaction patterns",
        "Device information such as browser type, operating system, and IP address",
        "JavaScript learning preferences and skill level assessments",
      ],
    },
    {
      id: "information-use",
      title: "How We Use Your Information",
      icon: Eye,
      content: [
        "Provide and maintain our JavaScript learning platform",
        "Personalize your learning experience and recommend relevant content",
        "Send important updates about our services and new features",
        "Analyze usage patterns to improve our platform and educational content",
        "Respond to your inquiries and provide customer support",
      ],
    },
    {
      id: "information-sharing",
      title: "Information Sharing",
      icon: Share2,
      content: [
        "We do not sell, trade, or rent your personal information to third parties",
        "Anonymous usage data may be shared with educational partners to improve JavaScript learning resources",
        "Information may be disclosed if required by law or to protect our legal rights",
        "Service providers who help us operate our platform may have access to your data under strict confidentiality agreements",
      ],
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: Shield,
      content: [
        "We implement industry-standard security measures to protect your data",
        "All data transmission is encrypted using SSL/TLS protocols",
        "Regular security audits and updates to protect against vulnerabilities",
        "Limited access to personal data on a need-to-know basis for our team",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-500 via-blue-500 to-blue-600 rounded-2xl mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. This policy explains how JSPeeps
              collects, uses, and protects your personal information when you
              use our JavaScript learning platform.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <Card className="mb-12 shadow-none border">
              <CardContent className="p-8 lg:p-12">
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
                  Our Commitment to You
                </h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p className="mb-4">
                    At JSPeeps, we're committed to protecting your privacy and
                    being transparent about how we handle your data. This
                    Privacy Policy applies to all services provided by JSPeeps,
                    including our website, educational content, and any related
                    services.
                  </p>
                  <p className="mb-4">
                    By using our services, you agree to the collection and use
                    of information in accordance with this policy. We'll only
                    use your personal information to provide and improve our
                    JavaScript learning platform.
                  </p>
                  <p>
                    If you have any questions about this Privacy Policy, please
                    don't hesitate to contact us at the information provided
                    below.
                  </p>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-8">
              {sections.map((section, index) => (
                <Card
                  key={section.id}
                  className="shadow-none border overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="p-6 lg:p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-slate-500 via-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-soft">
                          <section.icon className="h-6 w-6 text-primary-foreground" />
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
                    Your Rights
                  </h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                      <span>Access your personal data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                      <span>Correct inaccurate information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                      <span>Request data deletion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                      <span>Opt out of communications</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-none border">
                <CardContent className="p-6 lg:p-8">
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    Data Retention
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    We retain your personal information only as long as
                    necessary to provide our services and comply with legal
                    obligations.
                  </p>
                  <p className="text-muted-foreground">
                    Account data is typically deleted within 30 days of account
                    closure, unless required for legal compliance.
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card className="mt-12 shadow-none border border-border">
              <CardContent className="p-8 lg:p-12 text-center">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-500 via-blue-500 to-blue-600 rounded-2xl mb-6"
                >
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Questions About Your Privacy?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  If you have any questions about this Privacy Policy or how we
                  handle your data, please don't hesitate to reach out to our
                  team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/jspeeps-support"
                    className="inline-block px-5 py-2.5 text-white text-sm font-medium shadow-sm transition duration-300 ease-in-out
      bg-gradient-to-r from-slate-500 via-blue-500 to-blue-600
      hover:from-slate-600 hover:via-blue-600 hover:to-blue-700
      focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
                  >
                    Contact Us
                  </Link>
                  <Button variant="outline">View Terms of Service</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
