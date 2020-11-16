

function placeArtifacts(surfaces, numberOfArtifactsToAttempt, grid, minHorSurfaceLength, minVerSurfaceLength){
    //Determines the percentage of artifacts that will be vertical (vs horizontal)
    const verticalModulus = 2; // 1 = 100% vert, 2 = 50% vert, 3 = 33% vert...etc.

    for(let i = 0; i < numberOfArtifactsToAttempt; i++){
        if(i % verticalModulus === 0){
            // Try a vertical artifact placement
            // Find a surface to put the vertical artifact on.
            let index = generateRand(-1, surfaces.verticalSurfaces.length - 1);
            let verticalSurface = surfaces.verticalSurfaces[index];

            // Determine if this would be off the left side of a building or the right.
            let sideOfBuilding = verticalSurface.length > 0 ? "left" : "right";

            const j = generateRand(-1, 1);
            if(j === 0)
                attemptCreateHornArtifact(grid, sideOfBuilding, verticalSurface);
            else if(j === 1){
                const lineWidth = 4;
                //Every once in a while do a lot of them, if there is room.
                const proposed_numOfHorLines = generateRand(10, 20);
                const proposed_yStartPercentStart = generateRand(5, 20);
                const proposed_yInterval = 4;
                // The length needed in order for the horizontal artifacts to not go off of the building.
                const minLenForLotsOfHorArtifacts = (verticalSurface.length * proposed_yStartPercentStart / 100)
                    + (proposed_yInterval + lineWidth) * proposed_numOfHorLines;

                let ps; // parameters for lines
                switch(generateRand(-1, 3)){
                    case 3:
                        if(verticalSurface.length >= minLenForLotsOfHorArtifacts)
                            ps = assignParamsForManyHorLines(proposed_numOfHorLines, proposed_yStartPercentStart,
                                proposed_yInterval);
                        else
                            ps = assignParamsForFewHorLines();
                        break;
                    case 2:
                    case 1:
                    case 0:
                    default:
                        ps = assignParamsForFewHorLines();
                        break;

                }

                for(let k = 0; k < ps.numOfHorLines; k++){
                    let yStartPercent = (ps.yStartPercentStart + k * ps.yInterval) / 100;
                    attemptCreateHorLineArtifact(grid, sideOfBuilding, verticalSurface, ps.lineLength, yStartPercent,
                        lineWidth);
                }
            }
        }
        else{
            // Try a horizontal artifact placement
            // Find a surface to put the horizontal artifact on.
            let index = null;

            const findHorizontalSurface = function(){
                let horizontalSurface = null;
                // Try to find a horizontal surface that is high up.
                for(let i = 0; i < 5; i++){
                    index = generateRand(-1, surfaces.horizontalSurfaces.length - 1);
                    horizontalSurface = surfaces.horizontalSurfaces[index];
                    if(horizontalSurface.startCoord.y > grid[0].length / 2)
                        break;
                }
                return horizontalSurface;
            }

            let horizontalSurface = findHorizontalSurface();

            const landingPadWidth = 30;
            if(horizontalSurface !== null){
                switch(generateRand(-1, 7)){
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        createVertLineArtifact(horizontalSurface, grid);
                        break;
                    case 5:
                        createTriangleRoofArtifact(horizontalSurface, grid);
                        break;
                    case 6:
                        createLeggyRoofArtifact(horizontalSurface, grid);
                        break;
                    case 7:
                        let horizontalSurface2 = findHorizontalSurface();
                        if(horizontalSurface2 !== null && horizontalSurface.length >= landingPadWidth
                            && horizontalSurface2.length >= landingPadWidth)
                        {
                            createLandingPads(horizontalSurface, horizontalSurface2, grid, landingPadWidth);
                        }
                        break;

                }
            }
        }
    }
}
// Note: assumes that the two horizontal surfaces are different and not the same.
function createLandingPads(horizontalSurface1, horizontalSurface2, grid, width){
    const baseHeight = 3;
    const sidesHeight = 2;
    const sidesWidth = 4;//width of each side
    const height = baseHeight + sidesHeight;
    if(horizontalSurface1.startCoord.y + height < grid[0].length - 1 && 
        horizontalSurface2.startCoord.y + height < grid[0].length - 1)
    {
        let horizontalSurface = horizontalSurface1;
        // Create two landing pads on different horizontal surfaces.
        for(let i = 0; i < 2; i++){
            const horSurfaceMidpoint = Math.round(horizontalSurface.startCoord.x + horizontalSurface.length / 2);
            const startX = horSurfaceMidpoint - width / 2;
            const endX = horSurfaceMidpoint + width / 2;
            const startY = horizontalSurface.startCoord.y - 1;
            // Draw the base
            for(let y = startY; y < startY + baseHeight; y++){
                for(let x = startX; x < startX + width; x++){
                    createArtifactPixel(grid, x, y);
                }
            }
            // Draw the sides
            for(let y = startY + baseHeight; y < startY + height; y++){
                // Left side
                for(let x = startX; x < startX + sidesWidth; x++){
                    createArtifactPixel(grid, x, y);
                }
                // Right side
                for(let x = endX - 1; x > endX - sidesWidth - 1; x--){
                    createArtifactPixel(grid, x, y);
                }
            }

            horizontalSurface = horizontalSurface2;
        }
    }
}
function tallTriangleCanBeSupported(proposedTriangleHeight, horizontalSurface, grid){
    return proposedTriangleHeight + horizontalSurface.startCoord.y + 1 < grid[0].length;
}
//horizontalSurface{ startCoord, length} 
//grid[x][y]
function createLeggyRoofArtifact(horizontalSurface, grid){
    const width = 8;
    const startXDelta = generateRand(10, 30);//distance from roof edge
    const startX = horizontalSurface.startCoord.x + startXDelta;
    const endX = horizontalSurface.startCoord.x + startXDelta + width;
    const startY = horizontalSurface.startCoord.y - 1;

    const chanceOfRaisedLeftArm = generateRand(0,8);
    const leftArmIsRaised = chanceOfRaisedLeftArm === 1;
    const chanceOfRaisedRightArm = generateRand(0,8);
    const rightArmIsRaised = chanceOfRaisedRightArm === 1;

    if(startXDelta + width < horizontalSurface.length - 1){
        // Create legs
        const legsHeight = 6;
        let i = 0;
        for(let y = startY; y < startY + legsHeight; y++){
            let leftLegX = startX + Math.floor(i / 2);
            let rightLegX = endX - Math.floor(i / 2);
            createArtifactPixel(grid, leftLegX, y);
            createArtifactPixel(grid, rightLegX, y);
            i++;
        }
        // Create body
        const bodyHeight = 22;
        const startBodyY = startY + legsHeight;
        const firstBodyY = startBodyY;
        const secondBodyY = startBodyY + 1;
        const lastBodyY = startBodyY + bodyHeight;
        const secondToLastBodyY = lastBodyY - 1;
        const neckY1 = Math.floor(lastBodyY - bodyHeight / 3);
        const neckY2 = neckY1 - 1;
        for(let y = startBodyY; y < startBodyY + bodyHeight; y++){
            if(y === firstBodyY || y === lastBodyY || y == neckY1 || y == neckY2){
                for(let x = startX + 2; x < endX - 2; x++){
                    createArtifactPixel(grid, x, y);
                }
            }
            else if(y === secondBodyY || y === secondToLastBodyY){
                for(let x = startX + 1; x < endX - 1; x++){
                    createArtifactPixel(grid, x, y);
                }
            }
            else{
                for(let x = startX; x < endX; x++){
                    createArtifactPixel(grid, x, y);
                }
            }
        }
        // Create arms
        const armsWidth = 2;
        const armpitsWidth = 1;
        const armsLength = 8;
        const armsTopY = neckY2 - 2;
        const armsBottomY = armsTopY - armsLength;
        const armsTopYIfArmRaised = armsTopY + armsLength;
        const armsBottomYIfArmRaised = armsTopY - armsWidth;
        const leftArmStartX = startX - 1;
        const rightArmStartX = endX;
        // Left Arm
        if(leftArmIsRaised){
            for(let y = armsBottomYIfArmRaised; y < armsTopYIfArmRaised; y++){
                if(y <= armsBottomYIfArmRaised + armsWidth)
                    for(let x = leftArmStartX; x > leftArmStartX - (armsWidth + armpitsWidth); x--)
                        createArtifactPixel(grid, x, y);
                else
                    for(let x = leftArmStartX - armpitsWidth; x > leftArmStartX - (armsWidth + armpitsWidth); x--)
                        createArtifactPixel(grid, x, y);
            }
        }
        else{
            for(let y = armsTopY; y > armsBottomY; y--){
                if(y >= armsTopY - armsWidth)
                    for(let x = leftArmStartX; x > leftArmStartX - (armsWidth + armpitsWidth); x--)
                        createArtifactPixel(grid, x, y);
                else
                    for(let x = leftArmStartX - armpitsWidth; x > leftArmStartX - (armsWidth + armpitsWidth); x--)
                        createArtifactPixel(grid, x, y);
            }
        }
        // Right Arm
        if(rightArmIsRaised){
            for(let y = armsBottomYIfArmRaised; y < armsTopYIfArmRaised; y++){
                if(y <= armsBottomYIfArmRaised + armsWidth)
                    for(let x = rightArmStartX; x < rightArmStartX + (armsWidth + armpitsWidth); x++)
                        createArtifactPixel(grid, x, y);
                else
                    for(let x = rightArmStartX + armpitsWidth; x < rightArmStartX + (armsWidth + armpitsWidth); x++)
                        createArtifactPixel(grid, x, y);
            }
        }
        else{
            for(let y = armsTopY; y > armsBottomY; y--){
                if(y >= armsTopY - armsWidth)
                    for(let x = rightArmStartX; x < rightArmStartX + (armsWidth + armpitsWidth); x++)
                        createArtifactPixel(grid, x, y);
                else
                    for(let x = rightArmStartX + armpitsWidth; x < rightArmStartX + (armsWidth + armpitsWidth); x++)
                        createArtifactPixel(grid, x, y);
            }
        }
        // Create eyes
        const midPointX = startX + width / 2;
        const leftEyeX = Math.round(midPointX - 2);
        const rightEyeX = Math.round(midPointX + 2);
        const eyesY = grid[0].length - (lastBodyY - 4);
        createLightAtCoord(leftEyeX, eyesY, 1, "#0f0", true, true);
        createLightAtCoord(rightEyeX, eyesY, 1, "#0f0", true, true);
    }
}
//horizontalSurface{ startCoord, length} 
//grid[x][y]
function createTriangleRoofArtifact(horizontalSurface, grid){
    const leftOrRight = generateRand(-1, 1) === 0 ? "left" : "right";
    const startY = horizontalSurface.startCoord.y - 1;
    // Number 2, 3, or 4 to represent angle of the triangle roof.
    // 2 means 45 degree angle. 3 means 30 degree angle. 4 means 22.5 degree angle.
    let angleDivisor = generateRand(4, 6);
    // Note: "layer" means a layer one pixel high. We are going to build the triangle from the roof of
    // the building upwards, one layer at a time.
    const baseLength = horizontalSurface.length;
    
    let triangleHeight;
    if(tallTriangleCanBeSupported((baseLength * angleDivisor), horizontalSurface, grid))
        triangleHeight = baseLength * angleDivisor;
    else
        triangleHeight = baseLength / angleDivisor;

    const howManyPixelsToSubtractByEachTime = baseLength / triangleHeight;

    let i = 1;
    for(let y = startY; y <= startY + triangleHeight && y < grid[0].length - 1; y++){
        let lengthOfThisLine = baseLength - i * howManyPixelsToSubtractByEachTime;
        if(leftOrRight === 'left'){
            const startX = horizontalSurface.startCoord.x;
            for(let x = startX; x <= startX + lengthOfThisLine && x <= grid.length - 1; x++)
                createArtifactPixel(grid, x, y);
        }
        else{
            const startX = horizontalSurface.startCoord.x + horizontalSurface.length;
            for(let x = startX; x >= startX - lengthOfThisLine && x >= 0; x--)
                createArtifactPixel(grid, x, y);
        }
        i++;
    }
}
function assignParamsForManyHorLines(proposed_numOfHorLines, proposed_yStartPercentStart, proposed_yInterval){
    return {
        numOfHorLines: proposed_numOfHorLines,
        lineLength: generateRand(2, 5),
        yStartPercentStart: proposed_yStartPercentStart,
        yInterval: proposed_yInterval
    };
}
function assignParamsForFewHorLines(){
    const shortOrLong = generateRand(0, 2) === 1 ? "short" : "long";
    return {
        numOfHorLines: generateRand(0, 3),
        lineLength: shortOrLong === "short" ? generateRand(5, 8) : generateRand(13, 16),
        yStartPercentStart: generateRand(10, 30),
        yInterval: generateRand(5, 12)
    };
}

