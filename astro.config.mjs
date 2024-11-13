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
            if (!fs.existsSync(`${directoryPath}/photos/${category}/${folder}`)) {
                fs.mkdirSync(`${directoryPath}/photos/${category}/${folder}`);
            }

            var files = fs.readdirSync(`${directoryPath}/photos/${category}/${folder}`)
            files.forEach(file => {
                fs.copyFileSync(`./${directoryPath}/photos/${category}/${folder}/${file}`, `./${directoryPath}/allPhotos/${folder}/${file}`, fs.constants.COPYFILE_EXCL)
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
