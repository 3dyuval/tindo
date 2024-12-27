import { StoreExample } from "./store.example";
import { Doc, IStore } from "./store.interface";

export class StoreService {

  storeApi: StoreExample;

  constructor(store: IStore) {
    this.storeApi = new StoreExample();
  }

  // Public methods to add/remove/update docs as a placeholder for the real implementation
  public add(url: Doc) {
    this.storeApi.addDoc(url); // Wraps the underlying implementation
  }

  public remove(url: Doc) {
    this.storeApi.removeDoc(url); // Wraps the underlying implementation
  }

  public update(url: Doc, newUrl: Doc) {
    this.storeApi.updateDoc(url, newUrl); // Wraps the underlying implementation
  }

}