function createVertLineArtifact(horizontalSurface, grid){
    // Determine aspects of the vertical line
    const lineWidth = 2;
    const lineHeight = generateRand(5, 20);
    const xStartPercent = generateRand(20, 80) / 100;
    const xStart = Math.round(horizontalSurface.startCoord.x + horizontalSurface.length * xStartPercent);

    // Draw the vertical line.
    for(let x = xStart; x < xStart + lineWidth; x++){
        for(let y = horizontalSurface.startCoord.y - 1; y < horizontalSurface.startCoord.y + lineHeight; y++)
        {
            if(y < grid[0].length - 1)
                createArtifactPixel(grid, x, y);
        }
    }
}
function attemptCreateHorLineArtifact(grid, sideOfBuilding, verticalSurface, lineLength, yStartPercent, lineWidth){
    // Determine aspects of the horizontal line
    const yStart = Math.round(verticalSurface.startCoord.y + verticalSurface.length * yStartPercent);

    // Draw the horizontal line.
    if(sideOfBuilding === 'left'){
        for(let x = verticalSurface.startCoord.x; x > verticalSurface.startCoord.x - lineLength; x--){
            for(let y = yStart; y < yStart + lineWidth; y++){
                createArtifactPixel(grid, x, y);
            }
        }
    }
    else if(sideOfBuilding === 'right'){
        for(let x = verticalSurface.startCoord.x; x < verticalSurface.startCoord.x + lineLength; x++){
            for(let y = yStart; y < yStart + lineWidth; y++){
                createArtifactPixel(grid, x, y);
            }
        }
    }
}

