import React from 'react';
import { IconHeart, IconHome, IconShoppingCart, IconUser } from '@tabler/icons';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleMove = (route: string) => {
    switch (route) {
      case 'home':
        router.push('/');
        break;
      case 'wish':
        router.push('/wishlist');
        break;
      case 'cart':
        router.push('/cart');
        break;
      case 'my':
        router.push('/my');
        break;
      case 'user':
        router.push('/auth/login');
        break;

      default:
        break;
    }
  };

  return (
    <div className="mt-12 mb-12">
      <div className="w-full flex h-50 items-center">
        <IconHome onClick={() => handleMove('home')} />
        <span className="m-auto" />
        <IconHeart className="mr-4" onClick={() => handleMove('wish')} />
        <IconShoppingCart className="mr-4" onClick={() => handleMove('cart')} />
        {session ? (
          <Image
            src={session.user?.image!}
            alt="유저 이미지"
            width={30}
            height={30}
            style={{
              borderRadius: '50%'
            }}
            onClick={() => handleMove('my')}
          />
        ) : (
          <IconUser onClick={() => handleMove('user')} />
        )}
      </div>
    </div>
  );
};
