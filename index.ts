import {
  MikroORM,
  EntityManager,
  UniqueConstraintViolationException,
} from "@mikro-orm/core";
import { User } from "./entities/user.entity";
import assert from "assert";

(async () => {
  const orm = await MikroORM.init();

  const generator = orm.getSchemaGenerator();

  // Drop all tables
  console.log("Dropping all tables...");
  await generator.dropSchema();

  // Recreate all tables
  console.log("Recreating all tables...");
  await generator.createSchema();

  const em: EntityManager = orm.em.fork(); // Fork a new EM instance

  const userId = 1;
  const initialEmail = "user@example.com";
  const overridenEmail = "user+overriden@example.com";
  try {
    const newUser = em.create(User, {
      id: userId,
      email: initialEmail,
    });

    await em.persistAndFlush(newUser);

    console.log("User created successfully.", newUser.id);
  } catch (error) {
    console.error("Error during insert:", error);
  }

  try {
    const newUser = await em.create(User, {
      id: userId,
      email: overridenEmail,
    });

    await em.persistAndFlush(newUser);

    console.log("User created successfully.", newUser.id);
  } catch (error) {
    if (error instanceof UniqueConstraintViolationException) {
      console.error("User already exists.");
    }
  }

  // clearing the EM will work
  em.clear();

  const foundUser = await em.findOne(User, { id: userId });
  assert(foundUser && foundUser.email === initialEmail);

  // Clean up the ORM instance
  await orm.close(true);
})();
