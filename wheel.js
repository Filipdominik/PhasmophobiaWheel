function generateWheel(ghosts) {
    const WheelContainer = document.querySelector('.wheel');
    const canvas = WheelContainer.children[0];
    canvas.width = WheelContainer.offsetWidth;
    canvas.height = WheelContainer.offsetHeight;
    const ctx = canvas.getContext("2d");
    const ghostColors = loadGhostTypes();
    let segmentSize = (2 * Math.PI) * 1 / ghosts.length;
    ghosts.forEach((ghostName) => {
        console.log(ghostColors[ghostName]['color']);
        let iteration = ghosts.indexOf(ghostName); //checks which segment is currently being drawn as a number, used for further calculations of coordinates and correct rotation.
        ctx.beginPath();
        ctx.fillStyle = ghostColors[ghostName]['color']; //selects the corresponding ghost color as the fill color
        ctx.arc(250, 250, 200, segmentSize * iteration, segmentSize * (iteration + 1)); //draws an arc, from the outter point

        ctx.moveTo(250, 250); //move to center to draw the inner triangle
        let first_corner = CalculateCoordinates(segmentSize * iteration, 200, [250, 250]);
        let second_corner = CalculateCoordinates(segmentSize * (iteration + 1), 200, [250, 250]);
        ctx.lineTo(first_corner[0], first_corner[1]);
        ctx.lineTo(second_corner[0], second_corner[1]);
        ctx.fill();

        let piValueInBetween = ((segmentSize * iteration) + (segmentSize * (iteration + 1))) / 2; //Calculates the point on the circle which is the center of the segment
        let [x, y] = CalculateCoordinates(piValueInBetween, 100, [250, 250]); //Calculates the center of the segment

        //draw text
        ctx.save();
        ctx.fillStyle = ghostColors[ghostName]['text_color'];
        ctx.textAlign = 'center';
        ctx.font = '30px Signika Negative';
        ctx.translate(x, y);
        ctx.rotate(piValueInBetween);
        ctx.fillText(ghostName, 0, 10);
        ctx.restore();
    });

    //draw the needle
    const NeedleContainer = document.querySelector('.wheel2');
    const NeedleCanvas = NeedleContainer.children[0];
    NeedleCanvas.width = NeedleContainer.offsetWidth;
    NeedleCanvas.height = NeedleContainer.offsetHeight;
    const nCtx = NeedleCanvas.getContext("2d");
    nCtx.beginPath();
    nCtx.fillStyle = 'grey';
    [xStart, yStart, xEnd, yEnd] = [230, 30, 275, 80];
    nCtx.moveTo(xStart, yStart);
    nCtx.lineTo(Math.round((xStart + xEnd) / 2), yEnd);
    nCtx.lineTo(xEnd, yStart);
    nCtx.lineTo(xStart, yStart);
    nCtx.fill();
    nCtx.beginPath();
    nCtx.strokeStyle = 'DarkSlateGrey';
    nCtx.moveTo(xStart, yStart);
    nCtx.lineTo(Math.round((xStart + xEnd) / 2), yEnd);
    nCtx.lineTo(xEnd, yStart);
    nCtx.lineTo(xStart, yStart);
    nCtx.stroke();
}

function CalculateCoordinates(piValue, circlediameter, zeroPoint) {
    let deltaX = Math.cos(piValue) * circlediameter;
    let deltaY = Math.sin(piValue) * circlediameter;
    return [deltaX + zeroPoint[0], deltaY + zeroPoint[1]];
}
CalculateCoordinates(1.3 * Math.PI, 125, [250, 250]);


function loadGhostTypes() {
    let storedData = localStorage.getItem('ghosts');
    if (typeof(storedData) == 'string') {
        let parsedData = JSON.parse(localStorage.getItem('ghosts'));
        console.log(parsedData);
        //asummes data exists in localstorage
        return parsedData
    }
    const ghostColors = {
        Banshee: { color: "#6600cc", text_color: "#FFFFFF" },
        Demon: { color: "#990000", text_color: "#FF0000" },
        Deogen: { color: "#ffcc00", text_color: "#000000" },
        Goryo: { color: "#66ff99", text_color: "#FFFFFF" },
        Hantu: { color: "#3399ff", text_color: "#FFFFFF" },
        Jinn: { color: "#ff9900", text_color: "#FFFF00" },
        Mare: { color: "#993333", text_color: "#FFFFFF" },
        Moroi: { color: "#cc00cc", text_color: "#FFFFFF" },
        Myling: { color: "#ccffcc", text_color: "#000000" },
        Obake: { color: "#ffcc99", text_color: "#FFFFFF" },
        Oni: { color: "#cc6600", text_color: "#FFA500" },
        Onryo: { color: "#ff3366", text_color: "#FFFFFF" },
        Phantom: { color: "#6666ff", text_color: "#FFFFFF" },
        Poltergeist: { color: "#00ccff", text_color: "#000000" },
        Raiju: { color: "#33cc33", text_color: "#FFFFFF" },
        Revenant: { color: "#9900cc", text_color: "#FF0000" },
        Shade: { color: "#666666", text_color: "#FFFFFF" },
        Spirit: { color: "#99ccff", text_color: "#000000" },
        Thaye: { color: "#ff6666", text_color: "#FFFFFF" },
        "The Mimic": { color: "#9966ff", text_color: "#FFFFFF" },
        "The Twins": { color: "#ff99cc", text_color: "#000000" },
        Wraith: { color: "#00ffcc", text_color: "#000000" },
        Yokai: { color: "#ff3399", text_color: "#FFFFFF" },
        Yurei: { color: "#9999ff", text_color: "#FFFFFF" },
    };

    localStorage.setItem('ghosts',JSON.stringify(ghostColors));
    return ghostColors

}

function spinWheel() {
    const wheel = document.querySelector('.wheel');
    var Rotation = 3600 + (Math.random() * 360);
    changeToPosition(Rotation);
    console.log(changeToPosition);
    wheel.classList.toggle('rotate');
    wheel.classList.toggle('spin');
}

function changeToPosition(toPosition) {
    document.documentElement.style.setProperty('--start_rotation', `${getRotationAngle('.wheel')}deg`);
    document.documentElement.style.setProperty('--end_rotation', `${toPosition}deg`);
}

function getRotationAngle(target) {
    //thanks to https://css-tricks.com/get-value-of-css-rotation-through-javascript/
    //Converts the rotation matrix of the object to the angle in 2 decimal points.

    //Get the computed style of the requested object
    const obj = window.getComputedStyle(document.querySelector(target), null);
    //Get the rotation matrix
    const matrix = obj.getPropertyValue('transform');

    //Extract the interesting data out of the matrix
    var values = matrix.split('(')[1];
    let [a, b] = values.split(')')[0].split(',');

    //Convert it to degrees
    var angle = Math.atan2(b, a) * (180 / Math.PI);
    angle = Math.round((angle < 0 ? angle + 360 : angle) * 100) / 100;
    //document.querySelector('.title').innerHTML = angle;

    return angle;
}

function reset(){
    localStorage.clear();
    window.location.reload();
}

function about(){
    window.open("https://github.com/Filipdominik/PhasmophobiaWheel");
}

window.onload = function () {
    generateWheel(['Banshee', 'Mare', 'The Twins', 'Demon', 'Spirit', 'Yokai', 'Myling']);
    setInterval(function () { getRotationAngle('.wheel') }, 100);
}