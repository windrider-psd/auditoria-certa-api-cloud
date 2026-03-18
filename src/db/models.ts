import {
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type NonAttribute
} from '@sequelize/core'
import {
  Attribute,
  PrimaryKey,
  AutoIncrement,
  NotNull,
  Table,
  Unique,
  Index,
  ColumnName,
  BelongsTo,
  Default
} from '@sequelize/core/decorators-legacy'

@Table({ tableName: 'integraloja_auditoria_login', timestamps: false })
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  @ColumnName('login_id')
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING(100))
  @NotNull
  @Index
  @Unique
  @ColumnName('login_login')
  declare login: string

  @Attribute(DataTypes.STRING(50))
  @ColumnName('login_senha')
  @NotNull
  declare password: string

  @Attribute(DataTypes.STRING(50))
  @ColumnName('login_nome')
  @NotNull
  declare name: string

  @Attribute(DataTypes.BOOLEAN)
  @ColumnName('login_ativo')
  @NotNull
  declare active: boolean

  @Attribute(DataTypes.BOOLEAN)
  @ColumnName('login_adm')
  @NotNull
  declare admin: boolean

  @Attribute(DataTypes.STRING(500))
  @ColumnName('login_email')
  @NotNull
  declare email: string
}

@Table({ tableName: 'integraloja_auditoria_login_empresas', timestamps: false })
export class CompanyLoginAssociation extends Model<
  InferAttributes<CompanyLoginAssociation>,
  InferCreationAttributes<CompanyLoginAssociation>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  @ColumnName('login_empresas_id')
  declare id: CreationOptional<number>

  @BelongsTo(() => User, 'userId')
  declare user?: NonAttribute<User>

  @BelongsTo(() => Company, 'companyId')
  declare company?: NonAttribute<Company>

  //foreign keys

  @Attribute(DataTypes.INTEGER)
  @ColumnName('login_id')
  declare userId: number

  @Attribute(DataTypes.INTEGER)
  @ColumnName('empresa_id')
  declare companyId: number
}

@Table({ tableName: 'integraloja_empresas', timestamps: false })
export class Company extends Model<InferAttributes<Company>, InferCreationAttributes<Company>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  @ColumnName('empresa_id')
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING(10))
  @NotNull
  @Unique
  @Index
  @ColumnName('empresa_token')
  declare token: string

  @Attribute(DataTypes.STRING(100))
  @ColumnName('empresa_nome')
  @NotNull
  declare name: string

  @Attribute(DataTypes.STRING(18))
  @ColumnName('empresa_cnpj')
  @NotNull
  declare cnpj: string

  @Attribute(DataTypes.BOOLEAN)
  @ColumnName('empresa_ativa')
  @NotNull
  declare active: boolean

  @Attribute(DataTypes.STRING(500))
  @ColumnName('email')
  @NotNull
  declare email: string

  declare stores?: NonAttribute<Store[]>
}

@Table({ tableName: 'integraloja_dados_lojas', timestamps: false })
export class Store extends Model<InferAttributes<Store>, InferCreationAttributes<Store>> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  @ColumnName('loja_id')
  declare id: CreationOptional<number>

  @BelongsTo(() => Company, {
    foreignKey: 'token',
    targetKey: 'token',
    inverse: {
      as: 'stores',
      type: 'hasMany'
    }
  })
  declare company?: NonAttribute<Company>

  @Attribute(DataTypes.STRING(10))
  @NotNull
  @Index
  @ColumnName('empresa_token')
  declare token: string

  @Attribute(DataTypes.STRING(10))
  @ColumnName('loja_codigo')
  @NotNull
  declare storeToken: string

  @Attribute(DataTypes.STRING(100))
  @ColumnName('loja_nome')
  @NotNull
  declare name: string

  @Attribute(DataTypes.STRING(2))
  @ColumnName('loja_filial')
  @NotNull
  declare filialNumber: string

  @Attribute(DataTypes.STRING(100))
  @ColumnName('loja_endereco')
  @NotNull
  declare address: string

  @Attribute(DataTypes.INTEGER)
  @ColumnName('lista_id')
  @NotNull
  declare listId: number
}

@Table({ tableName: 'parametrosempresa', timestamps: false })
export class LocalParameters extends Model<
  InferAttributes<LocalParameters>,
  InferCreationAttributes<LocalParameters>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  @ColumnName('codigo')
  declare id: CreationOptional<number>

  @Attribute(DataTypes.INTEGER)
  @ColumnName('codempresa')
  declare companyId: number

  @Attribute(DataTypes.STRING(50))
  @ColumnName('nomeparametro')
  declare key: string

  @Attribute(DataTypes.STRING(300))
  @ColumnName('parametro')
  declare value: string

  @Attribute(DataTypes.TEXT)
  @ColumnName('observacao')
  declare obs: string

  @Attribute(DataTypes.STRING(10))
  @ColumnName('tipo')
  declare type: string

  @Attribute(DataTypes.STRING(50))
  @ColumnName('tabela')
  declare table: string

  @Attribute(DataTypes.STRING(50))
  @ColumnName('campo')
  declare field: string
}

