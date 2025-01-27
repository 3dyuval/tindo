import  handleCors  from "./_cors"
import auth from "./auth"


export default eventHandler(async (event) => {
  handleCors(event)
  auth(event)
})