function attemptCreateHornArtifact(grid, sideOfBuilding, verticalSurface){
    let widthOfHorn = generateRand(5, 7);
    let widthOfArm = generateRand(5, 10);//part before the horn
    let totalWidth = widthOfArm + widthOfHorn;
    let height = generateRand(20, 80);
    let heightOfArm = generateRand(5,7);

    let totalWidthPlusMargin = totalWidth + 2;
    let heightPlusMargin = height + 2;

    // First, ensure there is enough open space to fit this without hitting a building
    // or going off screen.
    let startOfHornPercent = generateRand(40, 80);
    let startOfHorn =
        verticalSurface.startCoord.y + Math.round(verticalSurface.length * startOfHornPercent / 100);
    
    let coord = {
        x: verticalSurface.startCoord.x,
        y: startOfHorn
    };

    let isThereProblem = false;
    if(sideOfBuilding === "left"){
        //Go one pixel to the left, one at a time...
        for(let x = coord.x; x >= coord.x - totalWidthPlusMargin; x--){
            if(x < 0){
                isThereProblem = true;
                break;
            }
            //Go one pixel up, one at a time...
            for(let y = coord.y; y <= coord.y + heightPlusMargin; y++){
                if(y >= grid[0].length - 1 || grid[x][y] === true)
                {
                    isThereProblem = true;
                    break;
                }
            }
            if(isThereProblem)
                break;
        }
    }
    else if(sideOfBuilding === "right"){
        //Go one pixel to the right, one at a time...
        for(let x = coord.x; x <= coord.x + totalWidthPlusMargin; x++){
            if(x >= grid.length - 1){
                isThereProblem = true;
                break;
            }
            //Go one pixel up, one at a time...
            for(let y = coord.y; y <= coord.y + heightPlusMargin; y++){
                if(y >= grid[0].length - 1 || grid[x][y] === true)
                {
                    isThereProblem = true;
                    break;
                }
            }
            if(isThereProblem)
                break;
        }
    }
    
    // Now, if we reached the end without problem, create the artifact.
    if(!isThereProblem){
        createHornArtifact(grid, sideOfBuilding, coord, widthOfHorn, widthOfArm, heightOfArm, height);
    }
}

