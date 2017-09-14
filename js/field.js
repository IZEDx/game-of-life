var Cell = (function () {
    function Cell(ctx, posX, posY, alive) {
        if (alive === void 0) { alive = false; }
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.alive = alive;
    }
    return Cell;
}());
export default Cell;
//# sourceMappingURL=field.js.map