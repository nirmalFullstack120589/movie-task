import AddEditMovie from '@/components/movies/AddEditMovie';

interface EditMoviePageProps {
  params: {
    id: string;
  };
}

const EditMoviePage = async ({ params }: EditMoviePageProps) => {
  return <AddEditMovie movieId={params.id} />;
};

export default EditMoviePage;
