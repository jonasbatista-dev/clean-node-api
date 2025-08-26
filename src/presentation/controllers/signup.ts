import { badRequest, serverError } from "../helpers/http-helper";
import type {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from "../protocols";

import { InvalidParamError, MissingParamError } from "../errors";
import { AddAccount } from "../../domain/usecases/add-account";

export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
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

      const { password, passwordConfirmation, email, name } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError("passwordConfirmation"));
      }

      const isvalid = this.emailValidator.isValid(email);
      if (!isvalid) {
        return badRequest(new InvalidParamError("email"));
      }
      this.addAccount.add({
        name,
        email,
        password,
      });
      return {
        statusCode: 200,
        body: { message: "Signup successful" },
      };
    } catch (error) {
      return serverError();
    }
  }
}
