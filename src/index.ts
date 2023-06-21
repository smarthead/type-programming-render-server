import { db } from './db';
import { Server } from './server';

const server = new Server();

server.route('/', async () => {
  const pets = await db.getPets();

  return `<!doctype html>
    <html>
      <head>
        <title>Pawsome</title>
      </head>
      <body>
        <h1>Choose your pet</h1>
        <ul>
          ${pets.map(({ title, slug }) => `
            <li>
              <a href="/pets/${slug}">
                ${title}
              </a>
            </li>
          `).join('')}
        </ul>
      </body>
    </html>`;
});

server.route('/pets/:slug', async ({ slug }) => {
  const pet = await db.getPet(slug);
  if (!pet) return null;

  return `<!doctype html>
    <html>
      <head>
        <title>Pawsome | ${pet.title}</title>
      </head>
      <body>
        <a href="/">Home</a>
        <h1>${pet.title}</h1>
        <ul>
          ${pet.photos.map(({ id }) => `
            <li>
              <a href="/pets/${slug}/photos/${id}">
                Photo #${id}
              </a>
            </li>
          `).join('')}
        </ul>
      </body>
    </html>`;
});

server.route('/pets/:slug/photos/:photoId', async ({ slug, photoId }) => {
  const [pet, photo] = await Promise.all([
    db.getPet(slug),
    db.getPhoto(slug, photoId)
  ]);

  if (!pet || !photo) return null;

  return `<!doctype html>
    <html>
      <head>
        <title>Pawsome | ${pet.title} | Photo #${photo.id}</title>
      </head>
      <body>
        <a href="/">Home</a> / <a href="/pets/${slug}">${pet.title}</a>
        <h1>${pet.title}. Photo #${photo.id}</h1>
        <img src="${photo.url}">
      </body>
    </html>`;
});

server.listen(3000);
