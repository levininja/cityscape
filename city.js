
//import {createLight} from './createLight.js';

//x is at left of grid
//y is at bottom of grid

window.addEventListener('load', function () {

    var docHeight = document.body.clientHeight;
    var docWidth = document.body.clientWidth;
    let margin = 5;

    let bottomAreaHeight = 70;

    const numberOfAttemptedLights = 1000;
    const minLightSize = 1;
    const maxLightSize = 3;
    const percentOfLightsThatAreStatic = 15;//0-100

    //Builds batch 1
    const numberOfBuildings = 30;
    const minBldgWidthPercent = 1;
    const maxBldgWidthPercent = 5;
    const minBldgHeightPercent = 40;
    const maxBldgHeightPercent = 85;

    //Builds batch 2
    const numberOfBuildings2 = 15;
    const minBldgWidthPercent2 = 8;
    const maxBldgWidthPercent2 = 15;
    const minBldgHeightPercent2 = 10;
    const maxBldgHeightPercent2 = 40;

    const numberOfArtifactsToAttempt = 15;

    //Set bottom element
    let bottom = document.getElementById('bottom');
    bottom.style.width = docWidth + "px";
    bottom.style.height = bottomAreaHeight + "px";

    // Generate the buildings and the grid that represents where the buildings are in a 2D array
    const maxX = docWidth;
    const maxY = docHeight - bottomAreaHeight;
    const grid = createArray(maxX, maxY);
    for(let x = 0; x < grid.length; x++){
        for(let y = 0; y < grid[x].length; y++){
            grid[x][y] = false;
        }
    }
    generateBuildings(grid, margin, maxY, maxX, numberOfBuildings, maxLightSize,
        minBldgWidthPercent, maxBldgWidthPercent, minBldgHeightPercent, maxBldgHeightPercent);
    generateBuildings(grid, margin, maxY, maxX, numberOfBuildings2, maxLightSize,
        minBldgWidthPercent2, maxBldgWidthPercent2, minBldgHeightPercent2, maxBldgHeightPercent2);

    // Identify areas to add artifacts to the buildings' sides and roofs.
    const minHorSurfaceLength = 20;
    const minVerSurfaceLength = 80;
    const surfaces = identifyArtifactPlacements(grid, minHorSurfaceLength, minVerSurfaceLength);
    placeArtifacts(surfaces, numberOfArtifactsToAttempt, grid, minHorSurfaceLength, minVerSurfaceLength);
    
    // Create lights that only go into that 2D array
    const colorScheme = generateColorScheme();
    for(let x = 0; x < numberOfAttemptedLights; x ++){
        let remainder = x % 100;
        const lightIsStatic = remainder < percentOfLightsThatAreStatic;
        createLight(margin, docHeight - bottomAreaHeight, docWidth, grid, 
            minLightSize, maxLightSize, lightIsStatic, 
            colorScheme, 4);
    }
    // Apply bg color
    let everything = document.getElementById('everything');
    everything.style.height = docHeight;
    everything.classList.add(colorScheme.bgColor);
    // Apply sun color and size
    let sun = document.getElementById('sun');
    if(sun !== undefined){
        let sunSizePercent = generateRand(45, 80);
        let sunSize = docWidth * sunSizePercent / 100;
        let sunMarginPercent = generateRand(10,40);
        let sunMargin = docHeight * sunMarginPercent / 100;
        sun.style.width = sunSize;
        sun.style.height = sunSize;
        sun.style.borderRadius = sunSize + "px";
        sun.style.transform = `translateY(${sunMargin}px)`;
        sun.style.backgroundColor = colorScheme.sunColor;
    }

    // If in debug mode, print the color scheme number
    //console.log("colorScheme: " + colorScheme.colorScheme);
})

