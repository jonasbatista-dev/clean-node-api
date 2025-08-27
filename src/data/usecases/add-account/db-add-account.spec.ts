import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  Encrypter,
} from "./db-add-account-protocols";
import { DbAddAccount } from "./db-add-account";

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new EncrypterStub();
};

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: "valid_Id",
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "hashed_password",
      };
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new AddAccountRepositoryStub();
};

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepositoryStub();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
  };
};

describe("DbAddAccount Usecase", () => {
  test("Should call Encrypter with correct password", async () => {
    const { sut, encrypterStub } = makeSut();

    // Vou criar um mock mais explícito
    const mockEncrypt = jest.fn().mockResolvedValue("hashed_password");
    jest.spyOn(encrypterStub, "encrypt").mockImplementation(mockEncrypt);

    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    await sut.add(accountData);

    expect(mockEncrypt).toHaveBeenCalledWith("valid_password");
  });

  test("Should throw  if encrypty throws", async () => {
    const { sut, encrypterStub } = makeSut();

    jest.spyOn(encrypterStub, "encrypt").mockImplementationOnce(async () => {
      return new Promise((_, reject) => reject(new Error()));
    });

    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test("Should call AddAccountRepository with correct password", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");

    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "hashed_password",
    });
  });

  test("Should throw  if AddAccountRepository throws", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockImplementationOnce(async () => {
        return new Promise((_, reject) => reject(new Error()));
      });

    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test("Should return an account on success", async () => {
    const { sut } = makeSut();

    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };
    const account = await sut.add(accountData);
    expect(account).toEqual({
      id: "valid_Id",
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "hashed_password",
    });
  });
});
