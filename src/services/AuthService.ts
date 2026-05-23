import { Company, CompanyLoginAssociation, Store, User } from '../db/models.js'
import { UserLogin } from '../db/types.js'

interface LoginParams {
  username: string
  password: string,
  storeToken: string
}


interface PreLoginParams {
  username: string
  password: string,
}

export async function PreLogin(params: PreLoginParams) {
  const user = await User.findOne({
    where: {
      login: params.username, 
      password: String(params.password),
      active:true
    }
  })

  if(!user){
    return null
  }
  
  const validCompanies = await Company.findAll({
    where: {
      active: true
    },
    include: [Store]
  })

  return validCompanies
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
        where:{
          active: true
        },
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


  return {...association.toJSON(), storeToken: params.storeToken} as UserLogin
}

export async function WsAuthenticate(token: string) {
const store = await Store.findOne({
    where: {
      storeToken: token
    }
  })


 
  
  return store
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

