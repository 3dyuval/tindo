import { AutomergeStore } from "./store/store.automerge.ts"
import { User } from "./user"


function main() {
  const user = new User()
  const store = new AutomergeStore();
  const docUrl = document.location.hash.split("#")[1];
  const doc = store.getDoc(docUrl as any) ||  store.createDoc(['list item1']) as any

  if (docUrl !== doc.url) {
    window.location.hash = doc.url
  }
  const root = document.querySelector<HTMLDivElement>('#app')!;
  root.innerHTML = `
    <h1>Store Example</h1>
    <pre>${JSON.stringify(user, null, 2)}</pre>
    <ul>
     ${JSON.stringify(doc, null, 2)}
    </ul>
  `
}

main()
