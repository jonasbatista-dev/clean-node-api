import { MissingParamError } from "../errors/missing-param-error";
import type { HttpRequest, HttpResponse } from "../protocols/https";
import { badRequest } from "../helpers/http-helper";

export class SignupController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ["name", "email", "password"];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
    return {
      statusCode: 200,
      body: { message: "Signup successful" },
    };
  }
}
