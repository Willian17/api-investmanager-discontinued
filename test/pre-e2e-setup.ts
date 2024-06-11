import * as dotenv from 'dotenv';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

dotenv.config({ path: '.env.test' });

let app: INestApplication;

async function createToken() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();

  const signupResponse = await request(app.getHttpServer())
    .post('/auth/signup')
    .send({
      email: 'test@email.com',
      name: 'test',
      password: 'test',
    });

  if (signupResponse.status !== 200) {
    throw new Error(`Failed to signup: ${signupResponse.body.message}`);
  }

  const signinResponse = await request(app.getHttpServer())
    .post('/auth/signin')
    .send({
      email: 'test@email.com',
      password: 'test',
    });

  if (signinResponse.status !== 200) {
    throw new Error(`Failed to signin: ${signinResponse.body.message}`);
  }

  const token = signinResponse.body.access_token;
  await app.close();

  return token;
}

export { createToken };
