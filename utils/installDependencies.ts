import fs from "fs";
import path from "path";
import { execSync } from "child_process";

/**
 * Installs dependencies for the project.
 * @param {string} projectName - The name of the project.
 * @param {string} appType - The selected application type.
 * @param {{ client: string; db: string }} dbOptions - The selected database options.
 */
export async function installDependencies(
  projectName: string,
  appType: string,
  dbOptions: { client: string; db: string },
) {
  const ora = (await import("ora")).default; // Dynamic import
  const spinner = ora("Installing dependencies...").start();
  const projectPath = path.join(process.cwd(), projectName);

  try {
    // Create package.json
    fs.writeFileSync(
      path.join(projectPath, "package.json"),
      packageJson(projectName),
    );

    // Install base dependencies
    execSync("npm install", { cwd: projectPath, stdio: "inherit" });

    // Get dependencies based on app type and database options
    const { dependencies, devDependencies } = getDependencies(
      appType,
      dbOptions,
    );

    // Install production dependencies
    if (dependencies.length > 0) {
      execSync(`npm install ${dependencies.join(" ")}`, {
        cwd: projectPath,
        stdio: "inherit",
      });
    }

    // Install development dependencies
    if (devDependencies.length > 0) {
      execSync(`npm install --save-dev ${devDependencies.join(" ")}`, {
        cwd: projectPath,
        stdio: "inherit",
      });
    }

    spinner.succeed("Dependencies installed successfully");
  } catch (error: any) {
    spinner.fail("Failed to install dependencies");
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

/**
 * Generates a dynamic package.json file based on the project name.
 * @param {string} projectName - The name of the project.
 * @returns {string} The content of the package.json file.
 */
function packageJson(projectName: string) {
  return `{
    "name": "${projectName}",
    "version": "1.0.0",
    "description": "",
    "main": "src/index.js",
    "scripts": {
      "build": "tsc",
      "start": "node dist/src/index.js",
      "dev": "ts-node src/index.ts",
      "lint": "npx eslint .",
      "test": "jest"
    },
    "keywords": [],
    "author": "",
    "license": "ISC"
  }`;
}

/**
 * Retrieves the list of dependencies based on the application type and database options.
 * @param {string} appType - The selected application type.
 * @param {{ client: string; db: string }} dbOptions - The selected database options.
 * @returns {{ dependencies: string[]; devDependencies: string[] }} The dependencies and devDependencies.
 */
function getDependencies(
  appType: string,
  dbOptions: { client: string; db: string },
) {
  const baseDependencies = ["express", "body-parser", "cors", "helmet"];
  const baseDevDependencies = [
    "@types/express",
    "@types/body-parser",
    "@types/cors",
    "@types/helmet",
    "ts-node",
    "@types/node",
    "typescript",
    "eslint",
    "@typescript-eslint/parser",
    "@typescript-eslint/eslint-plugin",
  ];

  let dependencies = [...baseDependencies];
  let devDependencies = [...baseDevDependencies];

  if (appType === "express-db" || appType === "express-db-testing") {
    if (dbOptions.client === "mongoose") {
      dependencies.push("mongoose");
    } else if (dbOptions.client === "typeorm") {
      dependencies.push("typeorm", "reflect-metadata");
    } else if (dbOptions.client === "drizzle") {
      dependencies.push("drizzle-orm");
    }
  }

  if (appType === "express-db-testing") {
    devDependencies.push("jest", "ts-jest", "@types/jest", "playwright");
  }

  return { dependencies, devDependencies };
}
