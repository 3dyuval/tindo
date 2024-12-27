interface Store {
  docs: Array<string>;

  subscribeDoc(callback: (doc: string) => void): void
}