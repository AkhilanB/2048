var log2 = Math.log2;
if(!log2) {
    log2 = function (x) { return Math.log(x) / Math.LN2; };
}    
 
function Ai() {
    var score = function (grid, previous) {
        var total = 0, count = 0, ptotal = 0, pcount = 0;
        grid.eachCell(function (x, y, tile) {
            if (tile) { total += (log2(tile.value)-1)*tile.value; count += 1; }
        });
    //    previous.eachCell(function (x, y, tile) {
  //          if (tile) { ptotal += (log2(tile.value)-1)*tile.value; pcount += 1; }
//        });
        
        return total / count;
    };
    
    var multipliers = [1,1,1,1];//set one of these to 0 to discourage move in one direction
    
    //returns the best move according to the score function
    var mover = function (grid, depth) {
        var i, sc, b, copy;
        for (i = 0; i < 4; i++) { 
            copy = grid.copy();
            if (copy.move(i)) {
                copy.insertTile(new Tile(copy.randomAvailableCell(), Math.random() < 0.9 ? 2 : 4));
                if (!depth) { sc = [i, multipliers[i]*score(copy, grid)]; }
                else { 
                    var temp = mover(copy, depth - 1);
                    if (temp) { sc = [i, multipliers[i]*temp[1]]; } else { sc = [i, multipliers[i]*score(copy, grid)]; }
                }
                if (b == null || b[1] < sc[1]) {
                    b = sc;
                }
            }
        }
        return b;
    };
    
    this.init = function() { };
    this.restart = function() { };
    
    this.step = function(grid) {
        var list = [], moves = [null,null,null,null], i, item, j, b, ms, bs;
        for (i = 0; i < 6; i++) {//run several simulations
            item = mover(grid, 2);
            if(item == null) { return null; }
            j = item[0];
            if (moves[j] == null) {
                moves[j] = [item[1], 1];
            } else {
                moves[j][0] += item[1];
                moves[j][1]++;
                if (moves[j][1] > 3) { return j; }
            }
        }
        for (j = 0; j < 4; j++) {
            if (moves[j] != null) {
                ms = moves[j][0]/moves[j][1];
                if(!bs || bs < ms) {
                    bs = ms;
                    b = j;
                }
            }
        }
    
        return b;
    }
}
