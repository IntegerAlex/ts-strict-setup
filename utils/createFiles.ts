import fs from "fs";
import path from "path";
import ejs from "ejs";
import { getDatabaseOptions } from "./getDatabaseOptions.js";

/**
 * Creates necessary files for the project.
 * @param {string} projectName - The name of the project.
 * @param {string} appType - The selected application type.
 * @param {{ client: string; db: string }} dbOptions - The selected database options.
 * @param {boolean} setPermissions - Whether to set full permissions (777) for all files.
 */
export function createFiles(
  projectName: string,
  appType: string,
  dbOptions: { client: string; db: string },
  setPermissions = false,
) {
  const projectPath = path.join(process.cwd(), projectName);
  const templatesDir = path.join(__dirname, "../templates");

  // List of files to create with their respective templates
  const files = [
    { path: "src/index.ts", template: "index.ts.ejs" },
    { path: "views/index.html", template: "index.html.ejs" },
    { path: "tsconfig.json", template: "tsconfig.json.ejs" },
    { path: ".eslintignore", template: ".eslintignore.ejs" },
    { path: "eslint.config.js", template: "eslint.config.js.ejs" },
    { path: ".env.example", template: ".env.example.ejs" },
  ];

  try {
    files.forEach(({ path: filePath, template }) => {
      const templatePath = path.join(templatesDir, template);
      const templateContent = fs.readFileSync(templatePath, "utf-8");
      const renderedContent = ejs.render(templateContent, {
        projectName,
        appType,
        dbOptions,
      });
      const fullPath = path.join(projectPath, filePath);

      // Ensure directory exists before writing the file
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, renderedContent);

      // Set permissions if requested
      if (setPermissions) {
        fs.chmodSync(fullPath, 0o644); // Read and write for owner, read for others
      }
    });

    // Add database connection file based on the selected client
    if (appType === "express-db" || appType === "express-db-testing") {
      const dbTemplatePath = path.join(templatesDir, "db.ts.ejs");
      const dbContent = fs.readFileSync(dbTemplatePath, "utf-8");
      const renderedDbContent = ejs.render(dbContent, { dbOptions });
      const dbFilePath = path.join(projectPath, "src/db.ts");

      fs.writeFileSync(dbFilePath, renderedDbContent);
      if (setPermissions) {
        fs.chmodSync(dbFilePath, 0o777);
      }
    }

    // Add testing configuration files if applicable
    if (appType === "express-db-testing") {
      const jestConfig = fs.readFileSync(
        path.join(templatesDir, "jest.config.js.ejs"),
        "utf-8",
      );
      fs.writeFileSync(path.join(projectPath, "jest.config.js"), jestConfig);

      const playwrightConfig = fs.readFileSync(
        path.join(templatesDir, "playwright.config.ts.ejs"),
        "utf-8",
      );
      fs.writeFileSync(
        path.join(projectPath, "playwright.config.ts"),
        playwrightConfig,
      );
    }

    console.log(`\x1b[32mSuccess:\x1b[0m Files created successfully.`);
  } catch (error: any) {
    console.error(
      `\x1b[31mError:\x1b[0m Failed to create files: ${error.message}`,
    );
    throw error;
  }
}
