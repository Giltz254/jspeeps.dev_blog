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

interface PasswordResetEmailProps {
  name: string;
  passwordResetLink: string;
}

export const PasswordResetEmailTemplate = ({
  name,
  passwordResetLink,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your password for Jspeeps.dev</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={title}>
          Trouble signing in{ name ? `, ${name}` : '' }? Let’s fix that 🔐
        </Text>

        <Section style={section}>
          <Text style={text}>
            Hey{ name ? ` ${name}` : '' } 👋,
          </Text>
          <Text style={text}>
            We received a request to reset your password for your <strong>Jspeeps.dev</strong> account.
            Click the button below to set a new password.
          </Text>

          <Button style={button} href={passwordResetLink}>
            Reset Password
          </Button>

          <Text style={{ ...text, fontSize: '12px', marginTop: '16px' }}>
            If you didn’t request this, you can safely ignore this email — your current password will remain unchanged.
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

export default PasswordResetEmailTemplate;

// Styles remain unchanged from the original
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
