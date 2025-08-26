import type { HttpRequest, HttpResponse } from "../protocols/https";

export class SignupController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new Error("Missing param: name"),
      };
    }
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new Error("Missing param: email"),
      };
    }

    return {
      statusCode: 200,
      body: { message: "Signup successful" },
    };
  }
}
