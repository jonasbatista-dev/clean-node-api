import { SignupController } from './signup';

describe('Signup Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const sut = new SignupController();
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponde = sut.handle(httpRequest);
    expect(httpResponde.statusCode).toBe(400);
  });
});
