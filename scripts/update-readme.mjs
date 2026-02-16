import fs from 'fs-extra';
import path from 'path';

const skillsPath = path.join(process.cwd(), 'content', 'skills.json');
const templatePath = path.join(process.cwd(), 'README_template.md');
const readmePath = path.join(process.cwd(), 'README.md');

/**
 * Generates a Markdown table for a list of skills, including icon, link, and progress bar.
 * @param {Array<{name: string, proficiency: number, icon_url: string, skill_url: string}>} skills - The list of skills.
 * @param {string} header - The header for the skill name column (e.g., 'Tool' or 'Lang').
 * @returns {string} - The Markdown table.
 */
function generateTable(skills, header = 'Tool') {
    if (!skills || skills.length === 0) {
        return '';
    }

    let table = `| ${header} | Proficiency Level |\n`;
    table += '|---|---|\n';

    for (const skill of skills) {
        // Construct the icon and link part: [![Name](icon_url)](skill_url)
        const iconAndLink = `[![${skill.name}](${skill.icon_url})](${skill.skill_url})`;

        // Construct the progress bar part: ![80%](progress-bar-url)&nbsp; 80%
        const progressBar = `![${skill.proficiency}%](https://progress-bar.adarshrkumar.dev/bar.svg?p=${skill.proficiency}%25)`;

        table += `| ${iconAndLink} | ${progressBar}&nbsp; ${skill.proficiency}% |\n`;
    }

    return table;
}

export default async function updateReadme() {
    try {
        const [skillsData, templateContent] = await Promise.all([
            fs.readJson(skillsPath),
            fs.readFile(templatePath, 'utf-8'),
        ]);

        // Generate markdown for tools
        const toolCategories = ['Design Softwares', 'Other Tools'];
        let toolsMarkdown = '';
        for (const category of toolCategories) {
            if (skillsData[category]) {
                toolsMarkdown += `### ${category}\n\n`;
                toolsMarkdown += generateTable(skillsData[category], 'Tool');
                toolsMarkdown += '\n';
            }
        }

        // Generate markdown for languages
        let languagesMarkdown = '';
        if (skillsData['Web Development - Front-End'] || skillsData['Web Development - Back End']) {
            languagesMarkdown += '### Web Development\n\n';
            if (skillsData['Web Development - Front-End']) {
                languagesMarkdown += '#### Front-End\n\n';
                languagesMarkdown += generateTable(skillsData['Web Development - Front-End'], 'Lang');
                languagesMarkdown += '\n';
            }
            if (skillsData['Web Development - Back End']) {
                languagesMarkdown += '#### Back End\n\n';
                languagesMarkdown += generateTable(skillsData['Web Development - Back End'], 'Lang');
                languagesMarkdown += '\n';
            }
        }
        if (skillsData['Other Languages']) {
            languagesMarkdown += `### Other Languages\n\n`;
            languagesMarkdown += generateTable(skillsData['Other Languages'], 'Lang');
            languagesMarkdown += '\n';
        }

        // Replace placeholders in the template
        let finalContent = templateContent.replace('{tools}', toolsMarkdown.trim());
        finalContent = finalContent.replace('{languages}', languagesMarkdown.trim());

        // Write to README.md
        await fs.writeFile(readmePath, finalContent, 'utf-8');

        console.log('✅ README.md has been updated successfully!');

    } catch (error) {
        console.error('❌ Error updating README.md:', error);
        process.exit(1);
    }
}
