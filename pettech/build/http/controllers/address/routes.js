"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/http/controllers/address/routes.ts
var routes_exports = {};
__export(routes_exports, {
  addressRoutes: () => addressRoutes
});
module.exports = __toCommonJS(routes_exports);

// src/lib/pg/db.ts
var import_pg = require("pg");

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "production", "test"]).default("development"),
  PORT: import_zod.z.coerce.number().default(3e3),
  DATABASE_USER: import_zod.z.string(),
  DATABASE_HOST: import_zod.z.string(),
  DATABASE_NAME: import_zod.z.string(),
  DATABASE_PASSWORD: import_zod.z.string(),
  DATABASE_PORT: import_zod.z.coerce.number()
});
var _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error("Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables");
}
var env = _env.data;

// src/lib/pg/db.ts
var CONFIG = {
  user: env.DATABASE_USER,
  host: env.DATABASE_HOST,
  database: env.DATABASE_NAME,
  password: env.DATABASE_PASSWORD,
  port: env.DATABASE_PORT
};
var Database = class {
  constructor() {
    this.pool = new import_pg.Pool(CONFIG);
    this.connection();
  }
  async connection() {
    try {
      this.client = await this.pool.connect();
    } catch (error) {
      console.error(`Error connecting to the database: ${error}`);
      throw new Error(`Error connecting to the database: ${error}`);
    }
  }
  get clientInstance() {
    return this.client;
  }
};
var database = new Database();

// src/repositories/pg/address.repository.ts
var AddressRepository = class {
  async findAdressByPersonId(personId, page, limit) {
    const offset = (page - 1) * limit;
    const query = `
    SELECT address.*, person.*
    FROM address
    JOIN person ON address.person_id = person.id
    WHERE person.id = $1
    LIMIT $2 OFFSET $3
    `;
    const result = await database.clientInstance?.query(
      query,
      [personId, limit, offset]
    );
    return result?.rows || [];
  }
  async create({
    street,
    city,
    state,
    zip_code,
    person_id
  }) {
    const result = await database.clientInstance?.query(
      `
        INSERT INTO address (street, city, state, zip_code, person_id) VALUES
        ($1, $2, $3, $4, $5) RETURNING *
        `,
      [street, city, state, zip_code, person_id]
    );
    return result?.rows[0];
  }
};

// src/use-cases/create-address.ts
var CreateAddressUseCase = class {
  constructor(addressRepository) {
    this.addressRepository = addressRepository;
  }
  async handler(address) {
    return this.addressRepository.create(address);
  }
};

// src/use-cases/factory/make-create-adress-use-case.ts
function makeCreateAdressUseCase() {
  const adressRepository = new AddressRepository();
  const createAdressUseCase = new CreateAddressUseCase(adressRepository);
  return createAdressUseCase;
}

// src/http/controllers/address/create.ts
var import_zod2 = require("zod");
async function create(request, reply) {
  const registerBodySchema = import_zod2.z.object({
    street: import_zod2.z.string(),
    city: import_zod2.z.string(),
    state: import_zod2.z.string(),
    zip_code: import_zod2.z.string(),
    person_id: import_zod2.z.coerce.number()
  });
  const { street, city, state, zip_code, person_id } = registerBodySchema.parse(
    request.body
  );
  const createAddressUseCase = makeCreateAdressUseCase();
  const address = await createAddressUseCase.handler({
    street,
    city,
    state,
    zip_code,
    person_id
  });
  return reply.status(201).send(address);
}

// src/use-cases/find-adress-by-person.ts
var FindAdressByPersonUseCase = class {
  constructor(adressRepository) {
    this.adressRepository = adressRepository;
  }
  async handler(personId, page, limit) {
    return this.adressRepository.findAdressByPersonId(personId, page, limit);
  }
};

// src/use-cases/factory/make-find-adress-by-person-use-case.ts
function makeFindAdressByPersonUseCase() {
  const adressRepository = new AddressRepository();
  const findAdressByPersonUseCase = new FindAdressByPersonUseCase(
    adressRepository
  );
  return findAdressByPersonUseCase;
}

// src/http/controllers/address/find-adress.ts
var import_zod3 = require("zod");
async function findAdress(request, reply) {
  const registerParamsSchema = import_zod3.z.object({
    personId: import_zod3.z.coerce.number()
  });
  const registerQuerySchema = import_zod3.z.object({
    page: import_zod3.z.coerce.number(),
    limit: import_zod3.z.coerce.number()
  });
  const { personId } = registerParamsSchema.parse(request.params);
  const { page, limit } = registerQuerySchema.parse(request.query);
  const findAddressByPersonUseCase = makeFindAdressByPersonUseCase();
  const address = await findAddressByPersonUseCase.handler(
    personId,
    page,
    limit
  );
  return reply.status(200).send(address);
}

// src/http/controllers/address/routes.ts
async function addressRoutes(app) {
  app.post("/address", create);
  app.get("/address/person/:personId", findAdress);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addressRoutes
});
