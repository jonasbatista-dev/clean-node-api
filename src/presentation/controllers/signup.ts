import { badRequest, serverError } from "../helpers/http-helper";
import type {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from "../protocols";

import { InvalidParamError, MissingParamError } from "../errors";

export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { password, passwordConfirmation, email } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError("passwordConfirmation"));
      }

      const isvalid = this.emailValidator.isValid(email);
      if (!isvalid) {
        return badRequest(new InvalidParamError("email"));
      }

      return {
        statusCode: 200,
        body: { message: "Signup successful" },
      };
    } catch (error) {
      return serverError();
    }
  }
}
