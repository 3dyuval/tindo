import { StoreExample } from "./store.example";
import { Doc, IStore } from "./store.interface";

export class StoreService {

  store: IStore;

  constructor(Store: new () => IStore) {
    this.store = new Store();
  }

  // Public methods to add/remove/update docs as a placeholder for the real implementation
  public add(url: Doc) {
    this.store.addDoc(url); // Wraps the underlying implementation
  }

  public remove(url: Doc) {
    this.store.removeDoc(url); // Wraps the underlying implementation
  }

  public update(url: Doc, newUrl: Doc) {
    this.store.updateDoc(url, newUrl); // Wraps the underlying implementation
  }

}