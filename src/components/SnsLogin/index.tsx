import { Button } from 'components/Button';
import { useSession, signIn, signOut } from 'next-auth/react';

export const SnsLogin = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <div>
        Signed in as {session.user?.email} <br />
        <br />
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
    );
  }
  return (
    <div>
      Not signed in <br />
      <br />
      <Button onClick={() => signIn()}>Sign in</Button>
    </div>
  );
};
