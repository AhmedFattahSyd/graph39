// module user
// represent an authenticated user

export default class User {
  protected _signedOn: boolean = false;
  public get signedOn(): boolean {
    return this._signedOn;
  }

  protected _name: string | null = null;
  public get name(): string | null {
    return this._name;
  }

  signOn = async () => {};

  signOff = async () => {};

  init = async () => {};
}
