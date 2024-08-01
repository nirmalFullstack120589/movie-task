import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { IMovieBoxProps } from '@/types';

interface MovieBoxProps {
  movie: IMovieBoxProps;
}

const MovieBox = ({ movie }: MovieBoxProps) => {
  const router = useRouter();
  return (
    <div
      className="sm:h-[504px] h-[334px] px-8 pt-8 pb-16 cursor-pointer bg-card hover:bg-card-hover rounded-xl"
      onClick={() => router.push(`/edit-movie/${movie._id}`)}
    >
      <Image
        src={movie?.image || ''}
        alt="Movie Box"
        width={100}
        height={100}
        className="object-cover h-full w-full sm:max-h-[400px] max-h-[246px] rounded-xl"
      />
      <div className="mt-16 px-8">
        <p className="sm:text-body-large text-body-regular font-bold sm:font-semibold">
          {movie.title}
        </p>
        <p className="text-body-small mt-8">{movie.publishYear}</p>
      </div>
    </div>
  );
};

export default MovieBox;
