#!/usr/bin/env node

// Your script content here


const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
main();

async function main(){
	await createProject()
		.then((projectName) => {
			installDependencies(projectName);
			makeDirs(projectName);	
			createFiles(projectName);
		})
		.catch(() => process.exit(1));

}


function createProject() {
	return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter project name: ', projectName => {
        const trimmedName = projectName.trim();  // Trim the input
        if (trimmedName) {
            const projectPath = path.join(__dirname, trimmedName);
            try {
                if (fs.existsSync(projectPath)) {  // Check if the directory already exists
                    console.log(`Directory '${trimmedName}' already exists.`);
			resolve(trimmedName);
                } else {
                    fs.mkdirSync(projectPath);
                    console.log(`Project directory '${trimmedName}' created successfully at ${projectPath}`);
                	resolve(trimmedName);
		}
            } catch (error) {
                console.error(`Failed to create project directory: ${error.message}`);
		    reject();
            }
        } else {
            console.log('Project name cannot be empty.');
		reject();
        }
        rl.close();  // Close the readline interface
    });
})
};
function installDependencies(projectName){
	fs.writeFileSync(`${projectName}/package.json`, packageJson(projectName));
	execSync(`cd ${projectName} && npm install`, {stdio: 'inherit'});
	execSync(`cd ${projectName} && npm install --save-dev eslint @eslint/js @types/eslint__js typescript typescript-eslint eslint-define-config ts-node --loglevel=error `, {stdio: 'inherit'});
}

function makeDirs(projectName){
	execSync(` cd ${projectName} && mkdir src`, {stdio: 'inherit'});
	execSync(`cd ${projectName} && mkdir lib`, {stdio: 'inherit'});
	execSync(`cd ${projectName} && mkdir test`, {stdio: 'inherit'});
	execSync(`cd ${projectName} && mkdir dist`, {stdio: 'inherit'});
	execSync(`cd ${projectName} && mkdir views`, {stdio: 'inherit'});
}

function createFiles(projectName){	
	execSync(`cd ${projectName} && touch src/index.ts`, {stdio: 'inherit'});
	execSync(`cd ${projectName} && touch test/index.test.ts`, {stdio: 'inherit'});
	execSync(`cd ${projectName} && touch views/index.html`, {stdio: 'inherit'});
	fs.writeFileSync(`${projectName}/tsconfig.json`, tsconfig);
	fs.writeFileSync(`${projectName}/.eslintignore`, eslintIgnore);
	fs.writeFileSync(`${projectName}/eslint.config.js`, eslint);
}


const tsconfig = `{
  "compilerOptions": {
    "target": "ES6",
    "module": "ES6",  /* Generate CommonJS modules */
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "strict": true,
    "skipLibCheck": true
  }
}
`;

const eslint = `
// eslint.config.js
const { defineConfig } = require('eslint-define-config');
const tsEslintPlugin = require('@typescript-eslint/eslint-plugin');
const tsEslintParser = require('@typescript-eslint/parser');

module.exports = defineConfig([
    {
        languageOptions: {
            parser: tsEslintParser,
        },
        plugins: {
            '@typescript-eslint': tsEslintPlugin,
        },
        rules: {
            // Add your custom rules here
        },
    },{
        files: ['**/*.ts'],
    },
    ]);
`;

const eslintIgnore = `
# .eslintIgnore
node_modules/
dist/	
`;
const packageJson = (projectName) => {
    return `{
        "name": "${projectName}",
        "version": "1.0.0",
        "description": "",
        "main": "src/index.js",
        "scripts": {
            "build": "tsc",
            "start": "node dist/src/index.js",
            "dev": "ts-node src/index.ts",
            "lint": "npx eslint ."
        },
        "keywords": [],
        "author": "",
        "license": "ISC"
    }`;
}
	

