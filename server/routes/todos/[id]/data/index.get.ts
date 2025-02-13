import { s3client } from "~~/utils/s3"


export default eventHandler(async (event) => {

  const fileName = getRouterParam(event, 'id')

  try {
    const data = await s3client.getObject('tindo', fileName as string)
    return new Response(data)
  } catch (err) {
    console.error('Error fetching file:', err, {
      status: 500
    });
    // Handle error appropriately
  }
})