@Table({ tableName: 'integraloja_produto', timestamps: false })
export class CloudProduct extends Model<
  InferAttributes<CloudProduct>,
  InferCreationAttributes<CloudProduct>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @ColumnName('idproduto')
  declare id: CreationOptional<number>

  @BelongsTo(() => Company, {
    foreignKey: 'companyToken',
    targetKey: 'token'
  })
  declare company?: NonAttribute<Company>

  @Attribute(DataTypes.STRING(10))
  @NotNull
  @Index
  @ColumnName('empresa_token')
  declare companyToken: string

  @Attribute(DataTypes.STRING(200))
  @NotNull
  @ColumnName('descricao')
  declare description: string

  @Attribute(DataTypes.STRING(14))
  @ColumnName('ean')
  declare ean: string

  @Attribute(DataTypes.DECIMAL(15, 2))
  @ColumnName('valorvenda')
  declare sellingValue: number

  @Attribute(DataTypes.DECIMAL(15, 2))
  @ColumnName('valorcusto')
  declare costValue: number

  @Attribute(DataTypes.DECIMAL(15, 4))
  @ColumnName('saldoestoque')
  declare stockBalance: number
}

@Table({ tableName: 'produto', timestamps: false })
export class LocalProduct extends Model<
  InferAttributes<LocalProduct>,
  InferCreationAttributes<LocalProduct>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @ColumnName('idproduto')
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING(200))
  @NotNull
  @ColumnName('descricao')
  declare description: string

  @Attribute(DataTypes.STRING(14))
  @ColumnName('ean')
  declare ean: string

  @Attribute(DataTypes.DECIMAL(15, 2))
  @ColumnName('valorvenda')
  declare sellingValue: number

  @Attribute(DataTypes.DECIMAL(15, 2))
  @ColumnName('valorcusto')
  declare costValue: number

  @Attribute(DataTypes.DECIMAL(15, 4))
  @ColumnName('saldoestoque')
  declare stockBalance: number
}

@Table({
  tableName: 'integraloja_auditoria_lancamentos',
  timestamps: false
})
export class CloudAuditEntry extends Model<
  InferAttributes<CloudAuditEntry>,
  InferCreationAttributes<CloudAuditEntry>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  @ColumnName('auditoria_id')
  declare id: CreationOptional<number>

  @Attribute(DataTypes.STRING(10))
  @ColumnName('auditoria_empresa_token')
  declare companyToken: string | null

  @Attribute(DataTypes.STRING(100))
  @Default('')
  @ColumnName('auditoria_empresa_nome')
  declare companyName: CreationOptional<string>

  @Attribute(DataTypes.STRING(10))
  @Default('')
  @ColumnName('auditoria_loja_codigo')
  declare storeCode: CreationOptional<string>

  @Attribute(DataTypes.STRING(100))
  @Default('')
  @ColumnName('auditoria_loja_nome')
  declare storeName: CreationOptional<string>

  @Attribute(DataTypes.DATE)
  @Default(DataTypes.NOW)
  @ColumnName('auditoria_data')
  declare auditDate: CreationOptional<Date>

  @Attribute(DataTypes.STRING(50))
  @Default('')
  @ColumnName('auditoria_login_nome')
  declare loginName: CreationOptional<string>

  declare items?: NonAttribute<CloudAuditEntryItem[]>
}



@Table({
  tableName: 'integraloja_auditoria_lancamentos_item',
  timestamps: false
})
export class CloudAuditEntryItem extends Model<
  InferAttributes<CloudAuditEntryItem>,
  InferCreationAttributes<CloudAuditEntryItem>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  @ColumnName('auditoria_id')
  declare auditId: CreationOptional<number>

  @BelongsTo(() => CloudAuditEntry, {
    foreignKey: 'auditId',
    targetKey: 'id',
    inverse: {
      as: 'items',
      type: 'hasMany'
    }
  })
  declare audit?: NonAttribute<CloudAuditEntry>;


  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @ColumnName('auditoria_idproduto')
  declare productId: number

  @BelongsTo(() => CloudProduct, 'productId')
  declare product?: NonAttribute<CloudProduct>;

  @Attribute(DataTypes.STRING(200))
  @ColumnName('auditoria_descricao_produto')
  declare productDescription: string | null

  @Attribute(DataTypes.DECIMAL(15, 2))
  @Default(0)
  @ColumnName('auditoria_valorvenda')
  declare salePrice: CreationOptional<number>

  @Attribute(DataTypes.DECIMAL(15, 2))
  @Default(0)
  @ColumnName('auditoria_valorcusto')
  declare costPrice: CreationOptional<number>

  @Attribute(DataTypes.DECIMAL(15, 4))
  @Default(0)
  @ColumnName('auditoria_saldoestoque')
  declare stockBalance: CreationOptional<number>

  @Attribute(DataTypes.DECIMAL(15, 4))
  @Default(0)
  @ColumnName('auditoria_contagemestoque')
  declare stockCount: CreationOptional<number>

  @Attribute(DataTypes.DECIMAL(15, 4))
  @Default(0)
  @ColumnName('auditoria_contagemdiferenca')
  declare stockDifference: CreationOptional<number>

  @Attribute(DataTypes.DECIMAL(15, 4))
  @Default(0)
  @ColumnName('auditoria_valorvendadiferenca')
  declare saleValueDifference: CreationOptional<number>

  @Attribute(DataTypes.DECIMAL(15, 4))
  @Default(0)
  @ColumnName('auditoria_valorcustodiferenca')
  declare costValueDifference: CreationOptional<number>
}