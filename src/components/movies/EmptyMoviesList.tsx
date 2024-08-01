'use client';
import React from 'react';
import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const EmptyMoviesList = () => {
  const router = useRouter();
  return (
    <div className="w-full md:py-120 py-80 h-screen">
      <div className="flex justify-end items-center">
        <div
          className="flex items-center gap-[16px] cursor-pointer"
          // onClick={() => handleLogout()}
        >
          <p className="text-body-regular font-bold hidden md:block">Logout</p>
          <Image
            src="/images/logout-icon.svg"
            alt="Logout Icon"
            width={26}
            height={26}
          />
        </div>
      </div>

      <div className="w-full h-full flex justify-center items-center flex-col">
        <div className="text-center">
          <h2 className="md:text-heading-two text-heading-three font-semibold">
            Your movie list is empty
          </h2>

          <div className="mt-10">
            <Button
              type="button"
              className="w-auto"
              onClick={() => router.push('/create-movie')}
            >
              Add a new movie
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyMoviesList;