function identifyArtifactPlacements(grid, minHorSurfaceLength, minVerSurfaceLength)
{
    // Start on the left side. Find the rooftop there by starting at the bottom-left-most pixel
    // and going up, 1 pixel at a time, till finding the roof of the left-most building.
    // NOTE: this assumes that there is a left-most building.
    let coord = {
        x: 0,
        y: 0
    };
    for(let y = 0; y < grid[0].length; y++){
        let pixel = grid[0][y];
        if(pixel === false){
            coord = {
                x: 0,
                y: y
            };
            break;
        }
    }
    
    // Go until reaching a corner. Then record the surface, turn the corner, and repeat.
    let direction = "right";//can be "up", "down", or "right".
    let surfaces = {
        horizontalSurfaces: [],
        verticalSurfaces: []
    };
    traverseCityScape(grid, surfaces, direction, coord);

    // Discard any surfaces less than a certain length.
    let newHorizontalSurfaces = [];
    surfaces.horizontalSurfaces.forEach(s => {
        if(s.length >= minHorSurfaceLength)
            newHorizontalSurfaces.push(s);
    });
    let newVerticalSurfaces = [];
    surfaces.verticalSurfaces.forEach(s => {
        if(Math.abs(s.length) >= minVerSurfaceLength)
            newVerticalSurfaces.push(s);
    });

    return {
        horizontalSurfaces: newHorizontalSurfaces,
        verticalSurfaces: newVerticalSurfaces,
    };
}

// Recursive function to piece together all the surfaces of the buildings.
// Go until reaching a corner. Then record the surface, turn the corner, and repeat.
// direction: can be "up", "down", or "right".
function traverseCityScape(grid, surfaces, direction, coord){
    // Go until reaching a corner.
    let foundEndOfSegment = false;
    let y = undefined;
    let nextCoord = undefined;
    switch(direction){
        case "right":
            let x = coord.x;
            while(!foundEndOfSegment){
                if(x === grid.length){
                    // We have reached the end of the screen. Return.
                    return;
                }
                nextCoord = grid[x + 1][coord.y];
                let coordBeneathNextCoord = grid[x + 1][coord.y - 1];
                if(nextCoord === true){
                    // We have reached a new building that goes taller than this one.
                    // Therefore we need to record this segment, and turn the corner up.
                    foundEndOfSegment = true;
                    surfaces.horizontalSurfaces.push({
                        startCoord: { x: coord.x, y: coord.y },
                        length: 1 + x - coord.x
                    });
                    traverseCityScape(grid, surfaces, "up", { x: x, y: coord.y });
                }
                else if(coordBeneathNextCoord === false){
                    // We have reached the end of this building's roof.
                    // Therefore we need to record this segment, and turn the corner down.
                    foundEndOfSegment = true;
                    surfaces.horizontalSurfaces.push({
                        startCoord: { x: coord.x, y: coord.y },
                        length: 1 + x - coord.x
                    });
                    traverseCityScape(grid, surfaces, "down", { x: x + 1, y: coord.y - 1 });
                }
                else{
                    // The next coord is empty and the coord beneath it is full. So we are still
                    // on the roof of this building. Therefore continue.
                    x++;
                }
            }
            break;
        case "up":
            y = coord.y;
            while(!foundEndOfSegment){
                nextCoord = grid[coord.x][y + 1];
                let coordRightOfNextCoord = grid[coord.x + 1][y + 1];
                if(coordRightOfNextCoord === false){
                    // We have reached the top of this building.
                    // Therefore we need to record this segment, and turn the corner right.
                    foundEndOfSegment = true;
                    surfaces.verticalSurfaces.push({
                        startCoord: { x: coord.x, y: coord.y },//the y is wrong. should be 89, but is 335.
                        length: 1 + y - coord.y
                    });
                    traverseCityScape(grid, surfaces, "right", { x: coord.x + 1, y: y + 1 });
                }
                else{
                    // The coord right of next coord is full, so that means the building is continuing up.
                    // Therefore continue.
                    // Note: this assumes that no building reaches the very top of the screen.
                    y++; 
                }
            }
            break;
        case "down":
            y = coord.y;
            while(!foundEndOfSegment){
                if(y === 0){
                    // We have reached the bottom of the building at ground level.
                    // Therefore record this segment, and then skim along the ground to the next building,
                    // and pick up going up there.
                    foundEndOfSegment = true;
                    surfaces.verticalSurfaces.push({
                        startCoord: { x: coord.x, y: coord.y },
                        length: -1 * (1 + coord.y - y) // in this case, negative to indicate down direction
                    });
                    let groundX = coord.x + 1;
                    let groundHasEnded = false;
                    let screenHasEnded = false;
                    while(!groundHasEnded){
                        if(groundX === grid.length)
                        {
                            // We have reached the end of the screen.
                            groundHasEnded = true;
                            screenHasEnded = true;
                        }
                        else{
                            nextCoordRight = grid[groundX][0];
                            if(nextCoordRight === true)
                                // We have reached a building. 
                                // Therefore we are done being at ground level, and can go up the new building.
                                groundHasEnded = true;
                            else
                                groundX++;
                        }
                    }
                    if(screenHasEnded)
                        return;
                    else
                        traverseCityScape(grid, surfaces, "up", { x: groundX - 1, y: 0 });
                }
                else{
                    nextCoord = grid[coord.x][y - 1];
                    if(nextCoord === true){
                        // We have reached the corner of a new building meeting this building's right side.
                        // Therefore we need to record this segment, and turn the corner right.
                        foundEndOfSegment = true;
                        surfaces.verticalSurfaces.push({
                            startCoord: { x: coord.x, y: coord.y },
                            length: y - 1 - coord.y
                        });
                        traverseCityScape(grid, surfaces, "right", { x: coord.x, y: y });
                    }
                    else{
                        // The next coordinate is empty. We have not reached the bottom of this building.
                        // Therefore continue.
                        y--;
                    }
                }
            }
            break;
    }
}

