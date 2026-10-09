
import { CloudAuditEntry, CloudAuditEntryItem, CloudProduct, Company, Store, User } from '../db/models.js'
import { CreateAuditArgs } from "../db/types.js"
import { Attributes, Op } from '@sequelize/core'
import { connection } from '../db/db.js'
import { addDays } from 'date-fns'

export async function GetCompanyToken(storeToken: string) {

  const store = await Store.findOne({
    where: {
      storeToken
    }
  })
  return store?.token || null
}


export async function GetAuditByStoreCode(code: string, start: Date, end: Date) {
  return CloudAuditEntry.findAll({
    where: {
      storeCode: code,
      auditDate: {
        [Op.gte]: start,
        [Op.lt]: addDays(end, 1)
      }
    },
    include: [CloudAuditEntryItem],
    order: [["id", "desc"]]

  })
}


export async function CreateAudit(user: Attributes<User>, args: CreateAuditArgs) {
  const companyToken = await GetCompanyToken(args.storeToken)
  if (!companyToken) return


  const now = new Date()



  await connection.transaction(async () => {



    const company = await Company.findOne({ where: { token: companyToken }, include: [Store] })



    for (const entry of args.audit) {
      if (entry.cloud == null) {
        const local = entry.local

        const obj = {
          stockBalance: entry.total,
          costValue: local?.costValue || 0,
          sellingValue: local?.sellingValue || 0,
          companyToken: companyToken,

          description: local?.description || '',
          ean: local?.ean || '',
          id: local?.id || undefined,
          updated: now
        }
        if (obj.id === undefined) delete obj.id

        const product = await CloudProduct.create(obj, { returning: true })
        entry.cloud = product.dataValues
      }
    }

    let sellValue = 0;
    let costValue = 0
    let sellDiff = 0;
    let costDiff = 0;
    for (const entry of args.audit) {
      if (entry.local == null) {
        continue
      }
      sellValue += Number(entry.local.sellingValue) * entry.total
      costValue += Number(entry.local.costValue) * entry.total
      let dif = (entry.total - entry.local.stockBalance)
      sellDiff += entry.local.sellingValue * dif
      costDiff += entry.local.costValue * dif


    }

    console.log(sellValue, costValue, sellDiff, costDiff)

    const createdAudit = await CloudAuditEntry.create({
      storeName: company?.stores?.find((s) => s.storeToken === args.storeToken)?.name || '',
      auditDate: now,
      companyToken: companyToken,
      companyName: company?.name || '',
      storeCode: args.storeToken,

      loginName: user.login,
      sellValue,
      costDiff,
      sellDiff,
      costValue
    }, { returning: true })


    for (const entry of args.audit) {
      if (entry.cloud == null || entry.local == null) {
        throw new Error('Erro ao criar auditoria: produtos não encontrados ou criados.')
      }
      const cloud = entry.cloud
      const local = entry.local
      let dif = entry.total - local.stockBalance

      let val = local.sellingValue * dif
      let val2 = local.costValue * dif
      await CloudAuditEntryItem.create({
        auditId: createdAudit.id,
        costPrice: local.costValue,
        salePrice: local.sellingValue,
        productId: cloud.id,
        productDescription: cloud.description,
        saleValueDifference: val,
        costValueDifference: val2,
        stockBalance: local.stockBalance,
        stockCount: entry.total,
        stockDifference:  dif,

      })





      await CloudProduct.update(
        {
          stockBalance: entry.total,
          costValue: local.costValue,
          sellingValue: local.sellingValue,
          description: local.description,
          ean: cloud.ean,
          updated: now
        },
        { where: { id: cloud.id } }
      )
    }
  })

}
