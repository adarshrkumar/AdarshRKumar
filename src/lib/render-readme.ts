import * as cheerio from 'cheerio';

import skills from '../../content/skills.json';
import socials from '../../content/socials.json';

export default async function renderReadme(): Promise<{ tag: string; html: string }[]> {
    const $ = cheerio.load(await (await import('../../README_site.md')).compiledContent());

    $('table').attr('cellspacing', '0');

    $('img').each((_i, img) => {
        const src = $(img).attr('src');
        if (src && src.startsWith('./public/')) $(img).attr('src', src.replace('./public/', '/'));
    });

    $('pre code .line > span').filter((_i, span) => /^\s*"<a href='[^']+'>[^<]+<\/a>"$/.test($(span).text())).each((_i, span) => void $(span).html($(span).text().replace(/<a href='([^']+)'>([^<]+)<\/a>/, (_match, url, name) => `<a href="${url}"><img class="code-icon" src="${[...Object.values(skills), ...Object.values(socials)].flat(2).find(skill => skill.name === name)?.icon_url}" alt=""> ${name}</a>`)));

    return $('body').contents().toArray().map(node => ({ tag: 'name' in node ? node.name : '', html: $.html(node) }));
}
