const { fastify } = require("./src/server")

const PORT = 3000

fastify.listen({ port: PORT }, (err, address) => {
    if (err) {
        throw err
    }

    console.log(`listening on port ${PORT}...`)
})