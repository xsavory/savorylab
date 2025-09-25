import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // App generator
  plop.setGenerator("react-vite-basic", {
    description: "Basic Vite React app",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the new app?",
        validate: (input: string) => {
          if (input.includes(".")) {
            return "App name cannot include an extension";
          }
          if (input.includes(" ")) {
            return "App name cannot include spaces";
          }
          if (!input) {
            return "App name is required";
          }
          return true;
        },
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "{{ turbo.paths.root }}/apps/{{ name }}",
        base: "{{ turbo.paths.root }}/turbo/generators/templates/react-vite-basic",
        templateFiles: "{{ turbo.paths.root }}/turbo/generators/templates/react-vite-basic/**/*",
        globOptions: {
          dot: true,
        },
      },
      {
        type: "modify",
        path: "{{ turbo.paths.root }}/apps/{{ name }}/package.json",
        pattern: /"name": ".*"/g,
        template: `"name": "{{ name }}"`,
      },
      {
        type: "modify",
        path: "{{ turbo.paths.root }}/apps/{{ name }}/tsconfig.json",
        pattern: /"name": ".*"/g,
        template: `"name": "{{ name }}"`,
      },
      {
        type: "modify",
        path: "{{ turbo.paths.root }}/apps/{{ name }}/tsconfig.json",
        pattern: /^(\s*{)/,
        template: `$1\n  "extends": "@repo/typescript-config/react-vite.json",`,
      },
      {
        type: "modify",
        path: "{{ turbo.paths.root }}/package.json",
        pattern: /("scripts": \{[\s\S]*?)(\n  \})/,
        template: `$1,\n    "dev:{{ name }}": "turbo run dev --filter={{ name }}...",\n    "build:{{ name }}": "turbo run build --filter={{ name }}...",\n    "preview:{{ name }}": "turbo run preview --filter={{ name }}"$2`,
      },
      (answers: any) => {
        const { execSync } = require('child_process');
        const path = require('path');
        const fs = require('fs');

        try {
          console.log(`Installing dependencies for ${answers.name}...`);
          const rootPath = path.resolve(__dirname, '../..');
          execSync(`pnpm install --filter="${answers.name}"`, {
            stdio: 'inherit',
            cwd: rootPath,
            encoding: 'utf8'
          });
          console.log(`\n✅ Dependencies installed successfully for ${answers.name}`);

          console.log(`\n📋 Next steps:`);
          console.log(`   Dev:     pnpm run dev:${answers.name}`);
          console.log(`   Build:   pnpm run build:${answers.name}`);
          console.log(`   Preview: pnpm run preview:${answers.name}`);

          return "App generated and dependencies installed successfully!";
        } catch (error) {
          console.error(`\n❌ Generator Error: Failed to install dependencies for ${answers.name}`);
          console.error(`Error details: ${(error as Error).message}`);

          // Rollback: Remove generated app directory
          const appPath = path.join(path.resolve(__dirname, '../..'), 'apps', answers.name);
          try {
            if (fs.existsSync(appPath)) {
              console.log(`\n🔄 Rolling back: Removing generated app directory...`);
              fs.rmSync(appPath, { recursive: true, force: true });
              console.log(`✅ Rollback completed: ${appPath} removed`);
            }
          } catch (rollbackError) {
            console.error(`❌ Rollback failed: ${(rollbackError as Error).message}`);
          }

          // Rollback: Remove added scripts from package.json
          try {
            const packageJsonPath = path.join(path.resolve(__dirname, '../..'), 'package.json');
            if (fs.existsSync(packageJsonPath)) {
              console.log(`\n🔄 Rolling back package.json scripts...`);
              const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

              // Remove the added scripts
              delete packageJson.scripts[`dev:${answers.name}`];
              delete packageJson.scripts[`build:${answers.name}`];
              delete packageJson.scripts[`preview:${answers.name}`];

              fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
              console.log(`✅ Package.json scripts rollback completed`);
            }
          } catch (rollbackError) {
            console.error(`❌ Package.json rollback failed: ${(rollbackError as Error).message}`);
          }

          console.log(`\n🐛 This appears to be an issue with the generator template or configuration.`);
          console.log(`Please check:`);
          console.log(`   - Generator template files in turbo/generators/templates/react-vite-basic/`);
          console.log(`   - Generator configuration in turbo/generators/config.ts`);
          console.log(`   - Project dependencies and pnpm workspace setup`);

          throw new Error(`Generator failed and changes have been rolled back. Original error: ${(error as Error).message}`);
        }
      },
    ],
  });

  // React Vite with React Query generator
  plop.setGenerator("react-vite-rq", {
    description: "React Vite app with React Query",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the new app?",
        validate: (input: string) => {
          if (input.includes(".")) {
            return "App name cannot include an extension";
          }
          if (input.includes(" ")) {
            return "App name cannot include spaces";
          }
          if (!input) {
            return "App name is required";
          }
          return true;
        },
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "{{ turbo.paths.root }}/apps/{{ name }}",
        base: "{{ turbo.paths.root }}/turbo/generators/templates/react-vite-rq",
        templateFiles: "{{ turbo.paths.root }}/turbo/generators/templates/react-vite-rq/**/*",
        globOptions: {
          dot: true,
        },
      },
      {
        type: "modify",
        path: "{{ turbo.paths.root }}/apps/{{ name }}/package.json",
        pattern: /"name": ".*"/g,
        template: `"name": "{{ name }}"`,
      },
      {
        type: "modify",
        path: "{{ turbo.paths.root }}/apps/{{ name }}/tsconfig.json",
        pattern: /"name": ".*"/g,
        template: `"name": "{{ name }}"`,
      },
      {
        type: "modify",
        path: "{{ turbo.paths.root }}/apps/{{ name }}/tsconfig.json",
        pattern: /^(\s*{)/,
        template: `$1\n  "extends": "@repo/typescript-config/react-vite.json",`,
      },
      {
        type: "modify",
        path: "{{ turbo.paths.root }}/package.json",
        pattern: /("scripts": \{[\s\S]*?)(\n  \})/,
        template: `$1,\n    "dev:{{ name }}": "turbo run dev --filter={{ name }}...",\n    "build:{{ name }}": "turbo run build --filter={{ name }}...",\n    "preview:{{ name }}": "turbo run preview --filter={{ name }}"$2`,
      },
      (answers: any) => {
        const { execSync } = require('child_process');
        const path = require('path');
        const fs = require('fs');

        try {
          console.log(`Installing dependencies for ${answers.name}...`);
          const rootPath = path.resolve(__dirname, '../..');
          execSync(`pnpm install --filter="${answers.name}"`, {
            stdio: 'inherit',
            cwd: rootPath,
            encoding: 'utf8'
          });
          console.log(`\n✅ Dependencies installed successfully for ${answers.name}`);

          console.log(`\n📋 Next steps:`);
          console.log(`   Dev:     pnpm run dev:${answers.name}`);
          console.log(`   Build:   pnpm run build:${answers.name}`);
          console.log(`   Preview: pnpm run preview:${answers.name}`);
          console.log(`\n🚀 Start developing: cd apps/${answers.name} && pnpm dev`);

          return "React Query app generated and dependencies installed successfully!";
        } catch (error) {
          console.error(`\n❌ Generator Error: Failed to install dependencies for ${answers.name}`);
          console.error(`Error details: ${(error as Error).message}`);

          // Rollback: Remove generated app directory
          const appPath = path.join(path.resolve(__dirname, '../..'), 'apps', answers.name);
          try {
            if (fs.existsSync(appPath)) {
              console.log(`\n🔄 Rolling back: Removing generated app directory...`);
              fs.rmSync(appPath, { recursive: true, force: true });
              console.log(`✅ Rollback completed: ${appPath} removed`);
            }
          } catch (rollbackError) {
            console.error(`❌ Rollback failed: ${(rollbackError as Error).message}`);
          }

          // Rollback: Remove added scripts from package.json
          try {
            const packageJsonPath = path.join(path.resolve(__dirname, '../..'), 'package.json');
            if (fs.existsSync(packageJsonPath)) {
              console.log(`\n🔄 Rolling back package.json scripts...`);
              const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

              // Remove the added scripts
              delete packageJson.scripts[`dev:${answers.name}`];
              delete packageJson.scripts[`build:${answers.name}`];
              delete packageJson.scripts[`preview:${answers.name}`];

              fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
              console.log(`✅ Package.json scripts rollback completed`);
            }
          } catch (rollbackError) {
            console.error(`❌ Package.json rollback failed: ${(rollbackError as Error).message}`);
          }

          console.log(`\n🐛 This appears to be an issue with the generator template or configuration.`);
          console.log(`Please check:`);
          console.log(`   - Generator template files in turbo/generators/templates/react-vite-rq/`);
          console.log(`   - Generator configuration in turbo/generators/config.ts`);
          console.log(`   - Project dependencies and pnpm workspace setup`);

          throw new Error(`Generator failed and changes have been rolled back. Original error: ${(error as Error).message}`);
        }
      },
    ],
  });

  // React Vite with Appwrite generator
  plop.setGenerator("react-vite-appwrite", {
    description: "React Vite app with Appwrite",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the new app?",
        validate: (input: string) => {
          if (input.includes(".")) {
            return "App name cannot include an extension";
          }
          if (input.includes(" ")) {
            return "App name cannot include spaces";
          }
          if (!input) {
            return "App name is required";
          }
          return true;
        },
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "{{ turbo.paths.root }}/apps/{{ name }}",
        base: "{{ turbo.paths.root }}/turbo/generators/templates/react-vite-appwrite",
        templateFiles: "{{ turbo.paths.root }}/turbo/generators/templates/react-vite-appwrite/**/*",
        globOptions: {
          dot: true,
        },
      },
      {
        type: "modify",
        path: "{{ turbo.paths.root }}/apps/{{ name }}/package.json",
        pattern: /"name": ".*"/g,
        template: `"name": "{{ name }}"`,
      },
      {
        type: "modify",
        path: "{{ turbo.paths.root }}/apps/{{ name }}/tsconfig.json",
        pattern: /"name": ".*"/g,
        template: `"name": "{{ name }}"`,
      },
      {
        type: "modify",
        path: "{{ turbo.paths.root }}/apps/{{ name }}/tsconfig.json",
        pattern: /^(\s*{)/,
        template: `$1\n  "extends": "@repo/typescript-config/react-vite.json",`,
      },
      {
        type: "modify",
        path: "{{ turbo.paths.root }}/package.json",
        pattern: /("scripts": \{[\s\S]*?)(\n  \})/,
        template: `$1,\n    "dev:{{ name }}": "turbo run dev --filter={{ name }}...",\n    "build:{{ name }}": "turbo run build --filter={{ name }}...",\n    "preview:{{ name }}": "turbo run preview --filter={{ name }}"$2`,
      },
      (answers: any) => {
        const { execSync } = require('child_process');
        const path = require('path');
        const fs = require('fs');

        try {
          console.log(`Installing dependencies for ${answers.name}...`);
          const rootPath = path.resolve(__dirname, '../..');
          execSync(`pnpm install --filter="${answers.name}"`, {
            stdio: 'inherit',
            cwd: rootPath,
            encoding: 'utf8'
          });
          console.log(`\n✅ Dependencies installed successfully for ${answers.name}`);

          console.log(`\n📋 Next steps:`);
          console.log(`   Dev:     pnpm run dev:${answers.name}`);
          console.log(`   Build:   pnpm run build:${answers.name}`);
          console.log(`   Preview: pnpm run preview:${answers.name}`);
          console.log(`\n🚀 Start developing: cd apps/${answers.name} && pnpm dev`);

          return "Appwrite app generated and dependencies installed successfully!";
        } catch (error) {
          console.error(`\n❌ Generator Error: Failed to install dependencies for ${answers.name}`);
          console.error(`Error details: ${(error as Error).message}`);

          // Rollback: Remove generated app directory
          const appPath = path.join(path.resolve(__dirname, '../..'), 'apps', answers.name);
          try {
            if (fs.existsSync(appPath)) {
              console.log(`\n🔄 Rolling back: Removing generated app directory...`);
              fs.rmSync(appPath, { recursive: true, force: true });
              console.log(`✅ Rollback completed: ${appPath} removed`);
            }
          } catch (rollbackError) {
            console.error(`❌ Rollback failed: ${(rollbackError as Error).message}`);
          }

          // Rollback: Remove added scripts from package.json
          try {
            const packageJsonPath = path.join(path.resolve(__dirname, '../..'), 'package.json');
            if (fs.existsSync(packageJsonPath)) {
              console.log(`\n🔄 Rolling back package.json scripts...`);
              const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

              // Remove the added scripts
              delete packageJson.scripts[`dev:${answers.name}`];
              delete packageJson.scripts[`build:${answers.name}`];
              delete packageJson.scripts[`preview:${answers.name}`];

              fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
              console.log(`✅ Package.json scripts rollback completed`);
            }
          } catch (rollbackError) {
            console.error(`❌ Package.json rollback failed: ${(rollbackError as Error).message}`);
          }

          console.log(`\n🐛 This appears to be an issue with the generator template or configuration.`);
          console.log(`Please check:`);
          console.log(`   - Generator template files in turbo/generators/templates/react-vite-appwrite/`);
          console.log(`   - Generator configuration in turbo/generators/config.ts`);
          console.log(`   - Project dependencies and pnpm workspace setup`);

          throw new Error(`Generator failed and changes have been rolled back. Original error: ${(error as Error).message}`);
        }
      },
    ],
  });
}