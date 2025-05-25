import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface VerificationTokenEmailProps {
  name: string;
  emailVerificationLink: string;
}

export const VerificationTokenEmailTemplate = ({
  name,
  emailVerificationLink,
}: VerificationTokenEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your email to get started on Jspeeps.dev</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={title}>
          Welcome{ name ? `, ${name}` : '' }! Let’s verify your email ✉️
        </Text>

        <Section style={section}>
          <Text style={text}>
            Hey{ name ? ` ${name}` : '' } 👋,
          </Text>
          <Text style={text}>
            Thanks for signing up for <strong>Jspeeps.dev</strong> — the home for unraveling JavaScript and beyond.
            Please confirm your email address by clicking the button below.
          </Text>

          <Button style={button} href={emailVerificationLink}>
            Verify Email
          </Button>

          <Text style={{ ...text, fontSize: '12px', marginTop: '16px' }}>
            If you didn’t sign up, you can safely ignore this email.
          </Text>
        </Section>

        <Text style={links}>
          <Link style={link} href="https://jspeeps.dev/security">
            Security Info
          </Link>{' '}
          ・{' '}
          <Link style={link} href="https://jspeeps.dev/contact">
            Contact Support
          </Link>
        </Text>

        <Text style={footer}>
          © {new Date().getFullYear()} Jspeeps.dev. All rights reserved.<br />
          Built for developers, by developers.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default VerificationTokenEmailTemplate;

const main = {
  backgroundColor: '#ffffff',
  color: '#24292e',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

const container = {
  maxWidth: '480px',
  margin: '0 auto',
  padding: '20px 0 48px',
};

const title = {
  fontSize: '22px',
  lineHeight: 1.4,
  textAlign: 'center' as const,
};

const section = {
  padding: '24px',
  border: 'solid 1px #dedede',
  borderRadius: '5px',
  textAlign: 'center' as const,
};

const text = {
  margin: '0 0 14px 0',
  fontSize: '14px',
  textAlign: 'left' as const,
};

const button = {
  fontSize: '14px',
  backgroundColor: '#000000',
  color: '#ffffff',
  lineHeight: 1.5,
  borderRadius: '6px',
  padding: '12px 24px',
  textDecoration: 'none',
};

const links = {
  textAlign: 'center' as const,
  marginTop: '24px',
};

const link = {
  color: '#0366d6',
  fontSize: '12px',
};

const footer = {
  color: '#6a737d',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginTop: '60px',
};
