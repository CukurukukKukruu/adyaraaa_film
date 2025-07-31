import React from 'react'
import { Metadata, ResolvingMetadata } from 'next'
import {
  getMovieDetailsById,
  populateMovieDetailsPage,
} from '@/services/movies'

import { getPosterImageURL } from '@/lib/utils'
import { MoviesDetailsContent } from '@/components/media/details-content'
import { MovieDetailsHero } from '@/components/media/details-hero'

export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const movieDetails = await getMovieDetailsById(params.id)

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: movieDetails.title,
    description: movieDetails.overview,
    metadataBase: new URL(`/movies/${params.id}`, process.env.NEXT_PUBLIC_BASE_URL),
    openGraph: {
      images: [
        ...previousImages,
        getPosterImageURL(movieDetails.poster_path),
        getPosterImageURL(movieDetails.backdrop_path),
      ],
    },
  }
}

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
