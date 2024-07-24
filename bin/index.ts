#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
import { serve , indexHtml , packageJson ,tsconfig ,eslint ,eslintIgnore } from '../lib/template.js';
main();

async function main(){
    try {
        const projectName = await createProject();
        installDependencies(projectName);
        makeDirs(projectName);
        createFiles(projectName);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

function createProject(): Promise<string>{
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Enter project name: ', projectName => {
            const trimmedName = projectName.trim();
            if (trimmedName) {
                const projectPath = path.join(process.cwd(), trimmedName);
                try {
                    if (fs.existsSync(projectPath)) {
                        console.log(`Directory '${trimmedName}' already exists.`);
                        resolve(trimmedName);
                    } else {
                        fs.mkdirSync(projectPath);
                        console.log(`Project directory '${trimmedName}' created successfully at ${projectPath}`);
                        resolve(trimmedName);
                    }
                } catch (error) {
                    console.error(`Failed to create project directory: ${error.message}`);
                    reject(error);
                }
            } else {
                console.log('Project name cannot be empty.');
                reject(new Error('Project name cannot be empty.'));
            }
            rl.close();
        });
    });
}

function installDependencies(projectName: string) {
	return new Promise((resolve, reject) => {
    		const projectPath = path.join(process.cwd(), projectName);
    		fs.writeFileSync(path.join(projectPath, 'package.json'), packageJson(projectName));
		execSync('npm install', { cwd: projectPath, stdio: 'inherit' })
    execSync('npm install --save-dev eslint @eslint/js @types/eslint__js typescript @typescript-eslint/eslint-plugin eslint-define-config ts-node --loglevel=error', { cwd: projectPath, stdio: 'inherit' })
		resolve("Dependencies installed successfully");
	});
}

function makeDirs(projectName: string) {
    const projectPath = path.join(process.cwd(), projectName);
    const dirs = ['src', 'lib', 'test', 'dist', 'views'];
    dirs.forEach(dir => {
        fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
    });
}

function createFiles(projectName: string) {
    const projectPath = path.join(process.cwd(), projectName);
    fs.writeFileSync(path.join(projectPath, 'src', 'index.ts'), serve);
    fs.writeFileSync(path.join(projectPath, 'test', 'index.test.ts'), '');
    fs.writeFileSync(path.join(projectPath, 'views', 'index.html'),indexHtml);
    fs.writeFileSync(path.join(projectPath, 'tsconfig.json'), tsconfig);
    fs.writeFileSync(path.join(projectPath, '.eslintignore'), eslintIgnore);
    fs.writeFileSync(path.join(projectPath, 'eslint.config.js'), eslint);
}


