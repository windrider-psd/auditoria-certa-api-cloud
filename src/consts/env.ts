export default {
    NodeEnv: (process.env.NODE_ENV ?? ""),
    Port: (Number(process.env.PORT) ?? 0),
    JwtSecret: (process.env.JWT_SECRET ?? ""),
    Db:{
        User: (process.env.DB_USER ?? ""),
        Pass: (process.env.DB_PASS ?? ""),
        Host: (process.env.DB_HOST ?? ""),
        Database: (process.env.DB_DATABASE ?? ""),
    },
    DefaultAdmin:{
        Username: (process.env.DEFAULT_ADMIN_USERNAME ?? ""),
        Pass:(process.env.DEFAULT_ADMIN_PASS ?? "")
    }

}