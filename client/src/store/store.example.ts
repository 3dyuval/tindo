import { CallbackOptions, Doc, IStore } from "./store.interface";

export class StoreExample implements IStore {
  subscribers: CallbackOptions = {};

  // Method to subscribe to events
  subscribe(callbackOptions: CallbackOptions) {
    this.subscribers = { ...this.subscribers, ...callbackOptions };
  }

  addDoc(url: Doc) {
    this.subscribers.created?.(url); // Invoke created callback if provided
  }

  removeDoc(url: Doc) {
    this.subscribers.deleted?.(url); // Invoke deleted callback if provided
  }

  updateDoc(url: Doc, newUrl: Doc) {
    this.subscribers.updated?.(newUrl); // Invoke updated callback if provided
  }
}
