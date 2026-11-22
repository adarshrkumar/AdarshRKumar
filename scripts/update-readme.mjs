import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const     skillsPath = path.join(process.cwd(), 'content',  'skills.json');
const    socialsPath = path.join(process.cwd(), 'content', 'socials.json');
const   templatePath = path.join(process.cwd(), 'README_template.md');
const mainReadmePath = path.join(process.cwd(), 'README.md');
const siteReadmePath = path.join(process.cwd(), 'README_site.md');

// Helper functions
function toStrippedLines(items, indent) {
    return items
        .toSorted((a, b) => Math.max(...[b].flat().map(item => item.proficiency ?? 0)) - Math.max(...[a].flat().map(item => item.proficiency ?? 0)))
        .map(entry => `${' '.repeat(indent)}${[entry].flat().map(item => `"<a href='${item.skill_url ?? item.social_url}'>${item.name}</a>"`).join(', ')}`)
        .join(',\n');
}

function toStrippedJson(data) {
    return Array.isArray(data)
        ? `[\n${toStrippedLines(data, 4)}\n]`
        : `{\n${Object.entries(data).map(([category, items]) => `    ${JSON.stringify(category)}: [\n${toStrippedLines(items, 8)}\n    ]`).join(',\n')}\n}`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await updateReadme();

export default async function updateReadme() {
    try {
        const templateContent = await fs.readFile(templatePath, 'utf-8');
        const skills = Object.fromEntries(Object.entries(await fs.readJson(skillsPath)).map(([category, items]) => [
            category,
            items.map(item => Array.isArray(item) ? item.filter(skill => skill.hidden !== true) : item)
                .filter(item => Array.isArray(item) ? item.length : item.hidden !== true),
        ]));
        const socials = await fs.readJson(socialsPath);

        const mainReadmeContent = templateContent
            .replace('{skills}', Object.entries(skills).map(([category, items]) => `- **${category}**\n${items.toSorted((a, b) => Math.max(...[b].flat().map(item => item.proficiency ?? 0)) - Math.max(...[a].flat().map(item => item.proficiency ?? 0))).flatMap(item => [item].flat()).map(item => `  - [${item.name}](${item.skill_url})`).join('\n')}`).join('\n'))
            .replace('{socials}', socials.map(item => `- [${item.name}](${item.social_url})`).join('\n'));

        const siteReadmeContent = templateContent
            .replace('{skills}', `\`\`\`json\n${toStrippedJson(skills)}\n\`\`\``)
            .replace('{socials}', `\`\`\`json\n${toStrippedJson(socials)}\n\`\`\``);

        await fs.writeFile(mainReadmePath, mainReadmeContent, 'utf-8');

        await fs.writeFile(siteReadmePath, siteReadmeContent, 'utf-8');
    } catch (error) {
        console.error('❌ Error updating README.md and README_site.md:', error);
        process.exit(1);
    }
}
