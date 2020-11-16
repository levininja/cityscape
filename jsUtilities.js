
//Note: min is exclusive, max is inclusive.
function generateRand(min, max){
    //First get number between 0 and delta, where delta is the diff between min and max.
    let delta = max - min;
    let num = Math.ceil(Math.random() * delta);
    //Then adjust number to fit the scale given, if the min is not 0.
    num += min;
    return num;
}
function createArray(length) {
    let arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        let args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}