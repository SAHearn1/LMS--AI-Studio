import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL || 'postgresql://rootwork:rootwork_dev@localhost:5432/rootwork_lms',
}));
