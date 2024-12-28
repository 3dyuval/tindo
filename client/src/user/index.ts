

export class User {

  public readonly uuid = localStorage['uuid'] ||= crypto.randomUUID();

  constructor() {
    console.log("User", this.uuid);
  }

  getUser() {
    return { id: this.uuid }
  }
}