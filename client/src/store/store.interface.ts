
export type Doc = string; // Replace with actual Doc type definition

export interface CallbackOptions {
  created?: (doc: Doc) => void; // Callback for document creation
  updated?: (doc: Doc) => void; // Callback for document update
  deleted?: (doc: Doc) => void; // Callback for document deletion
}

export abstract class  IStore {
  //public methods

  constructor() {
    this.subscribe({});
  }
   abstract addDoc(url: Doc): void; // Add a document
   abstract removeDoc(url: Doc): void; // Remove a document
   abstract updateDoc(url: Doc, newUrl: Doc): void; // Update a document
   abstract subscribe(callbackOptions: CallbackOptions): void; // Subscribe to callbacks
}
