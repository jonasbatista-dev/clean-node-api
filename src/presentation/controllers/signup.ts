import { MissingParamError } from "../errors/missing-param-error";
import type { HttpRequest, HttpResponse } from "../protocols/https";
import { badRequest, serverError } from "../helpers/http-helper";
import type { Controller } from "../protocols/controler";
import type { EmailValidator } from "../protocols/email-validator";
import { InvalidParamError } from "../errors/invalid-param-error";
import { ServerError } from "../errors/server-error";

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
      const isvalid = this.emailValidator.isValid(httpRequest.body.email);
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
