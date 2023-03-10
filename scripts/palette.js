import { COLORDATA, PALETTEDATA } from './data.js'
import { createElWithClass, createElWithText, pickRandomFromArray } from './helpers.js'

export function createPalette(palette, format) {
    // создаём контейнер, добавляем грид и навигацию
    let div = createElWithClass('div', 'palette')
    div.addEventListener('click', checkClick)
    // появление
    document.querySelector('.content').append(div)
    // получаем данные
    const data = COLORDATA[palette]
    // добавляем сами цвета
    createGrid(data.template, data.colors)
    // добавляем навигацию
    createPaletteMenu(format, palette)
}
function createGrid(template, colors) {
    const container = createElWithClass('div', 'palette__grid')
    container.style.gridTemplate = template
    // // кнопки цветов
    for (let color of colors) {
        let button = document.createElement('button')
        button.dataset.tag = 'color_btn'
        button.dataset.color = color
        button.style.background = 'rgb(53, 59, 72)'
        setTimeout(() => (button.style.background = formatColor(color, 'rgb')), 100)
        container.append(button)
    }
    // появление
    document.querySelector('.palette').append(container)
}
function createPaletteMenu(format, palette) {
    let container = createElWithClass('div', 'navigation')
    // навигация
    let flexblock = createElWithClass('div', 'navigation_main')
    // пункты навигации
    let palettebtn = createElWithText('button', PALETTEDATA.text.menu.palette)
    palettebtn.dataset.tag = 'palette_nav_btn'
    palettebtn.dataset.currentpalette = palette
    let formatbtn = createElWithText('button', PALETTEDATA.text.menu.format)
    formatbtn.dataset.tag = 'format_nav_btn'
    formatbtn.dataset.currentformat = format
    flexblock.append(palettebtn, formatbtn)
    // появление
    container.append(flexblock)
    document.querySelector('.palette').append(container)
}
function addNavFormat(timeout = 100) {
    let container = document.querySelector('.navigation_main')
    // навигация
    const flexblock = createElWithClass('div', 'navigation_format', 'close')
    flexblock.dataset.role = 'toggle'
    // пункты навигации
    for (let item of PALETTEDATA.formats) {
        let button = createElWithText('button', item.preview)
        button.dataset.tag = 'format_btn'
        button.dataset.format = item.format
        flexblock.append(button)
    }
    // появление
    container.before(flexblock)
    setTimeout(() => flexblock.classList.replace('close', 'open'), timeout)
}
function addNavPalette(timeout = 100) {
    let container = document.querySelector('.navigation_main')
    // навигация
    const flexblock = createElWithClass('div', 'navigation_palette', 'close')
    flexblock.dataset.role = 'toggle'
    // пункты навигации
    for (let palette of Object.keys(COLORDATA)) {
        let button = createElWithText('button', COLORDATA[palette].fullname)
        button.dataset.tag = 'palette_btn'
        button.dataset.name = palette
        flexblock.append(button)
    }
    // появление
    container.before(flexblock)
    setTimeout(() => flexblock.classList.replace('close', 'open'), timeout)
}
function addNotification(timeout, type, ...args) {
    let container = document.querySelector('.navigation_main')
    const div = createElWithClass('div', 'notification', 'close')
    div.dataset.role = 'toggle'
    let wrapper = createElWithClass('div', 'wrapper')
    if (type === 'color') {
        wrapper.style.background = args[1]
        // содержимое уведомления
        let colorspan = createElWithText('span', args[0])
        colorspan.classList.add('color')
        let textspan = createElWithText('span', pickRandomFromArray(PALETTEDATA.text.notifications.color))
        textspan.classList.add('randomtext')
        wrapper.append(colorspan, textspan)
    } else if (type === 'format') {
        wrapper.style.background = 'linear-gradient(90deg, #00467F, #A5CC82)'
        // содержимое уведомления
        let textspan = createElWithText('span', PALETTEDATA.text.notifications.format)
        textspan.classList.add('text')
        let titlespan = createElWithText('span', args[0])
        titlespan.classList.add('title')
        wrapper.append(textspan, titlespan)
    } else if (type === 'palette') {
        wrapper.style.background = 'linear-gradient(90deg, #544a7d, #ffd452)'
        // содержимое уведомления
        let textspan = createElWithText('span', PALETTEDATA.text.notifications.palette)
        textspan.classList.add('text')
        let titlespan = createElWithText('span', args[0])
        titlespan.classList.add('title')
        wrapper.append(textspan, titlespan)
    } else if (type === 'same_format') {
        wrapper.style.background = 'linear-gradient(90deg, #00416A, #E4E5E6)'
        // содержимое уведомления
        let textspan = createElWithText('span', 'Формат уже выбран!')
        textspan.classList.add('text')
        wrapper.append(textspan)
    } else if (type === 'same_palette') {
        wrapper.style.background = 'linear-gradient(90deg, #5D4157, #A8CABA)'
        // содержимое уведомления
        let textspan = createElWithText('span', 'Палитра уже выбрана!')
        textspan.classList.add('text')
        wrapper.append(textspan)
    }
    // появление
    div.append(wrapper)
    container.before(div)
    setTimeout(() => div.classList.replace('close', 'open'), timeout)
    setTimeout(() => div.classList.replace('open', 'close'), timeout + 1750)
    setTimeout(() => div.remove(), timeout + 2000)
}
function checkClick(event) {
    let timeout
    switch (event.target.dataset.tag) {
        case 'color_btn':
            timeout = closeSwitchingElement()
            pickColor(timeout, event.target)
            break
        case 'format_nav_btn':
            if (document.querySelector('.navigation_format')) {
                closeSwitchingElement()
            } else {
                timeout = closeSwitchingElement()
                addNavFormat()
            }
            break
        case 'palette_nav_btn':
            if (document.querySelector('.navigation_palette')) {
                closeSwitchingElement()
            } else {
                timeout = closeSwitchingElement()
                addNavPalette(timeout)
            }
            break
        case 'format_btn':
            timeout = closeSwitchingElement()
            if (event.target.dataset.format === document.querySelector('[data-currentformat]').dataset.currentformat) {
                addNotification(timeout, 'same_format')
            } else {
                changeFormat(event.target)
                addNotification(timeout, 'format', event.target.textContent)
            }
            break
        case 'palette_btn':
            timeout = closeSwitchingElement()
            if (event.target.dataset.name === document.querySelector('[data-currentpalette]').dataset.currentpalette) {
                addNotification(timeout, 'same_palette')
            } else {
                changePalette(event.target)
                addNotification(timeout, 'palette', event.target.textContent)
            }
            break
    }
}
function closeSwitchingElement() {
    let element = document.querySelector('[data-role]')
    if (element) {
        if (element.classList.contains('open')) {
            element.classList.replace('open', 'close')
            setTimeout(() => element.remove(), 250)
            return 250
        } else if (element.classList.contains('close')) {
            element.remove()
            return 100
        }
    } else {
        return 0
    }
}
function pickColor(timeout, element) {
    let format = document.querySelector('[data-currentformat]').dataset.currentformat
    let pickedcolor = formatColor(element.dataset.color, format)
    let backgroundcolor = formatColor(element.dataset.color, 'rgb')
    addNotification(timeout, 'color', pickedcolor, backgroundcolor)
    navigator.clipboard.writeText(pickedcolor)
}
function formatColor(colordata, format) {
    let formated
    switch (format) {
        case 'hex':
            formated = toHEX(colordata)
            break
        case 'sharphex':
            formated = toHEX(colordata, true)
            break
        case 'rgb':
            formated = toRGB(colordata)
            break
        case 'rgba':
            formated = toRGB(colordata, true)
            break
        case 'hsl':
            formated = toHSL(colordata)
            break
        case 'hsla':
            formated = toHSL(colordata, true)
            break
    }
    return formated
    function toRGB(colordata, hasAlpha = false) {
        if (hasAlpha) {
            return 'rgba(' + colordata + ', 1)'
        } else {
            return 'rgb(' + colordata + ')'
        }
    }
    function toHEX(colordata, hasSharp = false) {
        let array = colordata.split(', ')
        let hex = ''
        for (let colorpart of array) {
            let color = +colorpart
            hex += color.toString(16)
        }
        if (hasSharp) {
            return '#' + hex
        } else {
            return hex
        }
    }
    function toHSL(colordata, hasAlpha = false) {
        let array = colordata.split(', ')
        let r = array[0] / 255
        let g = array[1] / 255
        let b = array[2] / 255
        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0
        if (delta == 0) h = 0
        else if (cmax == r) h = ((g - b) / delta) % 6
        else if (cmax == g) h = (b - r) / delta + 2
        else h = (r - g) / delta + 4
        h = Math.round(h * 60)
        if (h < 0) h += 360
        l = (cmax + cmin) / 2
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
        s = +(s * 100).toFixed(0)
        l = +(l * 100).toFixed(0)
        if (hasAlpha) {
            return 'hsla(' + h + ', ' + s + '%, ' + l + '%, 1)'
        } else {
            return 'hsl(' + h + ', ' + s + '%, ' + l + '%)'
        }
    }
}
function changeFormat(element) {
    // обновляем данные текущего формата
    document.querySelector('[data-currentformat]').dataset.currentformat = element.dataset.format
}
function changePalette(element) {
    const data = COLORDATA[element.dataset.name]
    let current = document.querySelector('.palette__grid')
    current.remove()
    createGrid(data.template, data.colors)
    // обновляем данные текущей палитры
    document.querySelector('[data-currentpalette]').dataset.currentpalette = element.dataset.name
}
