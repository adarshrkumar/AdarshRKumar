import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import path from 'path';
import fs from 'fs';

import updateImages from './update.js';
updateImages()

const directoryPath = path.join('./', 'content');
const categories = fs.readdirSync(`${directoryPath}/photos`);

if (fs.existsSync(`${directoryPath}/allPhotos`)) {
    var folders = fs.readdirSync(`${directoryPath}/allPhotos`)
    folders.forEach(folder => {
        if (fs.lstatSync(`${directoryPath}/allPhotos/${folder}`).isDirectory()) {
            var files = fs.readdirSync(`${directoryPath}/allPhotos/${folder}`)
            files.forEach(file => {
                fs.unlinkSync(`${directoryPath}/allPhotos/${folder}/${file}`)
            })
        }
        else {
            fs.unlinkSync(`${directoryPath}/allPhotos/${folder}`)
        }
    })
}
else {
    fs.mkdirSync(`${directoryPath}/allPhotos`);
}

categories.forEach((category, i) => {
    var isDir = fs.lstatSync(`${directoryPath}/photos/${category}`).isDirectory()
    if (isDir && category.toLowerCase() !== 'hide') {
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
    trailingSlash: 'always',
    integrations: [sitemap()]
}); 