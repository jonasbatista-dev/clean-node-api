import { MissingParamError } from "../errors/missing-param-error";
import { SignupController } from "./signup";

const makeSut = (): SignupController => {
  return new SignupController();
};

describe("Signup Controller", () => {
  test("Should return 400 if no name is provided", async () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        email: "any@email.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  test("Should return 400 if no email is provided", async () => {
    const sut = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });
});
