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

// src/http/controllers/user/find-user.ts
var find_user_exports = {};
__export(find_user_exports, {
  findUser: () => findUser
});
module.exports = __toCommonJS(find_user_exports);

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

// src/repositories/pg/user.repository.ts
var UserRepository = class {
  async create({
    username,
    password
  }) {
    const result = await database.clientInstance?.query(
      `INSERT INTO "user" (username, password) VALUES ($1, $2) RETURNING *`,
      [username, password]
    );
    return result?.rows[0];
  }
  async findWithPerson(user_id) {
    const result = await database.clientInstance?.query(
      `SELECT * FROM "user" 
      LEFT JOIN person ON "user".id = person.user_id
      WHERE "user".id = $1`,
      [user_id]
    );
    return result?.rows[0];
  }
};

// src/use-cases/errors/resource-not-found-error.ts
var ResourceNotFoundError = class extends Error {
  constructor() {
    super("Resource not found");
  }
};

// src/use-cases/find-with-person.ts
var FindWithPersonUseCase = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async handler(userId) {
    const user = await this.userRepository.findWithPerson(userId);
    console.log(user);
    if (!user) throw new ResourceNotFoundError();
    return user;
  }
};

// src/use-cases/factory/make-find-with-person.ts
function makeFindWithPersonUseCase() {
  const userRepository = new UserRepository();
  const findWithPersonUseCase = new FindWithPersonUseCase(userRepository);
  return findWithPersonUseCase;
}

// src/http/controllers/user/find-user.ts
var import_zod2 = require("zod");
async function findUser(request, reply) {
  const registerParamsSchema = import_zod2.z.object({
    id: import_zod2.z.coerce.number()
  });
  const { id } = registerParamsSchema.parse(request.params);
  const findWithPersonUseCase = makeFindWithPersonUseCase();
  const user = await findWithPersonUseCase.handler(id);
  return reply.status(200).send(user);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findUser
});
