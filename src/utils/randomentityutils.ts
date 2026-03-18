import { Attributes, CreationAttributes } from "@sequelize/core";
import { CompanyCommission, PaymentCondition, PaymentMethod, Product, ProductPriceTable, ProductPriceTableItem } from "../db/models.js";
import { AddClientParams, AppOrder, AppOrderItem } from "../dto.js";
import cidadesEstados from "./../data/estados-cidades.json" with { type: "json" };
import cidadesEstados2 from "./../data/estados-cidades2.json" with { type: "json" };
import rawActivities from "../data/activity.json" with {type: "json"}
import rawPaymentMethods from "../data/payment-method.json" with {type: "json"}
import rawPaymentConditions from "../data/payment-conditions.json" with {type: "json"}
import { CommissionType, OrderType } from "../consts/models.js";
import { generateCNPJ, generateCPF, randomBoolean, randomDateAroundNowSP, randomFrom, randomIndexes, randomInt, randomPhone, uuidv4 } from "./randomutils.js";
import { AddPorcentage } from "./mathutils.js";

function getRandomCity() {
  const cities = cidadesEstados2.cities;
  const randomIndex = Math.floor(Math.random() * cities.length);
  let city = cities[randomIndex];
  //@ts-ignore
  let state: string = cidadesEstados.estados.find(e => e.nome == cidadesEstados2.states[String(city.state_id)])?.sigla
  return {
    city: city,
    state: state
  }
}


function getRandomActivityId(): number {

  const randomIndex = Math.floor(Math.random() * rawActivities.length);
  return rawActivities[randomIndex].id;
}

function getRandomPaymentMethod(): number {

  const randomIndex = Math.floor(Math.random() * rawPaymentMethods.length);
  return rawPaymentMethods[randomIndex].id;
}

function getRandomPaymentCondition(): number {

  const randomIndex = Math.floor(Math.random() * rawPaymentConditions.length);
  return rawPaymentConditions[randomIndex].id;
}


// some fake data pools
const firstNames = [
  "José", "Maria", "Carlos", "Ana", "Paulo", "Fernanda", "Rafael", "Juliana",
  "João", "Marcos", "Lucas", "Mateus", "Gabriel", "Felipe", "Gustavo", "Rodrigo",
  "Bruno", "André", "Diego", "Leonardo", "Tiago", "Daniel", "Eduardo", "Alexandre",
  "Roberto", "Antônio", "Ricardo", "Francisco", "Pedro", "Luiz", "Marcelo",
  "Cláudia", "Patrícia", "Camila", "Beatriz", "Larissa", "Aline", "Tatiane", "Carolina",
  "Vanessa", "Letícia", "Priscila", "Renata", "Luciana", "Mariana", "Bianca", "Simone",
  "Helena", "Sofia", "Vitória", "Natália", "Jéssica", "Isabela", "Catarina",
  "Tatiana", "Michele", "Flávia", "Julio", "Caio", "Maurício", "Fabrício", "Rogério",
  "Cássio", "Denis", "Vitor", "Otávio", "Hugo", "Elias", "Jonas", "Samuel",
  "Mário", "Cristiano", "Douglas", "Alan", "Fábio", "Igor", "Márcio", "Sérgio",
  "Álvaro", "Nelson", "Enzo", "Henrique", "Jonatas", "Davi", "Murilo", "Vinícius",
  "Emanuel", "Thiago", "Leandro", "Everton", "Patrick", "Ruan", "Eduarda", "Nicole",
  "Bruna", "Manuela", "Milena", "Lívia"
];

