import { BaseStore, Publish } from "./store.interface";


export class StoreExample extends BaseStore {

  @Publish('created')
  async createDoc(doc) {
    const id = crypto.randomUUID()
    this.docs.set(id, doc);
    return id;
  }

  async getDoc(url: string) {
    return this.docs.get(url);
  }

  @Publish('updated')
  async updateDoc(url, doc) {
    this.docs.set(url, doc);
  }

  @Publish('deleted')
  async deleteDoc(url) {
    this.docs.delete(url);
  }


}
