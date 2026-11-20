import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const skillsPath = path.join(process.cwd(), 'content', 'skills.json');
const socialsPath = path.join(process.cwd(), 'content', 'socials.json');
const templatePath = path.join(process.cwd(), 'README_template.md');
const readmePath = path.join(process.cwd(), 'README.md');

// Helper functions
function toStrippedJson(data) {
    return JSON.stringify(Object.fromEntries(Object.entries(data).map(([category, items]) => [
        category,
        items
            .toSorted((a, b) => Math.max(...[b].flat().map(item => item.proficiency ?? 0)) - Math.max(...[a].flat().map(item => item.proficiency ?? 0)))
            .map(entry => [entry].flat().map(item => `<a href='${item.skill_url ?? item.social_url}'>${item.name}</a>`).join(', '))
    ])), null, 4);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await updateReadme();

export default async function updateReadme() {
    try {
        await fs.writeFile(
            readmePath,
            (await fs.readFile(templatePath, 'utf-8'))
                .replace('{skills}', `\`\`\`json\n${toStrippedJson(await fs.readJson(skillsPath))}\n\`\`\``)
                .replace('{socials}', `\`\`\`json\n${toStrippedJson(await fs.readJson(socialsPath))}\n\`\`\``),
            'utf-8'
        );
    } catch (error) {
        console.error('❌ Error updating README.md:', error);
        process.exit(1);
    }
}
