const header_color = document.querySelector('.header_color');
const header_color_real = document.querySelector('.header_color_real');
const body_color = document.querySelector('.body_color');
const body_color_real = document.querySelector('.body_color_real');
const footer_color = document.querySelector('.footer_color');
const footer_color_real = document.querySelector('.footer_color_real');


const header_pickr = Pickr.create({
    el: header_color,
    useAsButton: true,
    theme: 'classic',
    default: document.getElementById("color_picker").getAttribute("data-header_color"),
    components: {
        preview: true,
        hue: true,

        interaction: {
            hex: true,
            input: true,
            save: true
        }
    }
}).on('init', header_pickr => {
    header_color_real.value = header_pickr.getSelectedColor().toHEXA().toString(0);
    header_color.style.backgroundColor = header_pickr.getSelectedColor().toHEXA().toString(0);
}).on('save', color => {
    header_color_real.value = color.toHEXA().toString(0);
    header_color.style.backgroundColor = color.toHEXA().toString(0);
    header_pickr.hide()
})

const body_pickr = Pickr.create({
    el: body_color,
    useAsButton: true,
    theme: 'classic',
    default: document.getElementById("color_picker").getAttribute("data-body_color"),
    components: {
        preview: true,
        hue: true,

        interaction: {
            hex: true,
            input: true,
            save: true
        }
    }
}).on('init', body_pickr => {
    body_color_real.value = body_pickr.getSelectedColor().toHEXA().toString(0);
    body_color.style.backgroundColor = body_pickr.getSelectedColor().toHEXA().toString(0);
}).on('save', color => {
    body_color_real.value = color.toHEXA().toString(0);
    body_color.style.backgroundColor = color.toHEXA().toString(0);
    body_pickr.hide()
})

const footer_pickr = Pickr.create({
    el: footer_color,
    useAsButton: true,
    theme: 'classic',
    default: document.getElementById("color_picker").getAttribute("data-footer_color"),
    components: {
        preview: true,
        hue: true,

        interaction: {
            hex: true,
            input: true,
            save: true
        }
    }
}).on('init', footer_pickr => {
    footer_color_real.value = footer_pickr.getSelectedColor().toHEXA().toString(0);
    footer_color.style.backgroundColor = footer_pickr.getSelectedColor().toHEXA().toString(0);
}).on('save', color => {
    footer_color_real.value = color.toHEXA().toString(0);
    footer_color.style.backgroundColor = color.toHEXA().toString(0);
    footer_pickr.hide()
})