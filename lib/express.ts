const expressDependencies = {
  npm: ["express", "body-parser", "cors", "helmet"],
  saveDev: [
    "@types/express",
    "@types/body-parser",
    "@types/cors",
    "@types/helmet",
    "ts-node",
    "@types/node",
  ],
  dirs: [
    "src",
    "views",
    "public",
    "routes",
    "controllers",
    "middlewares",
    "models",
    "services",
    "config",
    "utils",
  ],
};

export function getDependencies(
  appType: string,
  dbOptions: { client: string; db: string },
) {
  let dependencies = expressDependencies.npm;
  let devDependencies = expressDependencies.saveDev;

  if (appType === "express-db") {
    if (dbOptions.client === "mongoose") {
      dependencies.push("mongoose");
    } else if (dbOptions.client === "typeorm") {
      dependencies.push("typeorm", "reflect-metadata");
    } else if (dbOptions.client === "drizzle") {
      dependencies.push("drizzle-orm");
    }
  } else if (appType === "express-db-testing") {
    if (dbOptions.client === "mongoose") {
      dependencies.push("mongoose");
    } else if (dbOptions.client === "typeorm") {
      dependencies.push("typeorm", "reflect-metadata");
    } else if (dbOptions.client === "drizzle") {
      dependencies.push("drizzle-orm");
    }
    devDependencies.push("jest", "ts-jest", "@types/jest", "playwright");
  }

  return { dependencies, devDependencies };
}

export function getDatabaseOptions(
  appType: string,
): Promise<{ client: string; db: string }> {
  return new Promise((resolve) => {
    const rl = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    if (appType === "express-db" || appType === "express-db-testing") {
      console.log("Select the database client:");
      console.log("1. Mongoose (MongoDB)");
      console.log("2. TypeORM (PostgreSQL, MySQL)");
      console.log("3. Drizzle (PostgreSQL, MySQL)");
      rl.question("Enter your choice (1-3): ", (choice: string) => {
        let client = "";
        switch (choice) {
          case "1":
            client = "mongoose";
            break;
          case "2":
            client = "typeorm";
            break;
          case "3":
            client = "drizzle";
            break;
          default:
            console.log("Invalid choice, defaulting to Mongoose.");
            client = "mongoose";
        }

        rl.question(
          "Select the database type (mongodb, postgres, mysql): ",
          (db: string) => {
            const supportedDbs = ["mongodb", "postgres", "mysql"];
            if (!supportedDbs.includes(db.toLowerCase())) {
              console.log("Invalid database type, defaulting to mongodb.");
              db = "mongodb";
            }
            resolve({ client, db });
            rl.close();
          },
        );
      });
    } else {
      resolve({ client: "", db: "" }); // No database options for non-DB apps
    }
  });
}
