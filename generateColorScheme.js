
function generateColorScheme(){

    const redDarkMaroon = '#a00';
    const blueDarkIndigo = '#00a';
    const greenDark = '#0a0';
    const orangeDarkBurnt = '#c50';
    const purpleDarkDeep = '#50a';

    const orangeMedium = '#f80';
    const purpleMediumFuschia = '#a05';
    const greenMediumSea = '#0c6';
    const blueMediumSea = '#06c';

    const yellowBrightGold = '#dc0';
    const blueBrightCyan = '#0dd';
    const blueBrightBaby = '#0ad';
    const blueBrightTeal = '#0da';
    const purpleBrightFuschia = '#a0a';

    const yellowFull = '#ff1';
    const greenFullLime = '#5f0';
    const purpleFullMagenta = '#f0c';
    const cyanFull = '#0ff';
    const blueFullIndigo = '#20e';
    const redFull = '#f10';

    const white = '#fff';
    const whiteFull = '#fff';

    const sunPink = "#f2d";
    const sunPurple = "#a0f";
    const sunBlueDark = "#00d";
    const sunBlueFull = "#00f";
    const sunOrangeDeep = "#f70";
    const sunOrangeBright = "#fa0";
    const sunRedRed = "#f00";
    const sunYellow = "#ff0";
    const sunGreen = "#0c0";
    const sunCyan = "#0dd";
    
    let color1, color2, color3, color4, bgColor, sunColor;
    
    const colorScheme = generateRand(0, 21);
    switch(colorScheme){
        case 1: 
            color1 = purpleFullMagenta;
            color2 = greenFullLime;
            color3 = cyanFull;
            color4 = blueFullIndigo;
            bgColor = 'pastel-pink';
            sunColor = white;
            break;
        case 2: 
            color1 = purpleFullMagenta;
            color2 = purpleBrightFuschia;
            color3 = blueFullIndigo;
            color4 = greenFullLime;
            bgColor = 'pastel-yellow';
            sunColor = sunPurple;
            break;
        case 3: 
            color1 = redFull;
            color2 = orangeMedium;
            color3 = yellowFull;
            color4 = orangeMedium;
            bgColor = 'pastel-orange';
            sunColor = sunRedRed;
            break;
        case 4: 
            color1 = redFull;
            color2 = purpleBrightFuschia;
            color3 = cyanFull;
            color4 = blueFullIndigo;
            bgColor = 'pastel-blue';
            sunColor = sunBlueDark;
            break;
        case 5: 
            color1 = greenFullLime;
            color2 = greenFullLime;
            color3 = redFull;
            color4 = redFull;
            bgColor = 'pastel-green';
            sunColor = white;
            break;
        case 6: 
            color1 = greenFullLime;
            color2 = greenFullLime;
            color3 = greenFullLime;
            color4 = greenFullLime;
            bgColor = 'deep-green';
            sunColor = white;
            break;
        case 7: 
            color1 = purpleFullMagenta;
            color2 = purpleFullMagenta;
            color3 = purpleFullMagenta;
            color4 = purpleFullMagenta;
            bgColor = 'pastel-yellow';
            sunColor = sunPink;
            break;
        case 8: 
            color1 = cyanFull;
            color2 = cyanFull;
            color3 = cyanFull;
            color4 = cyanFull;
            bgColor = 'pastel-blue';
            sunColor = sunBlueFull;
            break;
        case 9: 
            color1 = cyanFull;
            color2 = cyanFull;
            color3 = purpleBrightFuschia;
            color4 = purpleBrightFuschia;
            bgColor = 'pastel-purple';
            sunColor = white;
            break;
        case 10: 
            color1 = cyanFull;
            color2 = cyanFull;
            color3 = purpleFullMagenta;
            color4 = yellowFull;
            bgColor = 'pastel-blue';
            sunColor = white;
            break;
        case 11: 
            color1 = greenFullLime;
            color2 = yellowFull;
            color3 = purpleBrightFuschia;
            color4 = purpleFullMagenta;
            bgColor = 'pastel-pink';
            sunColor = sunGreen;
            break;
        case 12: 
            color1 = purpleBrightFuschia;
            color2 = purpleBrightFuschia;
            color3 = yellowFull;
            color4 = yellowFull;
            bgColor = 'deep-pink';
            sunColor = sunYellow;
            break;
        case 13: 
            color1 = whiteFull;
            color2 = whiteFull;
            color3 = cyanFull;
            color4 = blueFullIndigo;
            bgColor = 'deep-orange';
            sunColor = sunCyan;
            break;
        case 14: 
            color1 = redDarkMaroon;
            color2 = blueDarkIndigo;
            color3 = greenDark;
            color4 = purpleDarkDeep;
            bgColor = 'pastel-red';
            sunColor = white;
            break;
        case 15: 
            color1 = orangeMedium;
            color2 = blueBrightBaby;
            color3 = orangeMedium;
            color4 = whiteFull;
            bgColor = 'pastel-orange';
            sunColor = white;
            break;
        case 16: 
            color1 = purpleMediumFuschia;
            color2 = purpleBrightFuschia;
            color3 = purpleFullMagenta;
            color4 = yellowBrightGold;
            bgColor = 'deep-yellow';
            sunColor = white;
            break;
        case 17: 
            color1 = purpleMediumFuschia;
            color2 = purpleBrightFuschia;
            color3 = blueFullIndigo;
            color4 = blueDarkIndigo;
            bgColor = 'deep-fuschia';
            sunColor = white;
            break;
        case 18: 
            color1 = yellowFull;
            color2 = greenFullLime;
            color3 = purpleFullMagenta;
            color4 = cyanFull;
            bgColor = 'pastel-pink';
            sunColor = sunPurple;
            break;
        case 19: 
            color1 = orangeMedium;
            color2 = greenMediumSea;
            color3 = blueBrightCyan;
            color4 = blueBrightTeal;
            bgColor = 'pastel-blue';
            sunColor = white;
            break;
        case 20: 
            color1 = blueMediumSea;
            color2 = orangeDarkBurnt;
            color3 = yellowBrightGold;
            color4 = blueMediumSea;
            bgColor = 'pastel-blue';
            sunColor = sunOrangeBright;
            break;
        case 21: 
            color1 = redDarkMaroon;
            color2 = blueDarkIndigo;
            color3 = purpleBrightFuschia;
            color4 = blueFullIndigo;
            bgColor = 'pastel-red';
            sunColor = white;
            break;
    }
    return {
        colorScheme: colorScheme,
        color1: color1,
        color2: color2,
        color3: color3,
        color4: color4,
        bgColor: bgColor,
        sunColor: sunColor
    };
}