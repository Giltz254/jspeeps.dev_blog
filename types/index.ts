import { Session as AuthSession } from '@auth/core/types';

export interface SessionProps {
  session: AuthSession | null;
}
