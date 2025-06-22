import React from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

const ListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2">
    <CheckCircle className="mt-1 text-emerald-500 w-5 h-5 shrink-0" />
    <span>{children}</span>
  </li>
);

const PrivacyPolicy = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-white pt-10 text-gray-800 overflow-x-hidden">
      <div className="bg-gray-50 border border-border py-20 relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full rounded-md">
        <div className="text-center text-black max-w-3xl mx-auto px-4">
          <h1 className="text-xl font-bold uppercase tracking-wide">
            We care about your privacy
          </h1>
          <p>Your privacy is important to us at jspeeps. We respect your privacy regarding any information we may collect from you across our website</p>
          <div className="mt-4 inline-block bg-black bg-opacity-30 text-white text-sm px-5 py-1.5 rounded-full shadow">
            Updated June 13, 2025
          </div>
        </div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto sm:px-6 px-4 -mt-12 pb-10">
        <div className="bg-white p-8 rounded-xl border border-border relative z-10">
          <p>
            This Privacy Policy describes our policies and procedures on the
            collection, use, and disclosure of your information when you visit
            our website and tells you about your privacy rights and how the law
            protects you.
          </p>
          <p>
            We use your personal data to provide and improve the Service. By
            using the Service, you agree to the collection and use of
            information according to this Privacy Policy.
          </p>

          <h2>1. Interpretation and Definitions</h2>
          <h3>1.1 Interpretation</h3>
          <p>
            Capitals like “Account,” “Company,” etc. have specific definitions
            and apply whether singular or plural.
          </p>

          <h3>1.2 Definitions</h3>
          <ul className="space-y-2">
            <ListItem>
              <strong>Account:</strong> A unique account created for you to
              access the Service.
            </ListItem>
            <ListItem>
              <strong>Affiliate:</strong> An entity controlling or controlled by
              a party (≥50%).
            </ListItem>
            <ListItem>
              <strong>Company:</strong> “We”, “Us”, “Our” refers to jspeeps.
            </ListItem>
            <ListItem>
              <strong>Cookies:</strong> Small files placed on your device by a
              website.
            </ListItem>
            <ListItem>
              <strong>Country:</strong> Kenya.
            </ListItem>
            <ListItem>
              <strong>Device:</strong> Any device accessing the Service.
            </ListItem>
            <ListItem>
              <strong>Personal Data:</strong> Data relating to an identifiable
              individual.
            </ListItem>
            <ListItem>
              <strong>Service:</strong> The website jspeeps.
            </ListItem>
            <ListItem>
              <strong>Service Provider:</strong> Third-party processors employed
              to operate or support the Service.
            </ListItem>
            <ListItem>
              <strong>Third‑party Social Media Service:</strong> Providers
              (Google, Facebook, Instagram, Twitter, LinkedIn) used for login.
            </ListItem>
            <ListItem>
              <strong>Usage Data:</strong> Automatically collected data from use
              or infrastructure.
            </ListItem>
            <ListItem>
              <strong>Website:</strong> jspeeps at{" "}
              <em>https://jspeeps‑dev‑blog.vercel.app/blog/feed/1</em>.
            </ListItem>
            <ListItem>
              <strong>You:</strong> The person or legal entity using the
              Service.
            </ListItem>
          </ul>

          <h2>2. Collecting and Using Your Personal Data</h2>
          <h3>2.1 Types of Data Collected</h3>
          <h4>2.1.1 Personal Data</h4>
          <ul className="space-y-2">
            <ListItem>Email address</ListItem>
            <ListItem>First name and last name</ListItem>
            <ListItem>Usage Data</ListItem>
          </ul>

          <h4>2.1.2 Usage Data</h4>
          <p>
            Collected automatically. Includes IP address, browser type/version,
            pages visited, timestamps, device identifiers, etc.
          </p>

          <h4>2.1.3 Third‑Party Social Media Services</h4>
          <p>
            If you log in using Google, Facebook, Instagram, Twitter, or
            LinkedIn, we may collect data associated with your accounts, like
            name, email, profile info, or contacts you choose to share.
          </p>

          <h4>2.1.4 Tracking Technologies & Cookies</h4>
          <p>
            We use cookies, web beacons, tags and scripts to track usage and
            preferences.
          </p>

          <h2>3. Use of Your Personal Data</h2>
          <ul className="space-y-2">
            <ListItem>To provide and maintain our Service</ListItem>
            <ListItem>To manage your Account</ListItem>
            <ListItem>To fulfill contractual obligations</ListItem>
            <ListItem>To contact you with updates or offers</ListItem>
            <ListItem>To respond to your requests</ListItem>
            <ListItem>For analysis and service improvement</ListItem>
          </ul>

          <h2>4. Security & Data Retention</h2>
          <p>
            We implement reasonable measures to protect your data, but no method
            is 100% secure. We retain data only as long as needed for legal or
            business purposes.
          </p>

          <h2>5. Children’s Privacy</h2>
          <p>
            Our Service is not for anyone under 13. If you're a parent and
            believe we've collected data from a child under 13, contact us and
            we'll remove it.
          </p>

          <h2>6. Links to Other Websites</h2>
          <p>
            Our Service may link to external sites. We aren’t responsible for
            their content or policies. Review their privacy practices
            independently.
          </p>

          <h2>7. Changes to This Privacy Policy</h2>
          <p>
            We may update this policy occasionally. We’ll notify you via email
            or a notice before changes take effect, updating the “Last updated”
            date here.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have questions, email us at{" "}
            <a
              href="mailto:gkiptoo169@gmail.com"
              className="text-blue-600 hover:underline"
            >
              gkiptoo169@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
