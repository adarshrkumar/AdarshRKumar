import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const skillsPath = path.join(process.cwd(), 'content', 'skills.json');
const templatePath = path.join(process.cwd(), 'README_template.md');
const readmePath = path.join(process.cwd(), 'README.md');

if (process.argv[1] === fileURLToPath(import.meta.url)) await updateReadme();

export default async function updateReadme() {
    try {
        await fs.writeFile(
            readmePath,
            (await fs.readFile(templatePath, 'utf-8'))
                .replace('{skills}', `\`\`\`json\n${JSON.stringify(await fs.readJson(skillsPath), null, 4)}\n\`\`\``),
            'utf-8'
        );
    } catch (error) {
        console.error('❌ Error updating README.md:', error);
        process.exit(1);
    }
}
