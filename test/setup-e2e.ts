import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { execSync } from 'child_process';
import { createToken } from './pre-e2e-setup';

// Carregar variáveis de ambiente de .env.test
dotenv.config({ path: '.env.test' });

let app: INestApplication;
let token: string;

async function createTestDatabase() {
  const client = new Client({
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  });

  await client.connect();
  try {
    console.log(`Creating database ${process.env.DATABASE_NAME}`);
    await client.query(`CREATE DATABASE ${process.env.DATABASE_NAME};`);
    console.log(`Database ${process.env.DATABASE_NAME} created`);
  } catch (err) {
    console.error(err);
    if (err.code !== '42P04') {
      // Código de erro para 'database already exists'
      throw err;
    }
  } finally {
    await client.end();
  }
}

async function dropTestDatabase() {
  const client = new Client({
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  });

  await client.connect();
  try {
    console.log(`Drop database ${process.env.DATABASE_NAME}`);
    await client.query(`DROP DATABASE ${process.env.DATABASE_NAME};`);
    console.log(`Database ${process.env.DATABASE_NAME} droped`);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
}

beforeAll(async () => {
  await createTestDatabase();

  execSync('npm run migration:run', { stdio: 'inherit' });

  await createToken();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
}, 30000);

afterAll(async () => {
  if (app) {
    await app.close();
  }
}, 30000);

export { dropTestDatabase };

global.request = () => request(app.getHttpServer());
global.token = token;
