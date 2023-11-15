const fastify = require("fastify")()

fastify.post("/message", {
    schema: {
        body: {
            type: "object",
            required: ["category", "description"],
            properties: {
                category: {
                    type: "string",
                    enum: ["CARD", "LENDING", "OTHER"]
                },
                description: {
                    type: "string",
                    maxLength: 365
                }
            }
        }
    }
}, async (req, res) => {
    const { category, description } = req.body

    switch (category) {
        case "CARD": {
            console.log("cartao")
        }
        case "LENDING": {
            console.log("emprestimo")
        }
        case "OTHER": {
            console.log("outros")
        }
    }

    res.type("application/json").code(200)
    return {
        result: "ok"
    }
})

fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
        throw err
    }
})