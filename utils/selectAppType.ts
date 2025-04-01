import inquirer from "inquirer";

/**
 * Prompts the user to select the type of application they want to create.
 * @returns {Promise<string>} The selected application type.
 */
export async function selectAppType() {
  const { appType } = await inquirer.prompt([
    {
      type: "list",
      name: "appType",
      message: "Select the type of application you want to create:",
      choices: [
        {
          name: "Express Application",
          value: "express",
        },
        {
          name: "Express Application with Database",
          value: "express-db",
        },
        {
          name: "Express Application with Database and Testing (Jest, Playwright)",
          value: "express-db-testing",
        },
      ],
      default: "express",
    },
  ]);

  console.log(`Selected application type: ${appType}`);
  return appType;
}
