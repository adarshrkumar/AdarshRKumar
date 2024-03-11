var settingsKey = 'settings'

function setSetting(name, value, type, key) {
    var settings = localStorage.getItem(settingsKey)
    settings = !!settings ? settings : '{}'
    settings = JSON.parse(settings)

    var setting = settings[name]
    if (!!setting === false) {
        switch(type) {
            case 'object': 
                setting = {}
                break
            case 'list': 
                setting = []
                break
            default: 
                setting = ''
                break
        }
    }

    switch(type) {
        case 'object': 
            setting[key] = value
            break
        case 'list': 
            setting.push(value)
            break
        default: 
            setting = value
            break
    }

    settings = JSON.stringify(settings)
    localStorage.setItem(settingsKey, settings)
}