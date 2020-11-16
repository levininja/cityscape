
function createLight(margin, maxY, maxX, grid, minLightSize, maxLightSize, lightIsStatic, 
    colorScheme, NUMBER_OF_COLORS)
{
    let color1 = colorScheme.color1;
    let color2 = colorScheme.color2;
    let color3 = colorScheme.color3;
    let color4 = colorScheme.color4;

    let size = generateRand(minLightSize, maxLightSize);
    let left = generateRand(0 + margin, maxX - margin);
    let top = generateRand(0 + margin, maxY - margin);
    if(coordinatesValidInBuildingGrid(left, top, grid, size)){
        let color = pickRandomColor(color1, color2, color3, color4, NUMBER_OF_COLORS);
        createLightAtCoord(left, top, size, color, lightIsStatic);
    }
}
function createLightAtCoord(left, top, size, color, lightIsStatic, flag){
    let light = document.createElement('div');
    light.classList.add("light");
    light.classList.add("blink");
    light.style.left = left;
    light.style.top = top;
    light.style.width = size + "px";
    light.style.height = size + "px";
    light.style.backgroundColor = color;

    document.getElementById('cityscape').appendChild(light);
    if(!lightIsStatic)
        fadeBlink(light);
}
function coordinatesValidInBuildingGrid(left, top, grid, diameter){
    //Have to invert y coordinate as it's 0 at top, high numbers at bottom.
    let yCoord = grid[0].length - top;
    let pixel = grid[left][yCoord];
    let goodSoFar = true;
    let radius = Math.ceil(diameter / 2);
    if(pixel !== true)
        goodSoFar = false;
    else{
        // Check the pixels to the left, according to the size of the light.
        for(let x = left - 1; x > left - radius; x--){
            if(x < 0)
                goodSoFar = false;
            let nextPixel = grid[x][yCoord];
            if(nextPixel !== true)
                goodSoFar = false;
        }
        // Check the pixels to the right, according to the size of the light.
        for(let x = left + 1; x < left + radius; x++){
            if(x >= grid.length)
                goodSoFar = false;
            let nextPixel = grid[x][yCoord];
            if(nextPixel !== true)
                goodSoFar = false;
        }
        // Check the pixels above, according to the size of the light.
        for(let y = yCoord + 1; y < yCoord + radius; y++){
            if(y >=grid[0].length)
                goodSoFar = false;
            let nextPixel = grid[left][y];
            if(nextPixel !== true)
                goodSoFar = false;
        }
        // Check the pixels below, according to the size of the light.
        for(let y = yCoord - 1; y > yCoord - radius; y--){
            if(y < 0)
                goodSoFar = false;
            let nextPixel = grid[left][y];
            if(nextPixel !== true)
                goodSoFar = false;
        }
    }

    return goodSoFar;
}
function fadeBlink(element) {
    let op = 1;  // initial opacity
    let isIncreasing = false;
    //Set interval to somewhere within a range
    const MIN = .01;//slowest
    const MAX = .20;//fastest
    let numberAsInteger = generateRand(MIN * 100 - 1, MAX * 100);
    let interval = numberAsInteger / 100;
    
    var timer = setInterval(function () {
        if (op <= 0.1)
            isIncreasing = true;
        else if(op > 1)
            isIncreasing = false;
            
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        if(isIncreasing === false)
            op -= op * interval;
        else
            op += op * interval;
    }, 50);
}