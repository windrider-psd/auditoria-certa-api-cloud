import { Company, CompanyLoginAssociation, Store, User } from '../db/models.js'
import { UserLogin } from '../db/types.js'

interface LoginParams {
  username: string
  password: string,
  storeToken: string
}

export async function Login(params: LoginParams) {
  const association = await CompanyLoginAssociation.findOne({
    include: [
      {
        model: User,
        where: {
          login: params.username,
          password: params.password,
          active: true
        }
      },
      {
        model: Company,
        include: [
          {
            model: Store,
            where: {
              storeToken: params.storeToken
            }
          }
        ]
      }
    ]
  })

  if (!association) {
    return null
  }

  return association.toJSON() as UserLogin
}

export async function GetLogin(userId: number){
  const association = await CompanyLoginAssociation.findOne({
    include: [
      {
        model: User,
        where: {
          id:userId
        }
      }
    ]
  })

  return association

}