const lastNames = [
  "Silva", "Oliveira", "Santos", "Souza", "Pereira", "Costa", "Almeida",
  "Gomes", "Ribeiro", "Martins", "Carvalho", "Lima", "Araújo", "Melo", "Barbosa",
  "Rocha", "Dias", "Nunes", "Fernandes", "Machado", "Cardoso", "Teixeira", "Correia",
  "Moura", "Freitas", "Cavalcanti", "Monteiro", "Castro", "Vieira", "Ramos",
  "Campos", "Fonseca", "Guimarães", "Batista", "Pinto", "Macedo", "Peixoto", "Farias",
  "Barros", "Tavares", "Ferreira", "Rezende", "Braga", "Mendes", "Queiroz", "Andrade",
  "Xavier", "Amaral", "Pacheco", "Assis", "Sales", "Valente", "Figueiredo", "Porto",
  "Franco", "Pinheiro", "Rezende", "Azevedo", "Neves", "Couto", "Magalhães", "Vasconcelos",
  "Prado", "Borges", "Lacerda", "Duarte", "Lopes", "Moreira", "Macedo", "Siqueira",
  "Quevedo", "Cunha", "Aguiar", "Brandão", "Garcia", "Mattos", "Alves", "Teles",
  "Carmo", "Paz", "Torres", "Monte", "Frota", "Aragão", "Noronha", "Gusmão",
  "Rezende", "Novaes", "Pinto", "Miranda", "Bittencourt", "Lourenço", "Campos", "Freire",
  "Goulart", "Toledo", "Ventura", "Severiano"
];

const companyNames = [
  "Panificadora Pão Quente", "Mercado Santa Catarina", "Construtora Brasil", "Restaurante Sabor Caseiro",
  "Farmácia Vida Saudável", "Padaria Trigo Dourado", "Supermercado União", "Loja Roupas & Estilo",
  "Pizzaria Bella Itália", "Churrascaria Fogo de Chão", "Auto Peças Nacional", "Lanchonete Bom Gosto",
  "Escola Nova Esperança", "Colégio Alfa", "Sorveteria Delícias Geladas", "Frutaria Doce Mel",
  "Livraria Cultura Viva", "Cafeteria Aroma & Sabor", "Papelaria Mundo das Letras",
  "Academia Força & Saúde", "Clínica Bem Estar", "Hospital Vida Nova",
  "Transportadora Rápido Sul", "Hotel Estrela do Mar", "Pousada Recanto Feliz",
  "Oficina Mecânica Boa Viagem", "Eletrônicos TechBrasil", "Loja Móveis & Cia",
  "Agropecuária Raízes do Campo", "Banco Popular", "Cooperativa Crescer",
  "Imobiliária Horizonte", "Construtora Alpha", "Padaria Nosso Pão", "Mercado Bom Preço",
  "Loja Beleza Pura", "Distribuidora Água Cristalina", "Sorveteria Polar",
  "Restaurante Tempero da Vovó", "Bar e Lanchonete Amigos do Chopp",
  "Livraria Saber Mais", "Cafeteria Grão de Ouro", "Padaria Sabor do Trigo",
  "Supermercado Ponto Certo", "Restaurante Bom Paladar", "Auto Escola Direção Segura",
  "Floricultura Rosa Linda", "Loja Mundo Infantil", "Papelaria Estudante",
  "Hamburgueria Top Burger", "Escola Futuro Brilhante", "Clínica Sorriso Feliz",
  "Hospital São Gabriel", "Academia Power Fit", "Transportadora Via Rápida",
  "Agência de Viagens Mundo Novo", "Loja Conforto Lar", "Hotel Jardim Tropical",
  "Restaurante Sabor Mineiro", "Loja Moda Jovem", "Bar Esquina da Amizade",
  "Pizzaria Massa Fina", "Padaria Central", "Mercado Econômico",
  "Sorveteria Ponto Gelado", "Churrascaria Gaúcha", "Restaurante Rei do Peixe",
  "Agropecuária Campo Verde", "Oficina Mecânica Auto Master", "Distribuidora Bebidas do Sul",
  "Farmácia Popular", "Loja Estilo Feminino", "Loja Esportiva Mega Sport",
  "Construtora Pedra Firme", "Cafeteria Café com Arte", "Pet Shop Mundo Animal",
  "Clínica Vida Saudável", "Banco Regional", "Cooperativa de Crédito União",
  "Imobiliária Casa Nova", "Transportadora Norte Sul", "Pousada Paraíso Natural",
  "Hotel Vista Mar", "Restaurante Bom Sabor", "Mercado SuperPreço",
  "Padaria Delícia do Pão", "Sorveteria Cremosa", "Restaurante Cantinho da Serra",
  "Loja Mundo das Utilidades", "Academia Vida Ativa", "Clínica Nova Saúde",
  "Agência de Turismo Rota Livre", "Bar do Zé", "Restaurante Sabor Nordestino",
  "Mercado Central", "Papelaria Criativa", "Loja Roupas Fashion",
  "Cafeteria Ponto do Café", "Livraria Nova Era", "Construtora Beta"
];




