import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import path from 'path';
import fs from 'fs';

const directoryPath = path.join('./', 'content');
const categories = fs.readdirSync(`${directoryPath}/photos`);

const memberUrls = []
categories.forEach((category, i) => {
    var isDir = fs.lstatSync(`${directoryPath}/${file}`).isDirectory()
    if (isDir) {
        var files = fs.readdirSync(`${directoryPath}/${category}`)
        files.forEach(file => {
            try {
                fs.copyFileSync(`${directoryPath}/${category}/${file}`, `${directoryPath}/allPhotos/${file}`, fs.constants.COPYFILE_EXCL)
            }
            catch (err) {  }
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
