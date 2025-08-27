import { EmailValidatorAdapter } from "./email-validator";
import * as validator from "validator";

jest.mock("validator", () => ({
  isEmail: jest.fn(),
}));

describe("EmailValidator Adapter", () => {
  test("should return false if validator returns false", () => {
    const sut = new EmailValidatorAdapter();
    (validator.isEmail as jest.Mock).mockReturnValueOnce(false);
    const isValid = sut.isValid("inValid_email.com");
    expect(isValid).toBe(false);
  });

  test("should return true if validator returns true", () => {
    const sut = new EmailValidatorAdapter();
    (validator.isEmail as jest.Mock).mockReturnValueOnce(true);
    const isValid = sut.isValid("valid@mail.com");
    expect(isValid).toBe(true);
  });
});
