import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export const useAuthRedirect = () => {
  const router = useRouter();
  const pathname = usePathname(); // Retrieve the current route
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    const publicPaths = ['/signin', '/signup'];
    const pathIsPublic = publicPaths.includes(pathname);

    if (!isAuthenticated && !pathIsPublic) {
      router.push('/signin');
    } else if (isAuthenticated && pathIsPublic) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, pathname, router]);
};
