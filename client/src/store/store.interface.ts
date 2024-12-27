
export type Doc = string; // Replace with actual Doc type definition

export interface CallbackOptions {
  created?: (doc: Doc) => void; // Callback for document creation
  updated?: (doc: Doc) => void; // Callback for document update
  deleted?: (doc: Doc) => void; // Callback for document deletion
}

export interface IStore {
  //public methods
  addDoc(url: Doc): void; // Add a document
  removeDoc(url: Doc): void; // Remove a document
  updateDoc(url: Doc, newUrl: Doc): void; // Update a document
  subscribe(callbackOptions: CallbackOptions): void; // Subscribe to callbacks
}
