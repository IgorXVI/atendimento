const fastify = require("fastify")()

class Dealer {
    constructor(attrs = {
        log: (str = "") => { },
        id: "default",
        teamName: "OTHER"
    }) {
        this._log = attrs.log
        this._id = attrs.id
        this._teamName = attrs.teamName

        this._messageCount = 0

        setTimeout(this._dealingProcess.bind(this), 5000)
    }

    _dealingProcess() {
        this._log(`dealer ${this._id} of team ${this._teamName} dealing...`)

        if (this._messageCount > 0) {
            this._messageCount--
        }

        setTimeout(this._dealingProcess.bind(this), 5000)
    }

    dealWithMessage() {
        if (this._messageCount < 3) {
            this._messageCount++
        }

        this._log(`new message assigned to ${this._id} of theam ${this._teamName}, his count now at ${this._messageCount}`)
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

        setTimeout(this._distributeMessages.bind(this), 500)
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

        setTimeout(this._distributeMessages.bind(this), 500)
    }

    scheduleMessageDealing(message = {
        category: "OTHER",
        description: ""
    }) {
        this._messageQueue.push(message)
    }

    getStatus() {
        let status = {
            messageQueue: this._messageQueue
        }

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

fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
        throw err
    }
})