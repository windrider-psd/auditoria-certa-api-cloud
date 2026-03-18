import {
	importModels,
	Sequelize
} from '@sequelize/core'
import { PostgresDialect } from '@sequelize/postgres';
import env from '../consts/env.js';

console.log(import.meta.url)
export const connection = new Sequelize({
	dialect: PostgresDialect,
	database: env.Db.Database,
	user: env.Db.User,
	password: env.Db.Pass,
	host: env.Db.Host,
	port: 5432,
	clientMinMessages: 'notice',
	pool: { max: 2, idle: Infinity, maxUses: Infinity },
	logging: undefined,
	models: await importModels(import.meta.url)
})
