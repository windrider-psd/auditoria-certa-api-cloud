import {
	importModels,
	Sequelize
} from '@sequelize/core'
import { PostgresDialect } from '@sequelize/postgres';
import env from '../consts/env.js';
import { CloudAuditEntry, CloudAuditEntryItem, CloudProduct, Company, CompanyLoginAssociation, Store, User } from './models.js';

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
	models: [Company, CompanyLoginAssociation, User, Store, CloudProduct, CloudAuditEntry, CloudAuditEntryItem]
})
