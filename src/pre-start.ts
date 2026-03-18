import "dotenv/config"
import { connection } from "./db/db.js"
await connection.sync({})

