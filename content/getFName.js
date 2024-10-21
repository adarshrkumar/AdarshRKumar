function getFName(pathm, loc) {
    console.log(path, loc)

    if (path.startsWith('/')) path - path.slice(1)
    if (path.endsWith('/')) path = path.slice(0, -1)

    if (path.includes('/')) path = path.split('/').slice(-1)[0]
    if (path.endsWith('.md')) path = path.slice(0, -1*'.md'.length)

    return path
}

export default getFName