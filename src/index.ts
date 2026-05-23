import "./pre-start.js"
import "./wsserver.js"
import EnvVars from "./consts/env.js"
import server from "./server.js"

server.listen({ port: EnvVars.Port,  host: "0.0.0.0"}, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)

    
})

