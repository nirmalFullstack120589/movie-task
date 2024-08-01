'use client';
Image;
import React, {
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
  useRef,
} from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { AddEditMovieProps, IAddEditMovie, IAddEditMovieErrors } from '@/types';
import { cn, uploadFileToS3 } from '@/lib/utils';
import { errorToast, successToast } from '@/lib/helper';
import Loader from '../common/Loader';

const AddEditMovie = ({ movieId }: AddEditMovieProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialValues: IAddEditMovie = {
    id: '',
    title: '',
    publishing_year: '',
    file: null,
    preview: null,
  };

  const initialErrors: IAddEditMovieErrors = {
    id: '',
    title: '',
    publishing_year: '',
    file: '',
    preview: '',
  };

  const [formData, setFormData] = useState<IAddEditMovie>(initialValues);
  const [errors, setErrors] = useState<IAddEditMovieErrors>(initialErrors);
  const [loading, setLoading] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/movies/${movieId}`);
      if (!response.ok) {
        const errorData = await response.json();
        errorToast(errorData?.error);
        router.push('/');
      }

      const data = await response.json();

      setFormData((prev) => ({
        ...prev,
        id: data?._id,
        title: data?.title,
        publishing_year: data?.publishYear,
        file: null,
        preview: data?.image,
      }));
    } catch (error) {
      errorToast('Failed to fetch movie data.');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'publishing_year') {
      // Allow only numeric input and a maximum of 4 digits
      if (/^\d{0,4}$/.test(value)) {
        if (value.length > 4) {
          return false;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (value.length === 4) {
          const year = parseInt(value, 10);
          const currentYear = new Date().getFullYear();

          if (year > currentYear) {
            setErrors((prev) => ({
              ...prev,
              [name]: `Year cannot be greater than ${currentYear}`,
            }));
          } else {
            setErrors((prev) => ({ ...prev, [name]: '' }));
          }
        } else {
          setErrors((prev) => ({ ...prev, [name]: '' }));
        }
      } else {
        if (value.length <= 4) {
          setErrors((prev) => ({
            ...prev,
            [name]: 'Please enter a valid year',
          }));
        }
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });

      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = { ...initialErrors };

    if (!formData.title) {
      newErrors.title = 'Please enter movie title';
    }

    if (!formData.publishing_year) {
      newErrors.publishing_year = 'Please enter publishing year';
    }

    if (!formData?.file) {
      newErrors.file = 'Please upload a file.';
    }

    setErrors(newErrors);
    return !newErrors.title && !newErrors.publishing_year;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const selectedFile = files[0];
      if (validateFile(selectedFile)) {
        setFormData({
          ...formData,
          file: selectedFile,
          preview: URL.createObjectURL(selectedFile),
        });

        setErrors({
          ...errors,
          file: '',
        });
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const selectedFile = files[0];
      if (validateFile(selectedFile)) {
        setFormData({
          ...formData,
          file: selectedFile,
          preview: URL.createObjectURL(selectedFile),
        });

        setErrors({
          ...errors,
          file: '',
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const validateFile = (file: File) => {
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setErrors({ ...errors, file: 'Only image files are allowed.' });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, file: 'File size should not exceed 5 MB.' });
        return false;
      }
      return true;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setBtnLoading(true);
      let imageUrl = formData.file || formData.preview;

      if (formData.file && typeof formData.file !== 'string') {
        const data = await uploadFileToS3(
          formData.file,
          formData.file.name,
          formData.file
        );
        imageUrl = data.Location;
      }

      const payload = {
        title: formData.title,
        publishYear: formData.publishing_year,
        image: imageUrl,
      };

      const response = await fetch(
        movieId ? `/api/movies/${movieId}` : '/api/movies',
        {
          method: movieId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        errorToast(errorData?.error);
      }

      const data = await response.json();

      successToast(data?.message);
      router.push('/');
    } catch (error: any) {
      errorToast(error.message);
    } finally {
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  return loading ? (
    <Loader />
  ) : (
    <div className="w-full md:py-120 py-80">
      <h2 className="md:text-heading-two text-heading-three font-semibold">
        {movieId ? 'Edit Movie' : 'Create a new movie'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="md:mt-120 mt-80 flex md:gap-120 gap-6 flex-wrap md:flex-nowrap md:flex-row flex-col-reverse">
          <div
            className="md:max-w-[473px] h-[504px] w-full bg-input cursor-pointer rounded-[10px]"
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {!formData.preview ? (
              <div
                className={cn(
                  'border-2 w-full h-full  border-dashed rounded-[10px] flex justify-center items-center flex-col',
                  errors?.file ? 'border-error' : 'border-white'
                )}
              >
                <Image
                  src="/images/drop-icon.svg"
                  alt="Drop Icon"
                  width={16}
                  height={16}
                />
                <span className="text-body-small mt-8">Drop an image here</span>
              </div>
            ) : (
              <Image
                src={formData?.preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-[10px]"
                width={100}
                height={100}
              />
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {errors?.file && (
              <p className="text-error mt-2 text-left text-body-extra-small !opacity-100">
                {errors?.file}
              </p>
            )}
          </div>

          <div className="space-y-6 w-full">
            <Input
              placeholder="Title"
              type="text"
              name="title"
              value={formData.title}
              error={errors.title}
              onChange={handleChange}
              autoFocus={true}
              autoComplete="off"
              className="w-full md:max-w-[362px]"
            />

            <Input
              placeholder="Publishing year"
              type="text"
              name="publishing_year"
              value={formData.publishing_year}
              error={errors.publishing_year}
              onChange={handleChange}
              autoComplete="off"
              className="w-full md:max-w-[216px]"
            />

            <div className="md:flex hidden gap-16 !mt-[64px] w-full md:max-w-[362px]">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/')}
                disabled={btnLoading}
              >
                Cancel
              </Button>
              <Button type="submit" loading={btnLoading} disabled={btnLoading}>
                {movieId ? 'Update' : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
        <div className="md:hidden flex gap-16 !mt-[40px] w-full md:max-w-[362px]">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/')}
            disabled={btnLoading}
          >
            Cancel
          </Button>
          <Button type="submit" loading={btnLoading} disabled={btnLoading}>
            {movieId ? 'Update' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEditMovie;