function generateBuildings(grid, margin, maxY, maxX, numberOfBuildings, maxLightSize,
    minBldgWidthPercent, maxBldgWidthPercent, minBldgHeightPercent, maxBldgHeightPercent)
{
    let buildings = [];

    //Each building has a height and a width.
    //The height can't be more than a certain percentage of the total. Same for width.
    for(let i = 0; i < numberOfBuildings; i++)
    {
        //Pick a height and width.
        let heightPercentage = generateRand(minBldgHeightPercent, maxBldgHeightPercent);
        let height = maxY * heightPercentage / 100;

        let widthPercentage = generateRand(minBldgWidthPercent, maxBldgWidthPercent);
        let width = maxX * widthPercentage / 100;

        //Now try to fit that into the grid.
        const numberOfTries = 5;
        const xMargin = 20;
        let wasSuccessful = false;
        for(let j = 0; j < numberOfTries; j++)
        {
            if(wasSuccessful === false){
                //Pick an x coordinate at random from which to start the building.
                //There's no point in picking one right at the beginning or end, and it can't
                //be so close to the end that the building overflows off the edge of the screen.
                let xCoord = 0;//The very first building will be all the way on the left.
                if(i > 0 && i < numberOfBuildings - 1)//buildings in middle are picked random.
                    xCoord = generateRand(xMargin, maxX - xMargin - width);
                if(i === numberOfBuildings - 1)//last building is close to the end
                    xCoord = Math.round(maxX - xMargin - width - 1);

                //Determine if the building will validly fit given that xCoord.
                wasSuccessful = true;//TODO
                //If it fits, then end loop and create building.
                if(wasSuccessful){
                    let building = {
                        Height: height,
                        Width: width,
                        XCoord: xCoord,
                    };
                    buildings.push(building);

                    createBuildingDiv(building, margin, maxX, maxY, maxLightSize);

                    addToGrid(building, grid);

                    //End loop as we have now been successful.
                    break;
                }
            }
        }
    }
}
function createBuildingDiv(building, margin, maxX, maxY, maxLightSize){
    let cityscape = document.getElementById('cityscape');
    let buildingDiv = document.createElement('div');
    buildingDiv.classList.add("building");

    buildingDiv.style.width = building.Width + maxLightSize + "px";
    buildingDiv.style.height = building.Height + maxLightSize + "px";
    buildingDiv.style.left = building.XCoord;
    buildingDiv.style.top = maxY - building.Height;
    
    cityscape.appendChild(buildingDiv);
}
function addToGrid(building, grid)
{
    //the grid is x long to represent the x pixels wide.
    //each element in the grid is an array y long to represent the y pixels high.

    //Start at the x coordinate.
    for(let x = building.XCoord; x < building.XCoord + building.Width + 1; x++)
    {
        //This is a vertical strip of the building, 1 pixel wide, and y pixels high.
        for(let y = 0; y < building.Height + 1; y++)
        {
            // This is a single pixel in the strip. Add it to the grid.
            grid[x][y] = true;
        }
    }
}
function pickRandomColor(color1, color2, color3, color4, NUMBER_OF_COLORS){
    let num = generateRand(0, NUMBER_OF_COLORS);
    let color = '';
    switch(num){
        case 1:
            color = color1;
            break;
        case 2:
            color = color2;
            break;
        case 3:
            color = color3;
            break;
        case 4:
            color = color4;
            break;
    }
    return color;
}
