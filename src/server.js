const fastify = require("fastify")()

const { Dealer } = require("./Dealer")
const { Scheduler } = require("./Scheduler")

const scheduler = new Scheduler(new Map([
    [
        "CARD",
        [
            new Dealer({
                log: console.log,
                id: "Carlos",
                teamName: "CARD",
                delayRange: [1000, 3000]
            }),
            new Dealer({
                log: console.log,
                id: "José",
                teamName: "CARD",
                delayRange: [1000, 5000]
            }),
            new Dealer({
                log: console.log,
                id: "Amanda",
                teamName: "CARD",
                delayRange: [1000, 1001]
            })
        ]
    ],
    [
        "LENDING",
        [
            new Dealer({
                log: console.log,
                id: "Josefino",
                teamName: "LENDING",
                delayRange: [5000, 10000]
            }),
            new Dealer({
                log: console.log,
                id: "Pedrolina",
                teamName: "LENDING",
                delayRange: [1000, 1500]
            })
        ]
    ],
    [
        "OTHER",
        [
            new Dealer({
                log: console.log,
                id: "Eduardo",
                teamName: "OTHER",
                delayRange: [1000, 5000]
            })
        ]
    ]
]))

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
                    maxLength: 255
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