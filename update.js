import fs from 'fs'
import path from 'path'

function getFName(path) {
    if (path.includes('.')) path = path.split('.').slice(0, -1).join('.')

    return path
}

const directoryPath = path.join('./', 'content');
const categories = fs.readdirSync(`${directoryPath}/photos`);

categories.forEach((category, i) => {
    var isDir = fs.lstatSync(`${directoryPath}/photos/${category}`).isDirectory()
    if (isDir) {
        var images = fs.readdirSync(`${directoryPath}/photos/${category}`)
        images.forEach(image => {
            var isDir2 = fs.lstatSync(`${directoryPath}/photos/${category}/${image}`).isDirectory()
            if (isDir) {
                var files = fs.readdirSync(`${directoryPath}/photos/${category}/${image}`)
                files.forEach(file => {
                    if (file === 'info.json') {
                        fs.renameSync(`${directoryPath}/photos/${category}/${image}/${file}`, `${directoryPath}/photos/${category}/${image}/${image}.json`)
                    }
                })
            }
        })
    }
});

