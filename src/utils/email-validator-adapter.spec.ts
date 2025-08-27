import { EmailValidatorAdapter } from "./email-validator-adapter";
import * as validator from "validator";

jest.mock("validator", () => ({
  isEmail: jest.fn(),
}));

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe("EmailValidator Adapter", () => {
  test("should return false if validator returns false", () => {
    const sut = makeSut();
    (validator.isEmail as jest.Mock).mockReturnValueOnce(false);
    const isValid = sut.isValid("inValid_email.com");
    expect(isValid).toBe(false);
  });

  test("should return true if validator returns true", () => {
    const sut = makeSut();
    (validator.isEmail as jest.Mock).mockReturnValueOnce(true);
    const isValid = sut.isValid("valid@mail.com");
    expect(isValid).toBe(true);
  });

  test("should call validator with correct email", () => {
    const sut = makeSut();
    (validator.isEmail as jest.Mock).mockReturnValueOnce(true);
    const isEmailSpy = jest.spyOn(validator, "isEmail");
    sut.isValid("valid@mail.com");
    expect(isEmailSpy).toHaveBeenCalledWith("valid@mail.com");
  });
});
