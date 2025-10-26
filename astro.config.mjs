// Imports

import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

import path from 'path';
import fs from 'fs';
import updateImages from './update';

// Image processing

// Run image update process
updateImages()

// Content processing

const directoryPath = path.join('./', 'content');
const categories = fs.readdirSync(`${directoryPath}/photos`);

// Clean up existing allPhotos directory
if (fs.existsSync(`${directoryPath}/allPhotos`)) {
    var folders = fs.readdirSync(`${directoryPath}/allPhotos`)
    folders.forEach(folder => {
        if (fs.lstatSync(`${directoryPath}/allPhotos/${folder}`).isDirectory()) {
            var files = fs.readdirSync(`${directoryPath}/allPhotos/${folder}`).filter(file => file !== '.DS_Store')
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

// Process photo categories
categories.forEach((category, i) => {
    var isDir = fs.lstatSync(`${directoryPath}/photos/${category}`).isDirectory()
    if (isDir && category.toLowerCase() !== 'hide') {
        var folders = fs.readdirSync(`${directoryPath}/photos/${category}`)
        folders.forEach(folder => {
            if (!fs.existsSync(`${directoryPath}/allPhotos/${folder}`)) {
                fs.mkdirSync(`${directoryPath}/allPhotos/${folder}`);
            }

            var files = fs.readdirSync(`${directoryPath}/photos/${category}/${folder}`).filter(file => file !== '.DS_Store')
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

// Astro configuration

// https://astro.build/config
export default defineConfig({
    site: 'https://adarshrkumar.dev',
    base: '/',
    trailingSlash: 'always',
    adapter: vercel(),
    integrations: [sitemap()],
    vite: {
        server: {
            headers: {
                'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://platform-api.sharethis.com https://api.rss2json.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.rss2json.com https://webshot.adarshrkumar.dev; frame-src 'self' https://www.youtube.com;"
            }
        }
    }
}); 