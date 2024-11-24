import fs from 'fs-extra'
import path from 'path'

function getFName(path) {
    if (path.includes('.')) path = path.split('.').slice(0, -1).join('.')

    return path
}

const directoryPath = path.join('./', 'content');
const categories = fs.readdirSync(`${directoryPath}/photos`);

update()
function update() {
    categories.forEach((category, i) => {
        var isDir = fs.lstatSync(`${directoryPath}/photos/${category}`).isDirectory()
        if (isDir) {
            var files = fs.readdirSync(`${directoryPath}/photos/${category}`)
            files.forEach(file => {
                var isDir2 = fs.lstatSync(`${directoryPath}/photos/${category}/${file}`).isDirectory()
                if (!isDir2) {
                    var obj = {
                        name: getFName(file), 
                        fullname: file, 
                        extention: file.replaceAll(getFName(file), ''), 
                        category: category, 
                        uploader: 'adarshrkumar',
                    }
                    if (!fs.existsSync(`./${directoryPath}/photos/${category}/${getFName(file)}`)) {
                        fs.mkdirSync(`./${directoryPath}/photos/${category}/${getFName(file)}`);
                    }
                    if (fs.existsSync(`./${directoryPath}/photos/${category}/${getFName(file)}/${file}`)) {
                        fs.unlinkSync(`./${directoryPath}/photos/${category}/${getFName(file)}/${file}`);
                    }
                    fs.moveSync(`./${directoryPath}/photos/${category}/${file}`, `./${directoryPath}/photos/${category}/${getFName(file)}/${file}`)
                    fs.writeFileSync(`./${directoryPath}/photos/${category}/${getFName(file)}/info.json`, JSON.stringify(obj, null, 4))
                }
            })
        }
    });
}

export default update