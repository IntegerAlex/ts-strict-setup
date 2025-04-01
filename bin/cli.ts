#!/usr/bin/env node
import inquirer from "inquirer";
import { createProject } from "../utils/createProject";
import { selectAppType } from "../utils/selectAppType";
import { getDatabaseOptions } from "../utils/getDatabaseOptions";
import { installDependencies } from "../utils/installDependencies";
import { makeDirs } from "../utils/makeDirs";
import { createFiles } from "../utils/createFiles";

async function main() {
  try {
    console.log("Welcome to ts-strict-setup!");
   const projectName = await createProject();
    const appType = await selectAppType();
    const dbOptions = await getDatabaseOptions(appType);

    // Interactive prompt for permissions
    const { setPermissions } = await inquirer.prompt([
      {
        type: "confirm",
        name: "setPermissions",
        message:
          "Set full permissions for all files? (WARNING: This may pose security risks)",
        default: false,
      },
    ]);

    await installDependencies(projectName, appType, dbOptions);
    makeDirs(projectName, setPermissions);
    createFiles(projectName, appType, dbOptions);

    console.log(
      `\x1b[32mSuccess:\x1b[0m Project '${projectName}' created successfully!`,
    );
    console.log(`Run the following commands to get started:`);
    console.log(`\x1b[36mcd ${projectName}\x1b[0m`);
    console.log(`\x1b[36mnpm run dev\x1b[0m`);
  } catch (error: any) {
    console.error(`\x1b[31mError:\x1b[0m ${error.message}`);
    process.exit(1);
  }
}

main();
