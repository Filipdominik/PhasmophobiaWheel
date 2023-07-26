var ghostsInfo;
let ghostSelection = [];
function generateWheel(ghosts) {
    const WheelContainer = document.querySelector('.wheel');
    const canvas = WheelContainer.children[0];
    canvas.width = WheelContainer.offsetWidth;
    canvas.height = WheelContainer.offsetHeight;
    const ctx = canvas.getContext("2d");
    // ghostsInfo = 
    let [centerX, centerY] = [canvas.width / 2, canvas.height / 2];
    let circleDiameter = Math.round(canvas.width * 2 / 5);
    let segmentSize = (2 * Math.PI) * 1 / ghosts.length;

    ghosts.forEach((ghostName) => {
        ghostSelection.push(ghostName);
        let iteration = ghosts.indexOf(ghostName); //checks which segment is currently being drawn as a number, used for further calculations of coordinates and correct rotation.
        ctx.beginPath();
        ctx.fillStyle = ghostsInfo[ghostName]['color']; //selects the corresponding ghost color as the fill color
        ctx.arc(centerX, centerY, circleDiameter, segmentSize * iteration, segmentSize * (iteration + 1)); //draws an arc, from the outter point

        ctx.moveTo(centerX, centerY); //move to center to draw the inner triangle
        let first_corner = CalculateCoordinates(segmentSize * iteration, circleDiameter, [centerX, centerY]);
        let second_corner = CalculateCoordinates(segmentSize * (iteration + 1), circleDiameter, [centerX, centerY]);
        ctx.lineTo(first_corner[0], first_corner[1]);
        ctx.lineTo(second_corner[0], second_corner[1]);
        ctx.fill();

        //Rounds to 0.00 for more precisision, dont need anymore.
        let [lowerDegree, upperDegree] = [Math.round(segmentSize * iteration * (180 / Math.PI) * 100) / 100, Math.round(segmentSize * (iteration + 1) * (180 / Math.PI) * 100) / 100];
        ghostsInfo[ghostName]['lower_degree'] = lowerDegree;
        ghostsInfo[ghostName]['upper_degree'] = upperDegree;
        let piValueInBetween = ((segmentSize * iteration) + (segmentSize * (iteration + 1))) / 2; //Calculates the point on the circle which is the center of the segment
        let [x, y] = CalculateCoordinates(piValueInBetween, circleDiameter / 1.4, [centerX, centerY]); //Calculates the center of the segment

        //draw text
        ctx.save();
        ctx.fillStyle = ghostsInfo[ghostName]['text_color'];
        ctx.textAlign = 'center';
        if (ghosts.length < 10) {
            ctx.font = '30px Signika Negative';
        }
        else {
            ctx.font = '20px Signika Negative';
        }
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

    let [x, y] = [NeedleCanvas.width, NeedleCanvas.height];
    [xStart, yStart, xEnd, yEnd] = [Math.round(x / 2) - 20, Math.round(y * 0.08), Math.round(x / 2) + 20, Math.round(y * 0.15)];
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

function loadGhostTypes() {
    let storedData = localStorage.getItem('ghosts');
    if (typeof (storedData) == 'string') {
        let parsedData = JSON.parse(localStorage.getItem('ghosts'));
        //asummes data exists in localstorage
        ghostsInfo = parsedData;
        return parsedData
    }
    ghostsInfo = {
        Banshee: { color: "#6600cc", text_color: "#FFFFFF"},
        Demon: { color: "#990000", text_color: "#FF0000"},
        Deogen: { color: "#ffcc00", text_color: "#000000"},
        Goryo: { color: "#66ff99", text_color: "#FFFFFF"},
        Hantu: { color: "#3399ff", text_color: "#FFFFFF"},
        Jinn: { color: "#ff9900", text_color: "#FFFF00"},
        Mare: { color: "#993333", text_color: "#FFFFFF"},
        Moroi: { color: "#cc00cc", text_color: "#FFFFFF"},
        Myling: { color: "#ccffcc", text_color: "#000000"},
        Obake: { color: "#ffcc99", text_color: "#FFFFFF"},
        Oni: { color: "#cc6600", text_color: "#FFA500"},
        Onryo: { color: "#ff3366", text_color: "#FFFFFF"},
        Phantom: { color: "#6666ff", text_color: "#FFFFFF"},
        Poltergeist: { color: "#00ccff", text_color: "#000000"},
        Raiju: { color: "#33cc33", text_color: "#FFFFFF"},
        Revenant: { color: "#9900cc", text_color: "#FF0000"},
        Shade: { color: "#666666", text_color: "#FFFFFF"},
        Spirit: { color: "#99ccff", text_color: "#000000"},
        Thaye: { color: "#ff6666", text_color: "#FFFFFF"},
        "The Mimic": { color: "#9966ff", text_color: "#FFFFFF"},
        "The Twins": { color: "#ff99cc", text_color: "#000000"},
        Wraith: { color: "#00ffcc", text_color: "#000000"},
        Yokai: { color: "#ff3399", text_color: "#FFFFFF"},
        Yurei: { color: "#9999ff", text_color: "#FFFFFF"}
    };

    localStorage.setItem('ghosts', JSON.stringify(ghostsInfo));
    return ghostsInfo

}

function spinWheel() {
    document.querySelector('main').removeEventListener("click", spinWheel);
    setTimeout(function () {
        document.onkeydown = function (key) {
            if (key.key == ' ') {
                HidePopUp();
            }
        }
    }, 100)

    const wheel = document.querySelector('.wheel');
    var randomDegrees = Math.random() * 360;
    var Rotation = 3600 + randomDegrees;
    const WinningDegree = (1.5 * Math.PI) * (180 / Math.PI);
    var spinspeed = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--spin_speed').replace('s', '000'));

    for (const [ghost, info] of Object.entries(ghostsInfo)) {
        var [lower, upper] = [info['lower_degree'] + randomDegrees, info['upper_degree'] + randomDegrees];
        if (lower > 360) {
            lower -= 360;
            upper -= 360;
        }
        if (lower != undefined) {
            if (WinningDegree > lower && WinningDegree < upper) {
                document.querySelector('.winning_ghost_text').innerHTML = `The winning ghost is ${ghost}!`;
                setTimeout(function () {
                    // console.log(`This ghost has won: ${ghost} \nWith ${lower} and ${upper}`);
                    let PopUpElement = document.querySelector('.PopUp');
                    let SettingsElement = document.querySelector('.Settings');
                    let WinningGhost_Text = document.querySelector('.winning_ghost_text');
                    WinningGhost_Text.style.display = 'block';
                    SettingsElement.style.display = 'none';
                    PopUpElement.style.display = 'flex';
                    PopUpElement.onclick = HidePopUp;
                    PopUpElement.style.cursor = 'cursor';
                }, spinspeed);
            }
        }
    }
    changeToPosition(Rotation);
    wheel.classList.toggle('rotate');
    wheel.classList.toggle('spin');
}
function HidePopUp() {
    document.querySelector('.PopUp').style.display = 'none';
    const wheel = document.querySelector('.wheel');
    wheel.classList.toggle('rotate');
    wheel.classList.toggle('spin');
    setTimeout(function () {
        document.querySelector('main').addEventListener("click", spinWheel);
        document.onkeydown = function (key) {
            if (key.key == ' ') {
                spinWheel();
            }
        }
    }, 100);
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
    return angle;
}

function reset() {
    //Resets the settings made in the URL and localstorage and refreshes the page.
    localStorage.clear();
    document.location.search = '';
}

function changesettings(){
    let PopUpElement = document.querySelector('.PopUp');
    let PopUpContentElement = document.querySelector('.PopUpContent');
    let SettingsElement = document.querySelector('.Settings');
    let WinningGhost_Text = document.querySelector('.winning_ghost_text');
    WinningGhost_Text.style.display = 'none';
    SettingsElement.style.display = 'flex';
    PopUpElement.style.display = 'flex';

    PopUpElement.onclick = '';
    document.querySelector('main').removeEventListener("click", spinWheel);
    PopUpContentElement.onclick = '';
    WinningGhost_Text.onclick = '';
    PopUpElement.style.cursor = 'default';

    const tableElement = SettingsElement.querySelector('table');
    const template = tableElement.querySelector('.template');
    for (const [ghost, info] of Object.entries(ghostsInfo)) {
        let duped_element = template.cloneNode(true);
        duped_element.querySelector('.ghost_name').value = ghost;
        duped_element.querySelector('.ghost_color').value = info['color'];
        duped_element.querySelector('.text_color').value = info['text_color'];
        duped_element.querySelector('.evidence_popup').addEventListener('click', function() {show_evidence(ghost)});
        duped_element.querySelector('.remove_ghost').addEventListener('click', function() {remove_ghost(ghost)});
        duped_element.classList.add(ghost.replace(' ','_'));
        tableElement.appendChild(duped_element);
    }

}

function share(){
    WriteParameters();
    alert("Copy the complete URL to share your settings!")
}

function about() {
    window.open("https://github.com/Filipdominik/PhasmophobiaWheel");
}

function ReadParameters() {
    //Reads settings from url.
    let USP = new URLSearchParams(document.location.search);
    const b64data = USP.get('data');
    const data = new TextDecoder().decode(base64ToBytes(b64data));

    const b64selection = USP.get('selection');
    let selection = new TextDecoder().decode(base64ToBytes(b64selection));

    return [data, selection]
}

function WriteParameters() {
    let USP = new URLSearchParams()

    const stringifiedGI = JSON.stringify(ghostsInfo);
    const encodedGI = new TextEncoder().encode(stringifiedGI);
    const base64dGI = bytesToBase64(encodedGI);
    USP.set('data', base64dGI);

    const stringifiedGS = JSON.stringify(ghostSelection);
    const encodedGS = new TextEncoder().encode(stringifiedGS);
    const base64dGS = bytesToBase64(encodedGS)
    USP.set('selection', base64dGS);
    document.location.search = USP.toString();
    console.log(USP.toString().length);
}

function base64ToBytes(base64) {
    const binString = atob(base64);
    return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

function bytesToBase64(bytes) {
    const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join("");
    return btoa(binString);
}

window.onload = function () {
    if (document.location.search.length > 2) {
        let [data,selection] = ReadParameters();
        ghostsInfo = JSON.parse(data);
        ghostSelection = JSON.parse(selection);
        generateWheel(ghostSelection);
    }
    else {
        loadGhostTypes();
        generateWheel(['Banshee', 'Demon', 'Deogen', 'Goryo', 'Hantu', 'Jinn', 'Mare', 'Moroi', 'Myling', 'Obake', 'Oni', 'Onryo', 'Phantom', 'Poltergeist', 'Raiju', 'Revenant', 'Shade', 'Spirit', 'Thaye', 'The Mimic', 'The Twins', 'Wraith', 'Yokai', 'Yurei']);
    }

    document.querySelector('main').addEventListener("click", spinWheel);
    document.onkeydown = function (key) {
        if (key.key == ' ') {
            spinWheel();
        }
    }
    // setInterval(function () { getRotationAngle('.wheel') }, 100); //debuging
}