#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";
import {
  serve,
  indexHtml,
  packageJson,
  tsconfig,
  eslint,
  eslintIgnore,
} from "../lib/template.js";
import { getDatabaseOptions } from "../lib/express.js";

main();

async function main() {
  try {
    const projectName = await createProject();
    const appType = await selectAppType();
    const dbOptions = await getDatabaseOptions(appType);
    await installDependencies(projectName, appType, dbOptions);
    makeDirs(projectName);
    createFiles(projectName, appType, dbOptions);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

function createProject(): Promise<string> {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Enter project name: ", (projectName: string) => {
      const trimmedName = projectName.trim();
      if (trimmedName) {
        const projectPath = path.join(process.cwd(), trimmedName);
        try {
          if (fs.existsSync(projectPath)) {
            console.log(`Directory '${trimmedName}' already exists.`);
            resolve(trimmedName);
          } else {
            fs.mkdirSync(projectPath);
            console.log(
              `Project directory '${trimmedName}' created successfully at ${projectPath}`,
            );
            resolve(trimmedName);
          }
        } catch (error: any) {
          console.error(`Failed to create project directory: ${error.message}`);
          reject(error);
        }
      } else {
        console.log("Project name cannot be empty.");
        reject(new Error("Project name cannot be empty."));
      }
      rl.close();
    });
  });
}

function selectAppType(): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    console.log("Select the type of application you want to create:");
    console.log("1. Express Application");
    console.log("2. Express Application with Database");
    console.log(
      "3. Express Application with Database and Testing (Jest, Playwright)",
    );
    rl.question("Enter your choice (1-3): ", (choice: string) => {
      let appType = "";
      switch (choice) {
        case "1":
          appType = "express";
          break;
        case "2":
          appType = "express-db";
          break;
        case "3":
          appType = "express-db-testing";
          break;
        default:
          console.log("Invalid choice, defaulting to Express Application.");
          appType = "express";
      }
      rl.close();
      resolve(appType);
    });
  });
}

async function installDependencies(
  projectName: string,
  appType: string,
  dbOptions: { client: string; db: string },
) {
  return new Promise((resolve, reject) => {
    const projectPath = path.join(process.cwd(), projectName);
    fs.writeFileSync(
      path.join(projectPath, "package.json"),
      packageJson(projectName),
    );
    try {
      execSync("npm install", { cwd: projectPath, stdio: "inherit" });
      let devDependencies =
        "@eslint/js @types/eslint__js typescript @typescript-eslint/eslint-plugin eslint-define-config ts-node";
      let dependencies = "express";
      if (appType === "express-db") {
        dependencies += " mongoose"; // Example for MongoDB
      } else if (appType === "express-db-testing") {
        dependencies += " mongoose";
        devDependencies += " jest ts-jest @types/jest playwright";
      }
      execSync(`npm install ${dependencies}`, {
        cwd: projectPath,
        stdio: "inherit",
      });
      execSync(`npm install --save-dev ${devDependencies}`, {
        cwd: projectPath,
        stdio: "inherit",
      });
      resolve("Dependencies installed successfully");
    } catch (error: any) {
      console.error(`Failed to install dependencies: ${error.message}`);
      reject(error);
    }
  });
}

function makeDirs(projectName: string) {
  const projectPath = path.join(process.cwd(), projectName);
  const dirs = ["src", "lib", "test", "dist", "views"];
  dirs.forEach((dir) => {
    fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
  });
}

function createFiles(
  projectName: string,
  appType: string,
  dbOptions: { client: string; db: string },
) {
  const projectPath = path.join(process.cwd(), projectName);
  fs.writeFileSync(path.join(projectPath, "src", "index.ts"), serve);
  fs.writeFileSync(path.join(projectPath, "test", "index.test.ts"), ""); // Placeholder for tests
  fs.writeFileSync(path.join(projectPath, "views", "index.html"), indexHtml);
  fs.writeFileSync(path.join(projectPath, "tsconfig.json"), tsconfig);
  fs.writeFileSync(path.join(projectPath, ".eslintignore"), eslintIgnore);
  fs.writeFileSync(path.join(projectPath, "eslint.config.js"), eslint);

  // Create additional files based on app type
  if (appType === "express-db") {
    // Add database connection file
    fs.writeFileSync(
      path.join(projectPath, "src", "db.ts"),
      `
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('your_mongo_db_connection_string', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

export default connectDB;
        `,
    );
  } else if (appType === "express-db-testing") {
    // Add Jest and Playwright setup files
    fs.writeFileSync(
      path.join(projectPath, "jest.config.js"),
      `
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
};
        `,
    );
    fs.writeFileSync(
      path.join(projectPath, "playwright.config.ts"),
      `
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: 'test',
    use: {
        // Configure the browser options
        headless: true,
    },
});
        `,
    );
  }
}
