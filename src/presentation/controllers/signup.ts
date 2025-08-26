import { MissingParamError } from "../errors/missing-param-error";
import type { HttpRequest, HttpResponse } from "../protocols/https";
import { badRequest } from "../helpers/http-helper";

export class SignupController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError("name"));
    }
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError("email"));
    }
    return {
      statusCode: 200,
      body: { message: "Signup successful" },
    };
  }
}