function randomCoordinates(): [number, number] {
  const lat = -34 + Math.random() * (5 - -34); // -34 to +5
  const lon = -74 + Math.random() * (-34 - -74); // -74 to -34
  return [lat, lon];
}

export function generateClient(companyId: string, isCompany: boolean = Math.random() > 0.5): AddClientParams {
  let city1 = getRandomCity()
  let city2 = getRandomCity()
  if (isCompany) {
    return {
      standardAddressCep: "00000-000",
      standardAddressStreetAddress: "Rua Comercial",
      standardAddressCityId: city1.city.id,
      standardAddressUf: city1.state,
      standardAddressNumber: String(Math.floor(Math.random() * 999)),
      standardAddressCoordinates: randomCoordinates(),

      deliveryAddressCep: "00000-000",
      deliveryAddressStreetAddress: "Avenida Principal",
      deliveryAddressCityId: city2.city.id,
      deliveryAddressUf: city2.state,
      deliveryAddressNumber: String(Math.floor(Math.random() * 999)),
      deliveryAddressCoordinates: randomCoordinates(),

      id: uuidv4(),
      companyId,
      name: randomFrom(companyNames) + " Ltda",
      cpfcnpj: generateCNPJ(),
      isCompany: true,
      stateRegistry: String(Math.floor(Math.random() * 99999999)),
      cityRegistry: String(Math.floor(Math.random() * 99999999)),
      activityId: getRandomActivityId(),
      blockedCredit: Math.random() > 0.7,
      fax: randomPhone(),
      phone: randomPhone(),
      lockedPaymentCondition: randomBoolean(),
      paymentConditionId: getRandomPaymentCondition(),
      lockedCreditLimit: randomBoolean(),
      paymentMethodId: getRandomPaymentMethod(),
      lockedPaymentMethod: randomBoolean(),

      visitDay: randomBoolean() ? Math.floor(Math.random() * 7) : undefined,
      vip: randomBoolean()

    };

  } else {
    const name = `${randomFrom(firstNames)} ${randomFrom(lastNames)}`;
    return {
      standardAddressCep: "00000-000",
      standardAddressStreetAddress: "Rua Comercial",
      standardAddressCityId: city1.city.id,
      standardAddressUf: city1.state,
      standardAddressNumber: String(Math.floor(Math.random() * 999)),
      standardAddressCoordinates: randomCoordinates(),

      deliveryAddressCep: "00000-000",
      deliveryAddressStreetAddress: "Avenida Principal",
      deliveryAddressCityId: city2.city.id,
      deliveryAddressUf: city2.state,
      deliveryAddressNumber: String(Math.floor(Math.random() * 999)),
      deliveryAddressCoordinates: randomCoordinates(),

      companyId,
      name,
      id: uuidv4(),
      cpfcnpj: generateCPF(),
      isCompany: false,
      stateRegistry: "",
      cityRegistry: "",
      activityId: getRandomActivityId(),
      blockedCredit: Math.random() > 0.5,
      email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
      phone: randomPhone(),
      lockedPaymentCondition: Math.random() > 0.5,
      paymentConditionId: getRandomPaymentCondition(),
      lockedCreditLimit: Math.random() > 0.5,
      paymentMethodId: getRandomPaymentMethod(),
      lockedPaymentMethod: Math.random() > 0.5,
      visitDay: Math.random() > 0.5 ? Math.floor(Math.random() * 7) : undefined,
      vip: randomBoolean()
    };
  }
}

