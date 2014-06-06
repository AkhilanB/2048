function Ai() {
    this.init = function() {
        // This method is called when AI is first initialized.
    }

    this.restart = function() {
        // This method is called when the game is reset.
    }
	
	var MAX_SEARCH_DEPTH = 6;
	
	function rateAverageValue(grid) {
		var sum = 0;
		var ct  = 0;
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (grid.cells[i][j] != null) {
					sum += 1;
					ct++;
				}
			}
		}
		return sum / ct;
	}
    
	
	function rateGrid(grid) {
		return rateAverageValue(grid);
	}
	
	function dfs(grid, depth) {
		var ret = {dir: 0, avgRating: -1000000};
		if (depth >= MAX_SEARCH_DEPTH) {
			ret.avgRating = rateGrid(grid);
			return ret;
		}
		
		for (var dir = 0; dir < 4; dir++) {
			var grid2 = grid.copy();
			if (grid2.move(dir)) {
				var moveRating = 0.00001;
                var cells = grid2.availableCells();
                if (cells.length == 0) continue;
                for (var i = 0; i < cells.length; i++) {
                    var tile = new Tile(cells[i],2);
                    grid2.insertTile(tile);
                    moveRating += dfs(grid2, depth+1).avgRating;
				    grid2.removeTile(tile);
                }
                
                //console.log(dir, moveRating, cells.length, moveRating / cells.length)
                
                moveRating /= cells.length;
                
                //console.log(dir, moveRating);
                
                if (moveRating > ret.avgRating) {
					ret.avgRating = moveRating;
					ret.dir = dir;
				}
			}
		}
        //console.log(ret.dir);
		return ret;
	}
	
    this.step = function(grid) {
		return dfs(grid, 0).dir;
    }
}
