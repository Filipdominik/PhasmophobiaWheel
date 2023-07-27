let ghostsInfo;
let ghostSelection = [];
let [mouseX, mouseY] = [];
// Utility Functions
function CalculateCoordinates(piValue, circlediameter, zeroPoint) {
    let deltaX = Math.cos(piValue) * circlediameter;
    let deltaY = Math.sin(piValue) * circlediameter;
    return [deltaX + zeroPoint[0], deltaY + zeroPoint[1]];
}

function getRotationAngle(target) {
    const obj = window.getComputedStyle(document.querySelector(target), null);
    const matrix = obj.getPropertyValue('transform');
    var values = matrix.split('(')[1];
    let [a, b] = values.split(')')[0].split(',');
    var angle = Math.atan2(b, a) * (180 / Math.PI);
    angle = Math.round((angle < 0 ? angle + 360 : angle) * 100) / 100;
    return angle;
}

function base64ToBytes(base64) {
    const binString = atob(base64);
    return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

function bytesToBase64(bytes) {
    const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join("");
    return btoa(binString);
}

function generateWheel(ghosts) {
    const WheelContainer = document.querySelector('.wheel');
    const canvas = WheelContainer.children[0];
    canvas.width = WheelContainer.offsetWidth;
    canvas.height = WheelContainer.offsetHeight;
    const ctx = canvas.getContext("2d");

    const circleDiameter = Math.round(canvas.width * 2 / 5);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    //first loop to check if the ghosts even exist in the ghostsInfo object.
    ghosts.forEach((ghostName, index) => {
        if (ghostsInfo[ghostName] == undefined) {
            //if ghosts doesn't exist, delete it.
            ghosts.splice(index, 1);
        }
    });
    //and then calculate the segment size for each ghost.
    const segmentSize = (2 * Math.PI) * 1 / ghosts.length;

    ghosts.forEach((ghostName, index) => {
        const ghostInfo = ghostsInfo[ghostName];
        ghostSelection.push(ghostName);
        const iteration = index; // Segment index for calculations.

        ctx.beginPath();
        ctx.fillStyle = ghostInfo['color'];
        ctx.arc(centerX, centerY, circleDiameter, segmentSize * iteration, segmentSize * (iteration + 1));

        ctx.moveTo(centerX, centerY);
        const first_corner = CalculateCoordinates(segmentSize * iteration, circleDiameter, [centerX, centerY]);
        const second_corner = CalculateCoordinates(segmentSize * (iteration + 1), circleDiameter, [centerX, centerY]);
        ctx.lineTo(first_corner[0], first_corner[1]);
        ctx.lineTo(second_corner[0], second_corner[1]);
        ctx.fill();

        const lowerDegree = Math.round(segmentSize * iteration * (180 / Math.PI) * 100) / 100;
        const upperDegree = Math.round(segmentSize * (iteration + 1) * (180 / Math.PI) * 100) / 100;
        ghostInfo['lower_degree'] = lowerDegree;
        ghostInfo['upper_degree'] = upperDegree;
        const piValueInBetween = (segmentSize * iteration + segmentSize * (iteration + 1)) / 2;
        const [x, y] = CalculateCoordinates(piValueInBetween, circleDiameter / 1.4, [centerX, centerY]);

        ctx.save();
        ctx.fillStyle = ghostInfo['text_color'];
        ctx.textAlign = 'center';
        ctx.font = ghosts.length < 10 ? '30px Signika Negative' : '20px Signika Negative';
        ctx.translate(x, y);
        ctx.rotate(piValueInBetween);
        ctx.fillText(ghostName, 0, 10);
        ctx.restore();
    });

    // Draw the needle
    const NeedleContainer = document.querySelector('.wheel2');
    const NeedleCanvas = NeedleContainer.children[0];
    NeedleCanvas.width = NeedleContainer.offsetWidth;
    NeedleCanvas.height = NeedleContainer.offsetHeight;
    const nCtx = NeedleCanvas.getContext("2d");

    nCtx.beginPath();
    nCtx.fillStyle = 'grey';

    const [x, y] = [NeedleCanvas.width, NeedleCanvas.height];
    const xStart = Math.round(x / 2) - 20;
    const yStart = Math.round(y * 0.08);
    const xEnd = Math.round(x / 2) + 20;
    const yEnd = Math.round(y * 0.15);

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


function loadGhostTypes() {
    let storedData = localStorage.getItem('ghosts');
    if (typeof (storedData) == 'string') {
        let parsedData = JSON.parse(localStorage.getItem('ghosts'));
        //asummes data exists in localstorage
        ghostsInfo = parsedData;
        return parsedData
    }
    ghostsInfo = {
        Banshee: {
            color: "#6600cc",
            text_color: "#FFFFFF"
        },
        Demon: {
            color: "#990000",
            text_color: "#FF0000"
        },
        Deogen: {
            color: "#ffcc00",
            text_color: "#000000"
        },
        Goryo: {
            color: "#66ff99",
            text_color: "#FFFFFF"
        },
        Hantu: {
            color: "#3399ff",
            text_color: "#FFFFFF"
        },
        Jinn: {
            color: "#ff9900",
            text_color: "#FFFF00"
        },
        Mare: {
            color: "#993333",
            text_color: "#FFFFFF"
        },
        Moroi: {
            color: "#cc00cc",
            text_color: "#FFFFFF"
        },
        Myling: {
            color: "#ccffcc",
            text_color: "#000000"
        },
        Obake: {
            color: "#ffcc99",
            text_color: "#FFFFFF"
        },
        Oni: {
            color: "#cc6600",
            text_color: "#FFA500"
        },
        Onryo: {
            color: "#ff3366",
            text_color: "#FFFFFF"
        },
        Phantom: {
            color: "#6666ff",
            text_color: "#FFFFFF"
        },
        Poltergeist: {
            color: "#00ccff",
            text_color: "#000000"
        },
        Raiju: {
            color: "#33cc33",
            text_color: "#FFFFFF"
        },
        Revenant: {
            color: "#9900cc",
            text_color: "#FF0000"
        },
        Shade: {
            color: "#666666",
            text_color: "#FFFFFF"
        },
        Spirit: {
            color: "#99ccff",
            text_color: "#000000"
        },
        Thaye: {
            color: "#ff6666",
            text_color: "#FFFFFF"
        },
        "The Mimic": {
            color: "#9966ff",
            text_color: "#FFFFFF"
        },
        "The Twins": {
            color: "#ff99cc",
            text_color: "#000000"
        },
        Wraith: {
            color: "#00ffcc",
            text_color: "#000000"
        },
        Yokai: {
            color: "#ff3399",
            text_color: "#FFFFFF"
        },
        Yurei: {
            color: "#9999ff",
            text_color: "#FFFFFF"
        }
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
    wheel.classList.remove('rotate');
    wheel.classList.add('spin');
}

function HidePopUp() {
    document.querySelector('.PopUp').style.display = 'none';
    const wheel = document.querySelector('.wheel');
    wheel.classList.add('rotate');
    wheel.classList.remove('spin');
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

function reset() {
    //Resets the settings made in the URL and localstorage and refreshes the page.
    localStorage.clear();
    document.location.search = '';
}

function changesettings() {
    //Opens the settings window, currently not using any JS framework. I know that it's dumb.
    // When I'll need to rewrite this code at any point,
    //I will be using React, as I'm most familiar with that.
    let PopUpElement = document.querySelector('.PopUp');
    let PopUpContentElement = document.querySelector('.PopUpContent');
    let SettingsElement = document.querySelector('.Settings');
    let WinningGhost_Text = document.querySelector('.winning_ghost_text');
    WinningGhost_Text.style.display = 'none';
    SettingsElement.style.display = 'flex';
    PopUpElement.style.display = 'flex';

    PopUpElement.onclick = function(event){
        //set to only close the popup if the background (.PopUp) is clicked.
        if (event.target != event.currentTarget) return;
        HidePopUp();
    };
    
    document.querySelector('main').removeEventListener("click", spinWheel);
    PopUpContentElement.onclick = '';
    WinningGhost_Text.onclick = '';
    PopUpElement.style.cursor = 'default';
    let tableElement = SettingsElement.querySelector('table');
    let template = tableElement.querySelector('.template');
    template.style.display = 'table-row'
    //delete all the children of the table, except the template.
    while (tableElement.children.length > 1) {
        tableElement.removeChild(tableElement.lastChild);
    }
    for (let [ghost, info] of Object.entries(ghostsInfo)) {
        let duped_element = template.cloneNode(true);
        duped_element.querySelector('.ghost_name').value = ghost;
        duped_element.querySelector('.ghost_name').placeholder = ghost;
        duped_element.querySelector('.ghost_name').addEventListener('change', function () {
            CheckForChanges('.' + ghost, '.ghost_name')
        });
        duped_element.querySelector('.ghost_color').value = info['color'];
        duped_element.querySelector('.text_color').value = info['text_color'];
        duped_element.querySelector('.evidence_popup').addEventListener('click', function () {
            show_evidence(ghost)
        });
        duped_element.querySelector('.remove_ghost').addEventListener('click', function () {
            remove_ghost(ghost);
        });
        duped_element.classList.add(ghost.replace(' ', '_')); //Classnames can't have spaces in them.
        duped_element.classList.remove('template');
        duped_element.style.display = 'table-row';
        tableElement.appendChild(duped_element);
    }
    template.style.display = 'none';
    //Show page colors in the color selection:
    let pageColorsElement = document.querySelector('.page_colors');
    //read the elements
    let [main_color_picker, secondary_color_picker, accent_color_picker, accent_color_negative_picker, text_color_picker, background_color_picker] = pageColorsElement.querySelectorAll('.color_picker');
    //read the current color values.
    let RootElement = getComputedStyle(document.documentElement);

    let main_color = RootElement.getPropertyValue('--main_color');
    let secondary_color = RootElement.getPropertyValue('--secondary_color');
    let accent_color = RootElement.getPropertyValue('--accent_color');
    let accent_color_negative = RootElement.getPropertyValue('--accent_color_negative');
    let text_color = RootElement.getPropertyValue('--text_color');
    let background_color = RootElement.getPropertyValue('--background_color');

    //set the values
    main_color_picker.value = main_color;
    secondary_color_picker.value = secondary_color;
    accent_color_picker.value = accent_color;
    accent_color_negative_picker.value = accent_color_negative;
    text_color_picker.value = text_color;
    background_color_picker.value = background_color;
}

function remove_ghost(ghost) {
    const confirmElement = document.querySelector('.ConfirmSelectionPopUp');
    confirmElement.querySelector('h3').innerHTML = `Are you sure you want to delete ${ghost} from storage?`;
    confirmElement.querySelector('.SelectionConfirm').onclick = function () {
        //Removes a ghost from the ghostInfo object and stores that new object to storage
        delete ghostsInfo[ghost];
        localStorage.setItem('ghosts', JSON.stringify(ghostsInfo));
        let scrollPosition = document.querySelector('.Settings').scrollTop;
        HidePopUp();
        changesettings();
        document.querySelector('.Settings').scrollTop = scrollPosition;
        confirmElement.style.display = 'none';
    }
    confirmElement.querySelector('.SelectionCancel').onclick = function(){
        confirmElement.style.display = 'none';
    }
    //First, render the confirm box on the screen to get the dimensions of it.
    confirmElement.style.display = 'flex';
    //Now move the confirm box near the cursor, but a bit to the right side of the screen so that the user can't by accident click on a button.
    confirmElement.style.left = `${mouseX-(confirmElement.clientWidth/2.5)}px`; //With a divison > 2, right of the cursor. <2, left of the cursor.
    confirmElement.style.top = `${mouseY-(confirmElement.clientHeight/2)}px`; //The Y is centered on the mouse.
}

function CheckForChanges(ParentClassName, ElementClassName) {
    //Checks if the value of the box is different from the default (placeholder) value, and shows a different color.
    let Element = document.querySelector(ParentClassName).querySelector(ElementClassName);
    if (Element.placeholder != Element.value) {
        Element.style.backgroundColor = 'var(--accent_color)';
    } else {
        Element.style.backgroundColor = 'var(--secondary_color)';
    }
}

function share() {
    WriteParameters();
    alert("Copy the complete URL to share your settings!");
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
}

window.onload = function () {
    if (document.location.search.length > 2) {
        let [data, selection] = ReadParameters();
        ghostsInfo = JSON.parse(data);
        ghostSelection = JSON.parse(selection);
        generateWheel(ghostSelection);
    } else {
        ghostsInfo = loadGhostTypes();
        generateWheel(['Banshee', 'Demon', 'Deogen', /* ... */ 'Yokai', 'Yurei']);
    }

    document.querySelector('main').addEventListener("click", spinWheel);
    document.onkeydown = function (key) {
        if (key.key == ' ') {
            spinWheel();
        }
    }
    document.querySelector('.settingsBTN').onclick = changesettings;
    window.onmousemove = function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }
    // setInterval(function () { getRotationAngle('.wheel') }, 100); //debugging
};