import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import path from 'path';
import fs from 'fs';

const directoryPath = path.join('./', 'content');
const categories = fs.readdirSync(`${directoryPath}/photos`);

if (!fs.existsSync(`${directoryPath}/allPhotos`)) {
    fs.mkdirSync(`${directoryPath}/allPhotos`);
}

categories.forEach((category, i) => {
    var isDir = fs.lstatSync(`${directoryPath}/photos/${category}`).isDirectory()
    if (isDir) {
        var folders = fs.readdirSync(`${directoryPath}/photos/${category}`)
        folders.forEach(folder => {
            if (!fs.existsSync(`${directoryPath}/allPhotos/${folder}`)) {
                fs.mkdirSync(`${directoryPath}/allPhotos/${folder}`);
            }

            var files = fs.readdirSync(`${directoryPath}/photos/${category}/${folder}`)
            files.forEach(file => {
                if (file.endsWith('.json')) {
                    var nFName = file.split('.json').join('.js')
                    var content = fs.readFileSync(`./${directoryPath}/photos/${category}/${folder}/${file}`, 'utf-8')
                    content = `var data = ${content}\n\nexport default data`
                    fs.writeFileSync(`./${directoryPath}/allPhotos/${folder}/${nFName}`, content)
                }
                else {
                    fs.copyFileSync(`./${directoryPath}/photos/${category}/${folder}/${file}`, `./${directoryPath}/allPhotos/${folder}/${file}`)
                }
            })
        })
    }
});

// https://astro.build/config
export default defineConfig({
    site: 'https://adarshrkumar.dev',
    base: '/',
    trailingSlash: 'ignore',
    integrations: [sitemap()]
});
