//@ts-nocheck
import { koa, rest, bodyParser, errorHandler, serveStatic } from '@feathersjs/koa'
import { feathers } from '@feathersjs/feathers'
import { TodosService } from "./services/todos/todos.service"
import { config } from 'dotenv'
import * as path from "node:path"

config({ path: path.join(__dirname, '..', '.env') })
const app = koa(feathers())

app.use(bodyParser())
app.use(serveStatic('public'))
app.use(rest())
app.use(errorHandler())
app.use(async (ctx, next) => {
  await next()
  if (ctx.status === 404) {
    ctx.body = '404 - Not Found'
  }
})

app.use('/todos', new TodosService())

app.listen(8080)
.then(() => console.log('Feathers app started on localhost:8080'))
.catch(console.error)