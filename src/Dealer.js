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

module.exports = { Dealer }