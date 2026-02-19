import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

const PASSWORD = 'RoleTest123';

describe('Role Guard (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  async function registerAndLogin(role: 'TEACHER' | 'STUDENT') {
    const nonce = Date.now().toString();
    const email = `${role.toLowerCase()}.${nonce}@rbac.test`;

    await request(app.getHttpServer()).post('/auth/register').send({
      email,
      password: PASSWORD,
      firstName: role,
      lastName: 'Tester',
      role,
    });

    const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
      email,
      password: PASSWORD,
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body?.accessToken).toBeDefined();

    return loginResponse.body.accessToken as string;
  }

  it('allows TEACHER to access /users', async () => {
    const token = await registerAndLogin('TEACHER');

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
  });

  it('denies STUDENT from accessing /users', async () => {
    const token = await registerAndLogin('STUDENT');

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
  });
});

