
import { CloudAuditEntry, CloudAuditEntryItem, CloudProduct, Company, LocalProduct, Store, User } from '../db/models.js'
import { CreateAuditArgs } from "../db/types.js"
import { Attributes } from '@sequelize/core'
import { connection } from '../db/db.js'

export async function GetCompanyToken(storeToken: string) {

  const store = await Store.findOne({
    where: {
      storeToken
    }
  })
  return store?.token || null
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
          id: local?.id || undefined
        }
        if (obj.id === undefined) delete obj.id

        const product = await CloudProduct.create(obj, { returning: true })
        entry.cloud = product.dataValues
      }
    }

    const createdAudit = await CloudAuditEntry.create({
      storeName: company?.stores?.find((s) => s.storeToken === args.storeToken)?.name || '',
      auditDate: now,
      companyToken: companyToken,
      companyName: company?.name || '',
      storeCode: args.storeToken,

      loginName: user.login,

    }, { returning: true })


    for (const entry of args.audit) {
      if (entry.cloud == null || entry.local == null) {
        throw new Error('Erro ao criar auditoria: produtos não encontrados ou criados.')
      }
      const cloud = entry.cloud
      const local = entry.local


      await CloudAuditEntryItem.create({
        auditId: createdAudit.id,
        costPrice: local.costValue,
        salePrice: local.sellingValue,
        productId: cloud.id,
        productDescription: cloud.description,
        saleValueDifference: local.sellingValue - cloud.costValue,
        costValueDifference: local.costValue - cloud.costValue,
        stockBalance: entry.total,
        stockCount: entry.total,
        stockDifference: entry.total - cloud.stockBalance,
      })





      await CloudProduct.update(
        {
          stockBalance: entry.total,
          costValue: local.costValue,
          sellingValue: local.sellingValue,
          description: local.description,
          ean: cloud.ean
        },
        { where: { id: cloud.id } }
      )
    }
  })

}
