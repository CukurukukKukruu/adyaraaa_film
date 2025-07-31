import React from 'react'
import { Metadata, ResolvingMetadata } from 'next'
import {
  getMovieDetailsById,
  populateMovieDetailsPage,
} from '@/services/movies'

import { getPosterImageURL } from '@/lib/utils'
import { MoviesDetailsContent } from '@/components/media/details-content'
import { MovieDetailsHero } from '@/components/media/details-hero'

// ✅ Fix parameter typing sesuai Next.js 15
export async function generateMetadata(
  props: any, // Gunakan `any` untuk menghindari error typing Promise
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = props?.params?.id
  const movieDetails = await getMovieDetailsById(id)

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: movieDetails.title,
    description: movieDetails.overview,
    metadataBase: new URL(`/movies/${id}`, process.env.NEXT_PUBLIC_BASE_URL),
    openGraph: {
      images: [
        ...previousImages,
        getPosterImageURL(movieDetails.poster_path),
        getPosterImageURL(movieDetails.backdrop_path),
      ],
    },
  }
}

// ✅ Sama di komponen page utamanya
const MoviePage = async ({
  params,
}: {
  params: { id: string }
}) => {
  const { movieCredits, movieDetails, similarMovies, recommendedMovies } =
    await populateMovieDetailsPage(params.id)

  return (
    <header className="relative">
      <MovieDetailsHero movie={movieDetails} />
      <MoviesDetailsContent
        movie={movieDetails}
        movieCredits={movieCredits}
        similarMovies={similarMovies}
        recommendedMovies={recommendedMovies}
      />
    </header>
  )
}

export default MoviePage