// helper to generate many
export function generateClients(companyId: string, count: number): AddClientParams[] {
  return Array.from({ length: count }, () => generateClient(companyId));
}



export function generateComissions(companyId: string, count: number) {
  const comissions: CreationAttributes<CompanyCommission>[] = []


  for (let i = 0; i < count; i++) {

    if (i == 0) {

      comissions.push({
        companyId,
        name: `Padrão`,
        type: CommissionType.Percentage,
        value: 5
      })
      continue
    }


    let type = randomBoolean() ? CommissionType.Percentage : CommissionType.Fixed;
    let value = type == CommissionType.Fixed ? 300 : randomInt(1, 5)

    comissions.push({
      companyId,
      name: `Comissão ${i + 1}`,
      type,
      value,
      minOrderValue: randomBoolean() ? randomInt(0, 10000) : undefined
    })
  }
  return comissions
}


const productAdjectives = ["Ultra", "Pro", "Max", "Eco", "Smart", "Turbo", "VENGEANCE®", "HyperX"];
const productItems = ["DDR4 DRAM", "SSD", "Gaming Mouse", "Mechanical Keyboard", "Monitor", "GPU", "CPU", "Power Supply"];
const packageTypes = ["CX", "UN", "PCT", "KG"];

function randomProductName(): string {
  const adj = randomFrom(productAdjectives);
  const item = randomFrom(productItems);
  const spec = Math.random() > 0.5 ? `${Math.floor(Math.random() * 64) + 4}GB` : `${Math.floor(Math.random() * 5000) + 500}MHz`;
  return `${adj} ${item} ${spec}`;
}


export function generateProduct(brands: { id: number }[], types: { id: number }[], company: { id: string }): CreationAttributes<Product> {
  const cost = Math.floor(Math.random() * 500) + 50; // 50–550
  const packageNumber = Math.floor(Math.random() * 5) + 1;
  const price = Math.round(cost * (1 + (randomInt(10, 50) / 100))) // markup
  const stock = Math.floor(Math.random() * 200);

  const onSale = randomBoolean()

  let obj: CreationAttributes<Product> = {
    cost,
    name: randomProductName(),
    description: "",
    packageType: randomFrom(packageTypes),
    packageNumber,
    price,
    stock,
    brandId: randomFrom(brands).id,
    typeId: randomFrom(types).id,
    companyId: company.id,
    onSale,
    maximumDiscount: randomInt(0, 50),
    saleMinimumQuantity: randomInt(1, 4),
    salePrice: onSale ? Math.round(AddPorcentage(price, -randomInt(5, 20))) : price
  }

  return obj
}

export function generateProducts(
  count: number,
  brands: { id: number }[],
  types: { id: number }[],
  company: { id: string }
): CreationAttributes<Product>[] {
  return Array.from({ length: count }, () => generateProduct(brands, types, company));
}




export function generatePriceTables(companyId: string, products: Product[]) {
  const priceTables: Attributes<ProductPriceTable>[] = [
    {
      companyId,
      defaultPercentage: randomInt(0, 30),
      id: uuidv4(),
      name: "Tabela A",
    },
    {
      companyId,
      defaultPercentage: randomInt(0, 30),
      id: uuidv4(),
      name: "Tabela B",
    },
    {
      companyId,
      defaultPercentage: randomInt(0, 30),
      id: uuidv4(),
      name: "Tabela C",
    },
  ]

  return priceTables.map(t => {
    const items: Attributes<ProductPriceTableItem>[] = products.map(p => {
      return {
        price: Math.round(AddPorcentage(p.price, t.defaultPercentage)),
        productId: p.id,
        tableId: t.id,
      }
    })
    return {
      ...t,
      items
    }
  })
}

function getRandomOrderType(): OrderType {
  const types = Object.values(OrderType).filter(v => typeof v === "number") as number[];
  return types[randomInt(0, types.length - 1)] as OrderType;
}


