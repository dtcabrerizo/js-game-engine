'use strict'
export default class Rect {
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
