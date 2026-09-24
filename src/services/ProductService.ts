import { Op } from '@sequelize/core'
import { CloudProduct } from '../db/models.js'

export async function GetCloudProductByCode(code: string, companyToken:string) {
  return CloudProduct.findOne({
    where: {
      id: Number(code),
      companyToken
    }
  })
}

export async function UpdateCloudProductEan(code: string, ean: string, companyToken:string) {
  return CloudProduct.update(
    { ean },
    {
      where: {
        id: Number(code),
        companyToken
      }
    }
  )
}

export async function GetCloudProductByEan(ean: string, companyToken:string) {
  return CloudProduct.findOne({
    where: {
      ean: {
        [Op.ne]: '',
        [Op.eq]: String(ean)
      },
      companyToken
    }
  })
}

export async function QueryCloudProduct(query: string, companyToken:string) {
  let p = await GetCloudProductByEan(query, companyToken)
  if (p === null && !isNaN(Number(query))) {
    p = await GetCloudProductByCode(query,companyToken)
  }
  return p
}