/*
Classe para simular um atendente.
Vai receber o id, o time e o intervalo de demora no construtor.
O id e o time vão ser usados para os logs.
O intervalo de demora vai ser usado para simular o tempo de atendimento de cada mensagem.
Cada atendente só vai poder lidar com 3 mensagens ao mesmo tempo.
*/

class Dealer {
    constructor(attrs = {
        log: (str = "") => { },
        id: "default",
        teamName: "OTHER",
        delayRange: [1000, 5000]
    }) {
        this._log = attrs.log
        this._id = attrs.id
        this._teamName = attrs.teamName

        const min = attrs.delayRange[0] || 0
        const max = attrs.delayRange[1] || 0

        if (min > max) {
            throw new TypeError(`Value of min must be smaller than value of max! received [${min}, ${max}]`)
        }

        this._delayMin = min
        this._delayMax = max

        this._messageCount = 0

        setTimeout(this._dealingProcess.bind(this), this._randomInInterval())
    }

    _randomInInterval() {
        return Math.floor(Math.random() * (this._delayMax - this._delayMin + 1) + this._delayMin)
    }

    _dealingProcess() {
        if (this._messageCount > 0) {
            this._log(`dealer ${this._id} of team ${this._teamName} dealing...`)

            this._messageCount--
        }

        setTimeout(this._dealingProcess.bind(this), this._randomInInterval())
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