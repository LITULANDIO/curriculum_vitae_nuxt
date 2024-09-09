import { createReadStream } from 'fs';
import { resolve } from 'path';

export default defineEventHandler((event) => {
  const filePath = resolve('public/files/CV_LITUS.pdf');
  const stream = createReadStream(filePath);

  setHeaders(event, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="curriculum_carles.pdf"',
  });

  return stream;
});