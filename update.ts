import fs from 'fs-extra'
import path from 'path'

function getFName(filePath: string): string {
    if (filePath.includes('.')) filePath = filePath.split('.').slice(0, -1).join('.')
    return filePath
}

const directoryPath = path.join('./', 'content')
const categories = fs.readdirSync(`${directoryPath}/photos`)

function update(): void {
    categories.forEach((category, i) => {
        const isDir = fs.lstatSync(`${directoryPath}/photos/${category}`).isDirectory()
        if (isDir) {
            const files = fs.readdirSync(`${directoryPath}/photos/${category}`)
            files.forEach(file => {
                const isDir2 = fs.lstatSync(`${directoryPath}/photos/${category}/${file}`).isDirectory()
                if (!isDir2) {
                    let title = getFName(file)
                    if (title.startsWith('IMG_')) title = ''
                    if (title.includes('_')) title = title.replaceAll('_', ' ')
                    if (title.includes('-')) title = title.replaceAll('-', ' ')

                    const obj = {
                        name: getFName(file), 
                        fullname: file, 
                        extention: file.replaceAll(getFName(file), ''), 
                        category: category, 
                        title: title,
                        uploader: 'adarshrkumar',
                    }
                    if (!fs.existsSync(`./${directoryPath}/photos/${category}/${getFName(file)}`)) {
                        fs.mkdirSync(`./${directoryPath}/photos/${category}/${getFName(file)}`)
                    }
                    if (fs.existsSync(`./${directoryPath}/photos/${category}/${getFName(file)}/${file}`)) {
                        fs.unlinkSync(`./${directoryPath}/photos/${category}/${getFName(file)}/${file}`)
                    }
                    fs.moveSync(`./${directoryPath}/photos/${category}/${file}`, `./${directoryPath}/photos/${category}/${getFName(file)}/${file}`)
                    fs.writeFileSync(`./${directoryPath}/photos/${category}/${getFName(file)}/info.json`, JSON.stringify(obj, null, 4))
                }
            })
        }
    })
}

update()

export default update