function GetProductPrice(product: Product, table?: ProductPriceTable) {
  if (table != undefined) {
    let item = table!.items!.find(i => i.productId == product.id)
    return item == undefined ? product.price : item.price

  }

  return product.price
}

function GetProductRealPrice(product: Product, applySaleQuantityRule: number = -1, table?: ProductPriceTable) {
  if (product.onSale && (applySaleQuantityRule == -1 || applySaleQuantityRule >= product.saleMinimumQuantity)) {
    return product.salePrice
  }

  return GetProductPrice(product, table)
}

export function createRandomOrderItem(orderId: string, product: Product, table?: ProductPriceTable): AppOrderItem {
  let quantity = randomInt(1, 6);
  const standardUnitPrice = GetProductPrice(product, table)

  let orderUnitPrice

  let isSaleActivated = product.onSale && quantity >= product.saleMinimumQuantity
  if (isSaleActivated) {
    orderUnitPrice = product.salePrice
  }
  else if (randomBoolean()) {
    const per = randomBoolean() ? randomInt(1, 20) : -randomInt(1, product.maximumDiscount)
    orderUnitPrice = Math.round(AddPorcentage(standardUnitPrice, per))
  }
  else {
    orderUnitPrice = standardUnitPrice
  }
  const totalPrice = orderUnitPrice * quantity;

  return {
    orderId,
    saleUnitPrice: product.salePrice,
    productName: product.name,
    productId: product.id,
    standardUnitPrice,
    orderUnitPrice,
    quantity,
    totalPrice,
    cost: product.cost,
    onSale: product.onSale,
    maximumDiscount: product.maximumDiscount,
    saleMinimumQuantity: product.saleMinimumQuantity
  };
}

export function createRandomOrder(clientId: string,
  createdById: number,
  products: Product[],
  paymentConditions: PaymentCondition[],
  tables: ProductPriceTable[],
  comission?: CompanyCommission,
  paymentMethod?: number,
  paymentCondition?: number
): AppOrder {
  const id = uuidv4();
  const itemsCount = randomInt(1, products.length);
  const items: AppOrderItem[] = [];
  let chosenProducts = randomIndexes(products, itemsCount)
  let table = randomInt(1, 5) == 5 ? undefined : randomFrom(tables)
  for (const product of chosenProducts) {
    items.push(createRandomOrderItem(id, product, table))
  }

  const paymentConditionId = getRandomPaymentCondition()
  const chosenPaymentCondition = paymentConditions.find(c => c.id == paymentConditionId)!

  const totalProducts = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalOrder = Math.round(AddPorcentage(totalProducts, chosenPaymentCondition.porcentage))
  //const totalOrder = parseFloat(items.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2));
  let totalComission = 0;
  if (comission != undefined) {
    totalComission = comission.type == CommissionType.Fixed ? comission.value : Math.round(AddPorcentage(totalOrder, comission.value))
  }
  return {
    id,
    clientId,
    createdById,
    deliveryDate: new Date(Date.now() + randomInt(1, 10) * 24 * 60 * 60 * 1000),
    paymentConditionId: paymentCondition ?? getRandomPaymentCondition(),
    paymentMethodId: paymentMethod ?? getRandomPaymentMethod(),
    type: getRandomOrderType(),
    urgent: Math.random() < 0.2,
    totalProducts,
    totalOrder,
    items,
    priceTableId: table == undefined ? undefined : table.id,
    totalComission,
    //@ts-ignore
    createdAt: randomDateAroundNowSP()
  };
}


export function generateRandomOrders(
  clientId: string,
  createdById: number,
  count: number,
  products: Product[],
  paymentConditions: PaymentCondition[],
  tables: ProductPriceTable[],
  comission: CompanyCommission,
  paymentMethod?: number,
  paymentCondition?: number,
): AppOrder[] {
  return Array.from({ length: count }, () => createRandomOrder(clientId, createdById, products, paymentConditions, tables, comission, paymentMethod, paymentCondition))
}

