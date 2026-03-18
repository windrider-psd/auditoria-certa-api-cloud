import { InferAttributes, Attributes } from "@sequelize/core"
import {CloudProduct, LocalProduct} from "./models.ts"
import { Company, CompanyLoginAssociation, User } from "./models.ts"

export type RendererCloudProduct = InferAttributes<CloudProduct>
export type RendererLocalProduct = InferAttributes<LocalProduct>
export type RendererProductQueryResult = [RendererCloudProduct | null, RendererLocalProduct | null]

export type AuditEntry = {
  cloud: RendererCloudProduct | null
  local: RendererLocalProduct | null
  total: number
  id: number
}
export type Audit = AuditEntry[]

export type UserLogin = Attributes<CompanyLoginAssociation> & {
  user: Attributes<User>
  company: Attributes<Company>
}


type CreateAuditArgs = {
  audit: Audit,
  storeToken: string,
  params: {
    almoxarifado: number,
    inventoryId: number,
    inventoryName: string
  }
}