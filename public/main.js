var settingsKey = 'settings'
applySettings()

function getSettings() {
    var settings = localStorage.getItem(settingsKey)
    console.log(settings)
    settings = !!settings ? settings : '[]'
    settings = JSON.parse(settings)
    return settings
}

var settingFunctions = {
    theme: function(theme) {
        setTheme(theme)
    }
}

function applySettings() {
    var settings = getSettings()
    settings.forEach(function(s, i) {
        var sName = s.name
        console.log(sName)
        var sContent = s.content
        settingFunctions[sName](sContent)
    })
}

function setSetting(name, value, type, key) {
    var settings = getSettings()

    var sIndex = 'nothing'
    settings.forEach(function(s, i) {
        var sName = s.name
        if (sName === name) sIndex = i
    })

    if (isNaN(sIndex)) {
        var settingsLength = settings.length
        settings.push({name: name})
        sIndex = settingsLength
    }

    var setting = settings[sIndex]
    var content = setting.content
    if (!!content === false) {
        switch(type) {
            case 'object': 
                content = {}
                break
            case 'list': 
                content = []
                break
            default: 
                content = ''
                break
        }
    }

    switch(type) {
        case 'object': 
            content[key] = value
            break
        case 'list': 
            content.push(value)
            break
        default: 
            content = value
            break
    }

    setting.content = content
    settings[sIndex] = setting
    settings = JSON.stringify(settings)
    localStorage.setItem(settingsKey, settings)
}