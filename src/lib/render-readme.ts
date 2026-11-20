import * as cheerio from 'cheerio';

export default async function renderReadme(): Promise<{ tag: string; html: string }[]> {
    const $ = cheerio.load(await (await import('../../README.md')).compiledContent());

    $('table').attr('cellspacing', '0');

    $('img').each((_i, img) => {
        const src = $(img).attr('src');
        if (src && src.startsWith('./public/')) $(img).attr('src', src.replace('./public/', '/'));
    });

    $('pre code').each((_i, code) => void $(code).html(($(code).html() ?? '')
        .split('\n')
        .map((line, i, lines) => cheerio.load(line).text().includes('"name"')
            ? line.replace(/(<span[^>]*>)"(.*?)"(<\/span>)/, `$1"<a href="${cheerio.load(lines.slice(i, i + 4).join('\n')).text().match(/"skill_url":\s*"([^"]+)"/)?.[1]}"><img class="code-icon" src="${cheerio.load(lines.slice(i, i + 4).join('\n')).text().match(/"icon_url":\s*"([^"]+)"/)?.[1]}" alt=""> $2</a>"$3`)
            : line)
        .filter(line => !/"(proficiency|icon_url|skill_url)"/.test(cheerio.load(line).text()))
        .join('\n')));

    $('pre code .line').filter((_i, line) => $(line).text().includes('"name"')).each((_i, line) => {
        $(line).prepend($(line).children().first().text().match(/^\s*/)?.[0].slice(' '.repeat(4).length) ?? '');
        $(line).children().slice(0, 2).remove();
        $(line).children().last().remove();
        $(line).prev('.line').remove();
        $(line).next('.line').remove();
    });

    $('pre code .line').filter((_i, line) => $(line).text().trim() === '[').each((_i, line) => {
        const close = $(line).nextAll('.line').filter((_j, next) => $(next).text().trim().startsWith(']')).first();

        const items = $(line).nextUntil(close);

        items.slice(1).each((_j, item) => void items.first().append(', ', $(item).children()));
        items.slice(1).remove();
        items.first().contents().first().replaceWith(items.first().contents().first().text().slice(' '.repeat(4).length));
        close.remove();
        $(line).remove();
    });

    $('pre code .line').filter((_i, line) => /^\s*"[^"]+":\s*\[$/.test($(line).text())).each((_i, line) => void $(line).nextUntil($(line).nextAll('.line').filter((_j, next) => $(next).text().trim().startsWith(']')).first()).slice(0, -1).append('<span style="color:#E1E4E8">,</span>'));

    $('pre code').each((_i, code) => void $(code).html(($(code).html() ?? '').split('\n').filter(Boolean).join('\n')));

    return $('body').contents().toArray().map(node => ({ tag: 'name' in node ? node.name : '', html: $.html(node) }));
}
