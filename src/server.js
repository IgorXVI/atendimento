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

fastify.register(require("@fastify/swagger"), {
    swagger: {
        info: {
            title: "API REST Atendimento",
            description: "API REST para lidar com o atendimento de clientes.",
            version: "0.1.0"
        },
        externalDocs: {
            url: "https://swagger.io",
            description: "Find more info here"
        },
        host: "localhost",
        schemes: ["http"],
        consumes: ["application/json"],
        produces: ["application/json"],
        tags: [
            { name: "Envio", description: "Rota para envio de mensagens." },
            { name: "Status", description: "Rota para ver como as mensagens estão sendo processadas." }
        ]
    }
}).then(() => {
    console.log("registered @fastify/swagger")

    return fastify.register(require('@fastify/swagger-ui'), {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false
        },
        staticCSP: true
    })
}).then(() => {
    console.log("registed @fastify/swagger-ui")

    fastify.get("/status", {
        schema: {
            tags: ["Status"],
            response: {
                200: {
                    description: "Informações sobre a fila de mensagens e sobre quantos atendentes estão ocupados em cada grupo.",
                    type: "object",
                    properties: {
                        messageQueue: {
                            type: "array",
                            items: {
                                type: "object",
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
                        },
                        CARD: {
                            type: "object",
                            properties: {
                                busyDealers: { type: "integer" },
                                freeDealers: { type: "integer" }
                            }
                        },
                        LENDING: {
                            type: "object",
                            properties: {
                                busyDealers: { type: "integer" },
                                freeDealers: { type: "integer" }
                            }
                        },
                        OTHER: {
                            type: "object",
                            properties: {
                                busyDealers: { type: "integer" },
                                freeDealers: { type: "integer" }
                            }
                        }
                    }
                }
            }
        },

        handler: async (req, res) => {
            const status = scheduler.getStatus()

            res.type("application/json").code(200)
            return status
        }
    })

    fastify.post("/message", {
        schema: {
            tags: ["Envio"],
            body: {
                description: "Mensagem que vai ser enviada para os atendentes, o campo 'category' informa qual o grupo de atendentes vai lidar com a mensagem e o campo 'description' contém a mensagem em si.",
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
            },
            response: {
                200: {
                    description: "Resposta para operação bem sucedida.",
                    type: "object",
                    properties: {
                        result: {
                            type: "string",
                            enum: ["OK"]
                        }
                    }
                }
            }
        },

        handler: async (req, res) => {
            scheduler.scheduleMessageDealing(req.body)

            res.type("application/json").code(200)
            return {
                result: "OK"
            }
        }
    })
})

module.exports = { fastify }