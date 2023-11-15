const { Dealer } = require("./Dealer")


/*
Classe para distribuir as mensagens entre os grupos de atendentes.
Vai salvar as mensagens na lista "_messageQueue".
A cada 500 milisegundos, vai conferir para cada mensagem se existe um atendente livre para lidar com ela,
se existir, tira a mensagem da lista e avisa o objeto do atendente que ele vai lidar com uma mensasgem.
*/

class Scheduler {
    constructor(teamsMap = new Map([["OTHER", [new Dealer()]]])) {
        this._teamsMap = teamsMap

        this._messageQueue = []

        setTimeout(this._distributeMessages.bind(this), 500)
    }

    _distributeMessages() {
        let updatedQueue = []

        for (const message of this._messageQueue) {
            const freeDealer = this._teamsMap.get(message.category).find(dealer => !dealer.isFull())

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

        this._teamsMap.forEach((dealers, category) => {
            const busyDealers = dealers.filter(dealer => dealer.isFull()).length

            const freeDealers = dealers.length - busyDealers

            status[category] = {
                busyDealers,
                freeDealers
            }
        })

        return status
    }
}

module.exports = { Scheduler }