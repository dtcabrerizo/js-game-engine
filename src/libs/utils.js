'use strict'
export class Rect {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    containsPoint(point) {
        return Rect.isPointInRect(this, point);
    }
    get center() {
        return [this.x + this.w / 2, this.y + this.h / 2];
    }
    draw(ctx, fill, stroke, lineWidth) {
        ctx.save();
        if (fill) {
            ctx.fillStyle = fill;
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }
        if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = lineWidth || 1;
            ctx.strokeRect(this.x, this.y, this.w, this.h);
        }
        ctx.restore();
    }
    static isPointInRect(rect, point) {
        return point.x > rect.x && point.x < rect.x + rect.w && point.y > rect.y && point.y < rect.y + rect.h;
    }
}

export function sendTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }

}


export function shuffle(array) {
    let m = array.length;
    while (m) {
        const i = Math.floor(Math.random() * m--);
        [array[m], array[i]] = [array[i], array[m]];
    }
    return array;
}


export function getForecolor(backcolor) {
    const d = document.createElement("div");
    d.style.color = backcolor;
    document.body.appendChild(d);
    const color = window.getComputedStyle(d).color;
    document.body.removeChild(d);

    const rgb = color.replace(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)/, '$1 $2 $3').split(' ');
    // http://www.w3.org/TR/AERT#color-contrast
    const brightness = Math.round(((parseInt(rgb[0]) * 299) +
        (parseInt(rgb[1]) * 587) +
        (parseInt(rgb[2]) * 114)) / 1000);
    return (brightness > 125) ? 'black' : 'white';

}

