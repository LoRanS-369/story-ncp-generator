'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NCPPanel from '@/components/NCPPanel';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/story-generator');
  }, [router]);

  return null;
}
