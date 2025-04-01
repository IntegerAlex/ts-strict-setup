import fs from "fs";
import path from "path";

/**
 * Creates necessary directories for the project.
 * @param {string} projectName - The name of the project.
 * @param {boolean} setPermissions - Whether to set full permissions (777) for all files.
 */
export function makeDirs(projectName: string, setPermissions = false) {
  const projectPath = path.join(process.cwd(), projectName);
  const dirs = [
    "src",
    "lib",
    "test",
    "dist",
    "views",
    "public",
    "routes",
    "controllers",
    "middlewares",
    "models",
    "services",
    "config",
    "utils",
  ];

  try {
    dirs.forEach((dir) => {
      const dirPath = path.join(projectPath, dir);
      fs.mkdirSync(dirPath, { recursive: true });

      // Set permissions if requested
      if (setPermissions) {
        fs.chmodSync(dirPath, 0o755); // More restrictive permissions
      }
    });

    console.log(`\x1b[32mSuccess:\x1b[0m Directories created successfully.`);
  } catch (error: any) {
    console.error(
      `\x1b[31mError:\x1b[0m Failed to create directories: ${error.message}`,
    );
    throw error;
  }
}
