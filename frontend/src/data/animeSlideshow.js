// Poster URLs for anime movies (used on Movies page and MovieDetail)
export const POSTER_MAP = {
  'Demon Slayer': 'https://i.pinimg.com/736x/0a/64/c3/0a64c3e5810287b16d4cd149c98240cf.jpg',
  'Demon Slayer: Mugen Train': 'https://i.pinimg.com/736x/0a/64/c3/0a64c3e5810287b16d4cd149c98240cf.jpg',
  'Your Name': 'https://i.pinimg.com/1200x/32/0a/b7/320ab7994967c304099d49b9ba405a70.jpg',
  'Spirited Away': 'https://i.pinimg.com/736x/6a/e6/19/6ae619dffb505316c146d1d7c6b006a4.jpg',
  "Howl's Moving Castle": 'https://i.pinimg.com/1200x/d7/c0/82/d7c082805c7fbe08b2b5298314075d8d.jpg',
  'Weathering With You': 'https://i.pinimg.com/1200x/08/53/77/085377334fcb7f132de1908d72f7b02c.jpg',
};

export function getPosterForMovie(movie) {
  if (!movie) return '';
  return POSTER_MAP[movie.title] || movie.poster || `https://picsum.photos/seed/${movie._id}/600/900`;
}

// Famous anime movie posters for slideshow
export const ANIME_SLIDES = [
  { id: 1, title: 'Demon Slayer', poster: 'https://i.pinimg.com/736x/0a/64/c3/0a64c3e5810287b16d4cd149c98240cf.jpg' },
  { id: 2, title: 'Your Name', poster: 'https://i.pinimg.com/1200x/32/0a/b7/320ab7994967c304099d49b9ba405a70.jpg' },
  { id: 3, title: 'Spirited Away', poster: 'https://i.pinimg.com/736x/6a/e6/19/6ae619dffb505316c146d1d7c6b006a4.jpg' },
  { id: 4, title: "Howl's Moving Castle", poster: 'https://i.pinimg.com/1200x/d7/c0/82/d7c082805c7fbe08b2b5298314075d8d.jpg' },
  { id: 5, title: 'Weathering With You', poster: 'https://i.pinimg.com/1200x/08/53/77/085377334fcb7f132de1908d72f7b02c.jpg' },
];
