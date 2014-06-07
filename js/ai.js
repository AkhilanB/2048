function Ai() {
    this.maxIter = 2;

    this.init = function() {
        // This method is called when AI is first initialized.
    }

    this.restart = function() {
        // This method is called when the game is reset.
    }

    this.weight_grid = function(dir, grid, iter) {
        var copy = grid.copy();
        var moved = copy.move(dir);
        if (!moved) return null;

        var weights = { 
            dir: dir,
            piecesLost: function() { return this.originalPieceCount - this.afterMovePieceCount; },
            totalPiecesLost: function(i) { 
                if (this.extra_weight == null) return this.piecesLost() / i;
                return (this.piecesLost() / i) + this.extra_weight.totalPiecesLost(i + 1);
            },
            totalPieceValue: function(i) { 
                if (this.extra_weight == null) return this.pieceValue / i;
                return (this.piecesValue / i) + this.extra_weight.totalPieceValue(i + 1);
            },
        };

        weights.originalPieceCount = 16 - grid.availableCells().length;
        weights.afterMovePieceCount = 16 - copy.availableCells().length;

        var total = 0;
        copy.eachCell(function(x, y, cell) { if (cell) total += Math.pow(cell.value, 2); });
        weights.pieceValue = total;

        weights.pairsNextToEachOther = 0;
        copy.eachCell(function(x, y, cell) {
            if (!cell) return;

            for (var x2 = x + 1; x2 < 4; x2++) {
                var cell2 = copy.cells[x2][y];
                if (cell2 != null) {
                    if (cell.value == cell2.value) weights.pairsNextToEachOther++;
                    break;
                }
            }

            for (var y2 = y + 1; y2 < 4; y2++) {
                var cell2 = copy.cells[x][y2];
                if (cell2 != null) {
                    if (cell.value == cell2.value) weights.pairsNextToEachOther++;
                    break;
                }
            }
        });

        var extra_weights = null;;
        if (iter < this.maxIter) {
            extra_weights = this.get_best(copy, iter + 1);
        }
        weights.extra_weight = extra_weights;
        return weights;
    }

    this.compare_weights = function(a, b) {
        if (a == null && b == null) return null;
        if (b == null) return a;
        if (a == null) return b;

        var aTotal = a.totalPiecesLost(1);
        var bTotal = b.totalPiecesLost(1);
        if (aTotal > bTotal) return a;
        if (aTotal < bTotal) return b;

        aTotal = a.totalPieceValue(1);
        bTotal = b.totalPieceValue(1);
        if (aTotal > bTotal) return a;
        if (aTotal < bTotal) return b;

        return a;
    }

    this.get_best = function(grid, iter) {
        var max = null;
        for (var i = 0; i < 4; i++) {
            var weights = this.weight_grid(i, grid, iter);
            max = this.compare_weights(weights, max);
        }
        return max;
    }

    this.step = function(grid) {
        var best = this.get_best(grid, 1);
        return best.dir;
    }
}
