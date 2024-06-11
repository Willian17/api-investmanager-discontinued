import { dropTestDatabase } from './setup-e2e';

describe('MarksController (e2e)', () => {
  afterAll(async () => {
    await dropTestDatabase();
  }, 30000);
  it('(GET) /marks ', async () => {
    console.log(global.token);
    const response = await global
      .request()
      .get('/marks')
      .set('Authorization', `Bearer ${global.token}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});
