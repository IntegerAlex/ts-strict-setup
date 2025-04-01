import inquirer from "inquirer";

/**
 * Prompts the user to select database options if applicable.
 * @param {string} appType - The selected application type.
 * @returns {Promise<{ client: string; db: string }>} The selected database client and type.
 */
export async function getDatabaseOptions(appType: string) {
  if (appType !== "express-db" && appType !== "express-db-testing") {
    // No database options needed for non-database apps
    return { client: "", db: "" };
  }

  const { client } = await inquirer.prompt([
    {
      type: "list",
      name: "client",
      message: "Select the database client:",
      choices: [
        { name: "Mongoose (MongoDB)", value: "mongoose" },
        { name: "TypeORM (PostgreSQL, MySQL)", value: "typeorm" },
        { name: "Drizzle (PostgreSQL, MySQL)", value: "drizzle" },
      ],
      default: "mongoose",
    },
  ]);

  const supportedDbs = ["mongodb", "postgres", "mysql"];
  const dbChoices = client === "mongoose" 
    ? ["mongodb"] 
    : ["postgres", "mysql"];

  const { db } = await inquirer.prompt([
    {
      type: "list",
      name: "db",
      message: "Select the database type:",
      choices: dbChoices,
      default: dbChoices[0],
    },
  ]);

  console.log(`Selected database client: ${client}`);
  console.log(`Selected database type: ${db}`);

  return { client, db };
}
