import { isValidAutomergeUrl, Repo } from "@automerge/automerge-repo"
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb"
import { BroadcastChannelNetworkAdapter } from "@automerge/automerge-repo-network-broadcastchannel"
import { BaseStore, Doc, Publish } from "./store.interface.ts"


export class AutomergeStore extends BaseStore {

  repo = new Repo({
    storage: new IndexedDBStorageAdapter(),
    network: [
      // @ts-ignore
      new BroadcastChannelNetworkAdapter()
    ]
  })


  @Publish('created')
  async createDoc(doc) {
    return this.repo.create(doc)
  }

  @validDocUrl
  getDoc(url: any) {
    return this.repo.find(url).doc()
  }

  @Publish('updated')
  @validDocUrl
  async updateDoc(url: any, doc: Doc) {
    this.repo.find(url).update(doc)
  }

  @Publish('deleted')
  @validDocUrl
  async deleteDoc(url: any) {
    this.repo.delete(url)
  }


}


function validDocUrl(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    const url = args[0];
    if (isValidAutomergeUrl(url ?? '')) {
      return originalMethod.apply(this, args);
    }
    console.error("Invalid Automerge URL");
  };
}
