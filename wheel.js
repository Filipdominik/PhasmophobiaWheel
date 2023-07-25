function generateWheel(ghosts) {
    const WheelContainer = document.querySelector('.wheel');
    const canvas = WheelContainer.children[0];
    canvas.width = WheelContainer.offsetWidth;
    canvas.height = WheelContainer.offsetHeight;
    const ctx = canvas.getContext("2d");
    const ghostColors = loadGhostTypes();

    let segmentSize = (2 * Math.PI) * 1 / ghosts.length;
    ghosts.forEach((ghostName) => {
        let iteration = ghosts.indexOf(ghostName); //checks which segment is currently being drawn as a number, used for further calculations of coordinates and correct rotation.
        ctx.beginPath();
        ctx.fillStyle = ghostColors[ghostName]; //selects the corresponding ghost color as the fill color
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
        let ele = document.querySelector(':root');
        let cs = getComputedStyle(ele);
        ctx.fillStyle = cs.getPropertyValue('--text_color');
        ctx.textAlign = 'center';
        ctx.font = '30px Signika Negative';
        ctx.translate(x, y);
        ctx.rotate(piValueInBetween);
        ctx.fillText(ghostName, 0, 10);
        ctx.restore();
    });
}

function CalculateCoordinates(piValue, circlediameter, zeroPoint) {
    let deltaX = Math.cos(piValue) * circlediameter;
    let deltaY = Math.sin(piValue) * circlediameter;
    return [deltaX + zeroPoint[0], deltaY + zeroPoint[1]];
}
CalculateCoordinates(1.3 * Math.PI, 125, [250, 250]);

function loadGhostTypes() {
    //Loads all ghost types, defaults to certains if none in storage.
    const storedData = localStorage.getItem('ghosts');
    let InStorage = false;
    try {
        const parsedData = JSON.parse(storedData);

        if (typeof parsedData === 'object' && parsedData !== null) {
            InStorage = true;
            var ghostColors = parsedData;
        } else {
            InStorage = false;
        }
    } catch (error) {
        InStorage = false;
    }

    if (InStorage == false) {
        var ghostColors = {
            Banshee: "purple",
            Demon: "red",
            Deogen: "darkgray",
            Goryo: "blue",
            Hantu: "lightblue",
            Jinn: "yellow",
            Mare: "darkblue",
            Moroi: "black",
            Myling: "lightgray",
            Obake: "lightgreen",
            Oni: "darkred",
            Onryo: "orange",
            Phantom: "darkpurple",
            Poltergeist: "green",
            Raiju: "cyan",
            Revenant: "darkgreen",
            Shade: "gray",
            Spirit: "white",
            Thaye: "brown",
            "The Mimic": "magenta",
            "The Twins": "violet",
            Wraith: "darkcyan",
            Yokai: "pink",
            Yurei: "lightyellow"
        };
        localStorage.setItem('ghosts', ghostColors);
    }
    return ghostColors;
}

function about() {
    const wheel = document.querySelector('.wheel');
    var Rotation = 3600 + (Math.random() * 360);
    changeToPosition(Rotation);
    console.log(changeToPosition);
    wheel.classList.toggle('rotate');
    wheel.classList.toggle('spin');

}

function changeToPosition(toPosition) {
    document.documentElement.style.setProperty('--start_rotation', `${getRotationAngle(document.querySelector('.wheel'))}deg`);
    document.documentElement.style.setProperty('--end_rotation', `${toPosition}deg`);
}

function getRotationAngle(target) {
    //thanks to https://gist.github.com/hoandang/5989980
    const obj = window.getComputedStyle(target, null);
    const matrix = obj.getPropertyValue('-webkit-transform') ||
        obj.getPropertyValue('-moz-transform') ||
        obj.getPropertyValue('-ms-transform') ||
        obj.getPropertyValue('-o-transform') ||
        obj.getPropertyValue('transform');

    let angle = 0;

    if (matrix !== 'none') {
        const values = matrix.split('(')[1].split(')')[0].split(',');
        const a = values[0];
        const b = values[1];
        angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    }

    return (angle < 0) ? angle += 360 : angle;
}


window.onload = function () {
    generateWheel(['Banshee', 'Mare', 'The Twins']);
}