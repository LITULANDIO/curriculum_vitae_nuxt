import { createReadStream } from 'fs';
import { resolve } from 'path';

export default defineEventHandler((event) => {
  const filePath = resolve('public/files/cv_litus.png');
  const stream = createReadStream(filePath);

  setHeaders(event, {
    'Content-Type': 'application/png',
    'Content-Disposition': 'attachment; filename="cv_litus.png"',
  });

  return stream;
});