const fastify = require("fastify")()

const { Dealer } = require("./Dealer")
const { Scheduler } = require("./Scheduler")

const scheduler = new Scheduler({
    cardsTeam: [
        new Dealer({
            log: console.log,
            id: "Carlos",
            teamName: "CARD"
        }),
        new Dealer({
            log: console.log,
            id: "José",
            teamName: "CARD"
        }),
        new Dealer({
            log: console.log,
            id: "Amanda",
            teamName: "CARD"
        })
    ],
    lendingTeam: [
        new Dealer({
            log: console.log,
            id: "Josefino",
            teamName: "LENDING"
        }),
        new Dealer({
            log: console.log,
            id: "Pedrolina",
            teamName: "LENDING"
        })
    ],
    otherTeam: [
        new Dealer({
            log: console.log,
            id: "Eduardo",
            teamName: "OTHER"
        })
    ]
})

fastify.get("/status", async (req, res) => {
    const status = scheduler.getStatus()

    res.type("application/json").code(200)
    return status
})

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
    scheduler.scheduleMessageDealing(req.body)

    res.type("application/json").code(200)
    return {
        result: "ok"
    }
})

module.exports = { fastify }