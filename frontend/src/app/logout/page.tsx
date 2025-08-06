'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const page = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.clear();
    router.push('/login');
  }, [router]);

  return null;
};

export default page;