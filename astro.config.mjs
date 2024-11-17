import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import path from 'path';
import fs from 'fs';

const directoryPath = path.join('./', 'content');
const categories = fs.readdirSync(`${directoryPath}/photos`);

// if (fs.existsSync(`${directoryPath}/allPhotos`)) {
//     const folders = fs.readdirSync(`${directoryPath}/allPhotos`); 
//     if (folders) {
//         if (folders.length > 0) {
//             folders.forEach(folder => {
//                 const files = fs.readdirSync(`${directoryPath}/allPhotos/${folder}`); 
//                 if (files) {
//                     if (files.length > 0) {
//                         files.forEach(file => {
//                             fs.unlinkSync(`${directoryPath}/allPhotos/${folder}/${file}`); 
//                         })
//                     }
//                 }
//                 fs.rmdirSync(`${directoryPath}/allPhotos/${folder}`); 
//             })        
//         }
//     }
//     fs.rmdirSync(`${directoryPath}/allPhotos`); 
// }
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
                fs.copyFileSync(`./${directoryPath}/photos/${category}/${folder}/${file}`, `./${directoryPath}/allPhotos/${folder}/${file}`)
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