function createHornArtifact(grid, sideOfBuilding, coord, widthOfHorn, widthOfArm, heightOfArm, height){
    let startX = coord.x;
    let startY = coord.y;
    let startHornX = sideOfBuilding === 'left' ? startX - widthOfArm : startX + widthOfArm;
    let endX = sideOfBuilding === 'left' ? startX - widthOfArm - widthOfHorn 
        : startX + widthOfArm + widthOfHorn;
    let endArmY = coord.y + heightOfArm;
    let endY = coord.y + height;

    if(sideOfBuilding === 'left'){
        for(let x = startX; x > startHornX; x--){
            for(let y = startY; y < endArmY; y++){
                createArtifactPixel(grid, x, y);
            }
        }
        for(let x = startHornX; x > endX; x--){
            for(let y = startY; y < endY; y++){
                createArtifactPixel(grid, x, y);
            }
        }
    }
    else if(sideOfBuilding === 'right'){
        for(let x = startX; x < startHornX; x++){
            for(let y = startY; y < endArmY; y++){
                createArtifactPixel(grid, x, y);
            }
        }
        for(let x = startHornX; x < endX; x++){
            for(let y = startY; y < endY; y++){
                createArtifactPixel(grid, x, y);
            }
        }
    }
}

function createArtifactPixel(grid, x, y){
    grid[x][y] = true;

    let cityscape = document.getElementById('cityscape');
    let pixel = document.createElement('div');
    pixel.classList.add("artifact");
    
    pixel.style.left = x;
    pixel.style.top = grid[0].length - y;
    cityscape.appendChild(pixel);
}
