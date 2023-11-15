const fastify = require("fastify")()

class Dealer {
    constructor() {
        this._messageCount = 0

        setTimeout(() => this._dealingProcess.bind(this), 5000)
    }

    _dealingProcess() {
        if (this._messageCount > 0) {
            this._messageCount--
        }
    }

    dealWithMessage() {
        if (this._messageCount < 3) {
            this_messageCount++
        }
    }

    isFull() {
        return this._messageCount >= 3
    }
}

class Scheduler {
    constructor(attrs = {
        cardsTeam: [new Dealer()],
        lendingTeam: [new Dealer()],
        otherTeam: [new Dealer()]
    }) {
        this._teamsMap = {
            "CARD": attrs.cardsTeam,
            "LENDING": attrs.lendingTeam,
            "OTHER": attrs.otherTeam
        }

        this._categories = Object.keys(this._teamsMap)

        this._messageQueue = []

        setTimeout(() => this._distributeMessages.bind(this), 500)
    }

    _distributeMessages() {
        let updatedQueue = []

        for (const message of this._messageQueue) {
            const freeDealer = this._teamsMap[message.category].find(dealer => !dealer.isFull())

            if (!freeDealer) {
                updatedQueue.push(message)
                continue
            }

            freeDealer.dealWithMessage()
        }

        this._messageQueue = updatedQueue
    }

    scheduleMessageDealing(message = {
        category: "OTHER",
        description: ""
    }) {
        this._messageQueue.push(message)
    }

    getStatus() {
        let status = {}

        this._categories.forEach(category => {
            const busyDealers = this._teamsMap[category].filter(dealer => dealer.isFull()).length

            const freeDealers = this._teamsMap[category].length - busyDealers

            status[category] = {
                busyDealers,
                freeDealers
            }
        })

        return status
    }
}

const scheduler = new Scheduler({
    cardsTeam: [new Dealer(), new Dealer(), new Dealer()],
    lendingTeam: [new Dealer(), new Dealer()],
    otherTeam: [new Dealer()]
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

fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
        throw err
    }
})