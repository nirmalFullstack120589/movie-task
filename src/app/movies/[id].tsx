import AddEditMovie from '@/components/movies/AddEditMovie';

const EditMoviePage = ({ params: { id } }: { params: { id: string } }) => {
  return <AddEditMovie movieId={id} />;
};

export default EditMoviePage;
