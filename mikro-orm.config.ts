import { MikroORM } from "@mikro-orm/core";
import { User } from "./entities/user.entity";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";

export default {
  entities: [User], // Add your entities here
  driver: PostgreSqlDriver, // or your preferred database type
  dbName: "test_db",
  user: "your_db_user",
  password: "your_db_password",
  // debug: true,
  disableIdentityMap: false, // Set to true if you want to disable the identity map
} as Parameters<typeof MikroORM.init>[0];
