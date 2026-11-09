import fs from 'fs-extra';
import path from 'path';

const skillsPath = path.join(process.cwd(), 'content', 'skills.json');
const templatePath = path.join(process.cwd(), 'README_template.md');
const readmePath = path.join(process.cwd(), 'README.md');

/**
 * Generates a Markdown bulleted list of linked skill names.
 * @param {Array<{name: string, skill_url: string}>} skills - The list of skills.
 * @returns {string} - The Markdown list.
 */
function generateList(skills) {
    if (!skills || skills.length === 0) return '';

    return skills.map((skill) => `- [${skill.name}](${skill.skill_url})\n`).join('');
}

/**
 * Generates a Markdown section with a heading and a skill list.
 * @param {string} heading - The Markdown heading line (e.g., '### Other Tools').
 * @param {Array<{name: string, skill_url: string}>} skills - The list of skills.
 * @returns {string} - The Markdown section, or an empty string if there are no skills.
 */
function generateSection(heading, skills) {
    if (!skills || skills.length === 0) return '';

    return `${heading}\n\n${generateList(skills)}\n`;
}

export default async function updateReadme() {
    try {
        const [skillsData, templateContent] = await Promise.all([
            fs.readJson(skillsPath),
            fs.readFile(templatePath, 'utf-8'),
        ]);

        // Generate markdown for tools
        let toolsMarkdown = '';
        toolsMarkdown += generateSection('### Design Software', skillsData['Design Softwares']);
        toolsMarkdown += generateSection('### Other Tools', skillsData['Other Tools']);

        // Generate markdown for languages
        const frontEnd = skillsData['Web Development - Front-End'];
        const backEnd = skillsData['Web Development - Back End'];
        let languagesMarkdown = '';
        if (frontEnd?.length || backEnd?.length) {
            languagesMarkdown += '### Web Development\n\n';
            languagesMarkdown += generateSection('#### Front End', frontEnd);
            languagesMarkdown += generateSection('#### Back End', backEnd);
        }
        languagesMarkdown += generateSection('### Other Languages', skillsData['Other Languages']);

        // Replace placeholders in the template
        let finalContent = templateContent.replace('{tools}', toolsMarkdown.trim());
        finalContent = finalContent.replace('{languages}', languagesMarkdown.trim());

        // Write to README.md
        await fs.writeFile(readmePath, finalContent, 'utf-8');
    } catch (error) {
        console.error('❌ Error updating README.md:', error);
        process.exit(1);
    }
}
