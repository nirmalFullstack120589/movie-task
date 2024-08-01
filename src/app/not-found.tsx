'use client';
import React from 'react';
import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="w-full h-screen flex justify-center items-center flex-col">
      <div className="text-center">
        <h2 className="md:text-heading-two text-heading-three font-semibold">
          Page Not Found
        </h2>

        <div className="mt-10">
          <Button
            type="button"
            className="w-auto"
            onClick={() => router.push('/')}
          >
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
