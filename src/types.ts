export interface IAddEditMovie {
  id?: string;
  title?: string;
  publishing_year?: string;
  file?: File | string | null;
  preview: string | null;
}

export interface IMovieBoxProps {
  _id?: string;
  title?: string;
  publishYear?: string;
  image?: string | null;
}

export interface IAddEditMovieErrors {
  id?: string;
  title?: string;
  publishing_year?: string;
  file: string;
  preview: string;
}

export interface AddEditMovieProps {
  movieId?: string;
}
