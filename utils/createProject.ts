import fs from "fs";
import path from "path";
import inquirer from "inquirer";

/**
 * Prompts the user to enter a project name and creates the project directory.
 * @returns {Promise<string>} The name of the created project directory.
 */
export async function createProject() {
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter project name:",
      validate: (input) => {
        if (!input.trim()) {
          return "Project name cannot be empty.";
        }
        return true;
      },
    },
  ]);

  const trimmedName = projectName.trim();
  const projectPath = path.join(process.cwd(), trimmedName);

  try {
    if (fs.existsSync(projectPath)) {
      console.log(`Directory '${trimmedName}' already exists.`);
    } else {
      fs.mkdirSync(projectPath);
      console.log(
        `\x1b[32mSuccess:\x1b[0m Project directory '${trimmedName}' created successfully at ${projectPath}`,
      );
    }
    return trimmedName;
  } catch (error: any) {
    console.error(
      `\x1b[31mError:\x1b[0m Failed to create project directory: ${error.message}`,
    );
    throw error;
  }
}
