class Scheduler {
    constructor(attrs = {
        cardsTeam: [],
        lendingTeam: [],
        otherTeam: []
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

module.exports = { Scheduler }