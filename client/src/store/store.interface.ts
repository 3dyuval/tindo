export type Doc = any; // Replace with actual Doc type definition

export interface SubscriptionCallbacks {
  created?: (doc: Doc) => void; // Callback for document creation
  updated?: (doc: Doc) => void; // Callback for document update
  deleted?: (doc: Doc) => void; // Callback for document deletion
}

export abstract class BaseStore {

  docs = new Map<string, Doc>;
  subscriptions = new Map<string, SubscriptionCallbacks>();

  constructor() {
  }

  subscribe(url, callback: SubscriptionCallbacks) {
    this.subscriptions.set(url, callback);
  }

  unsubscribe(url: string) {
    this.subscriptions.delete(url);
  }

  abstract createDoc<T extends string>(doc: Doc): Promise<T | any>;

  abstract getDoc<T extends string>(url: T, doc: Doc): Promise<Doc>;

  abstract updateDoc<T extends string>(url: T, doc: Doc): Promise<Doc>;

  abstract deleteDoc<T extends string>(url: T): Promise<void>;


}

export function Publish(method: 'created' | 'deleted' | 'updated') {

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      return originalMethod.apply(this, args).then(result => {
        const url = args[0];
        target.subscriptions.get(url)?.[method]?.(result);
        return result;
      });
    };
  }
}