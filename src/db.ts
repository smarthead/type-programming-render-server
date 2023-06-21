// Fake database
export const db = {
  getPets: () => Promise.resolve(data),

  getPet: (slug: string) => Promise.resolve(
    data.find(pet => pet.slug === slug)
  ),

  getPhoto: (slug: string, photoId: string) => Promise.resolve(
    data
      .find(pet => pet.slug === slug)?.photos
      .find(photo => photo.id === photoId)
  )
};

const data = [
  {
    title: 'Cats',
    slug: 'cats',
    photos: [
      {
        id: '1',
        url: 'https://loremflickr.com/640/480/cat?lock=70'
      },
      {
        id: '2',
        url: 'https://loremflickr.com/640/480/cat?lock=80'
      },
      {
        id: '3',
        url: 'https://loremflickr.com/640/480/cat?lock=11'
      }
    ]
  },
  {
    title: 'Dogs',
    slug: 'dogs',
    photos: [
      {
        id: '1',
        url: 'https://loremflickr.com/640/480/dog?lock=6'
      },
      {
        id: '2',
        url: 'https://loremflickr.com/640/480/dog?lock=1'
      },
      {
        id: '3',
        url: 'https://loremflickr.com/640/480/dog?lock=7'
      }
    ]
  }
];
