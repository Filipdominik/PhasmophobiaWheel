let ghostsInfo;
let ghostsInfoTemp;
let Evidence_Filter = [];
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

//End of utility functions


function generateWheel(ghosts) {
    // Draws a wheel and needle on the canvases.
    const WheelContainer = document.querySelector('.wheel');
    const canvas = WheelContainer.children[0];
    canvas.width = WheelContainer.offsetWidth;
    canvas.height = WheelContainer.offsetHeight;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const circleDiameter = Math.round(canvas.width * 2 / 5);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    //first loop to check if the ghosts even exist in the ghostsInfo object. 
    // If it doesn't remove from the newly made list to ignore it.
    ghosts.forEach((ghostName, index) => {
        if (ghostSelection.includes(ghostName) == false) {
            ghostSelection.push(ghostName);
        }
        if (ghostsInfo[ghostName] == undefined) {
            console.log(`Deleted ghost ${ghostName}`);
            //if ghosts doesn't exist, delete it.
            ghosts.splice(index, 1);
        }
    });

    //After filtering the ghosts, calculate how big the segment sizes have got to be.
    const segmentSize = (2 * Math.PI) * 1 / ghosts.length;

    ghosts.forEach((ghostName, index) => {
        //Iterate through each ghost, and draw a segment for each and add text.

        // How this code works:
        // It first draws a half circle (arc) on the outside of the circle, 
        // then draws a triangle from both the ends of the circle to the center of the wheel.
        // After that, it calculates the center line of the segment, and it calculates the middle point of it.
        // Then it rotates the canvas to the middle point of the segment, and writes the ghost name there.
        const ghostInfo = ghostsInfo[ghostName];
        const iteration = index; // Segment index for calculations.

        ctx.beginPath();
        //draw the half circle (arc).
        ctx.fillStyle = ghostInfo['color'];
        ctx.arc(centerX, centerY, circleDiameter, segmentSize * iteration, segmentSize * (iteration + 1));

        ctx.moveTo(centerX, centerY); //move to the center to draw the triangle.
        const first_corner = CalculateCoordinates(segmentSize * iteration, circleDiameter, [centerX, centerY]);
        const second_corner = CalculateCoordinates(segmentSize * (iteration + 1), circleDiameter, [centerX, centerY]);
        ctx.lineTo(first_corner[0], first_corner[1]);
        ctx.lineTo(second_corner[0], second_corner[1]);
        //draw the triangle.
        ctx.fill();


        //Calculate the center point of the segment.
        const lowerDegree = Math.round(segmentSize * iteration * (180 / Math.PI) * 100) / 100;
        const upperDegree = Math.round(segmentSize * (iteration + 1) * (180 / Math.PI) * 100) / 100;
        ghostInfo['lower_degree'] = lowerDegree;
        ghostInfo['upper_degree'] = upperDegree;
        const piValueInBetween = (segmentSize * iteration + segmentSize * (iteration + 1)) / 2;
        const [x, y] = CalculateCoordinates(piValueInBetween, circleDiameter / 1.4, [centerX, centerY]);

        ctx.save(); //save the canvas state to restore it later on (this saves will reverse all the rotations and translations)
        ctx.fillStyle = ghostInfo['text_color']; //Grab the text color for this ghost.
        ctx.textAlign = 'center';
        ctx.font = ghosts.length < 10 ? '30px Signika Negative' : '20px Signika Negative';
        ctx.translate(x, y);
        ctx.rotate(piValueInBetween);
        ctx.fillText(ghostName, 0, 10); //Fill causes the text to be drawn.
        ctx.restore();
    });

    // Draw the needle
    const NeedleContainer = document.querySelector('.needle');
    const NeedleCanvas = NeedleContainer.children[0];
    NeedleCanvas.width = NeedleContainer.offsetWidth;
    NeedleCanvas.height = NeedleContainer.offsetHeight;
    const nCtx = NeedleCanvas.getContext("2d");

    nCtx.beginPath();
    //draw the inner part of the needle.
    const [x, y] = [NeedleCanvas.width, NeedleCanvas.height];
    const xStart = Math.round(x / 2) - 21;
    const yStart = Math.round(y * 0.08);
    const xEnd = Math.round(x / 2) + 21;
    const yEnd = Math.round(y * 0.15);

    nCtx.fillStyle = 'grey';
    nCtx.moveTo(xStart, yStart);
    nCtx.lineTo(Math.round((xStart + xEnd) / 2), yEnd);
    nCtx.lineTo(xEnd, yStart);
    nCtx.lineTo(xStart, yStart);
    nCtx.fill();

    //Draw the outline of the needle for better contrast.
    nCtx.beginPath();
    nCtx.strokeStyle = 'DarkSlateGrey';
    nCtx.moveTo(xStart, yStart);
    nCtx.lineTo(Math.round((xStart + xEnd) / 2), yEnd);
    nCtx.lineTo(xEnd, yStart);
    nCtx.lineTo(xStart, yStart);
    nCtx.stroke();
}

function selectGhosts() {
    //Shows the ghost selection screen and dynamically adds all the ghosts from ghostsInfo.
    let wheel_window = document.querySelector('.the_wheel');
    let ghost_selection_and_evidence_window = document.querySelector('.ghost_and_evidence_selection');
    let ghost_selection_window = document.querySelector('.ghost_selection');
    let ghost_selection_and_evidence_BTN = document.querySelector('.selectGhostBTN');

    //remove all event listeners:
    document.querySelector('main').removeEventListener("click", spinWheel);
    document.onkeydown = '';
    document.querySelector('.PopUp').onclick = '';
    document.querySelector('.Winning_Ghost').onclick = '';
    document.querySelector('.Settings').onclick = '';

    //Hide the wheel, show the ghost selection and evidence window:
    wheel_window.style.display = 'none';
    ghost_selection_and_evidence_window.style.display = 'flex';

    //Change the button text to go back to wheel.
    ghost_selection_and_evidence_BTN.innerHTML = 'Save & Go Back';
    ghost_selection_and_evidence_BTN.style.display = 'default';

    //Save the selection, redo the event listeners that were removed and generate the wheel.
    ghost_selection_and_evidence_BTN.onclick = function () {
        ghostSelection = [];
        for (let ghost of ghost_selection_window.querySelectorAll('.ghost')) {
            if (ghost.style.backgroundColor == 'var(--secondary_color)') {
                ghostSelection.push(ghost.querySelector('h4').innerHTML);
            }
        }
        ghost_selection_and_evidence_window.style.display = 'none';
        wheel_window.style.display = 'flex';
        ghost_selection_and_evidence_BTN.innerHTML = 'Select Ghosts';
        ghost_selection_and_evidence_BTN.onclick = selectGhosts;
        HidePopUp();
        generateWheel(ghostSelection);
    }

    //Not so pretty, but it works, it clears the ghost selection window and adds all the ghosts from ghostsInfo.:
    ghost_selection_window.innerHTML = "<h1>Ghost Selection</h1><div><div class='ghost'><h4></h4></div></div>";
    let ghost_template = ghost_selection_window.querySelector('.ghost'); //grab the inner div to clone it later on.
    ghost_selection_window.innerHTML = "<h1>Ghost Selection</h1><div></div>";

    //iterate through all ghosts and add them to the ghost selection window.
    for (let [ghost, info] of Object.entries(ghostsInfo)) {
        //info is in this case ignored, but it's there for future use.
        let duped_element = ghost_template.cloneNode(true);
        duped_element.querySelector('h4').innerHTML = ghost.replaceAll('_', ' ');
        duped_element.classList.add(ghost.replaceAll(' ', '_'));

        //Check if the ghost is already selected, if so, change the background color.
        if (ghostSelection.includes(ghost)) {
            //if the ghost is selected.
            duped_element.style.backgroundColor = 'var(--secondary_color)';
        }
        else {
            //else, if the ghost is not selected.
            duped_element.style.backgroundColor = 'var(--main_color)';
        }

        duped_element.onclick = function () {
            if (ghostSelection.includes(ghost)) {
                //If the ghost is already selected, remove it from the selection.
                ghostSelection.splice(ghostSelection.indexOf(ghost), 1);
                duped_element.style.backgroundColor = 'var(--main_color)';
            }
            else {
                //If the ghost is not selected, add it to the selection.
                ghostSelection.push(ghost);
                duped_element.style.backgroundColor = 'var(--secondary_color)';
            }
        }
        //Add the newly created element to the ghost selection window.
        ghost_selection_window.querySelector('div').appendChild(duped_element);
    }
}

function FilterEvidence(evidence_type) {
    //Filters the ghosts based on their evidence and the selected.

    let evidence_element = document.querySelector('.evidence_window').querySelector('div').querySelector('.' + evidence_type);
    //Checks wheter the evidence is selected or not, and changes the background color accordingly.
    // Also adds or removes the evidence from the Evidence_Filter array.    
    if (evidence_element.style.backgroundColor == 'var(--secondary_color)') {
        evidence_element.style.backgroundColor = 'var(--main_color)';
        Evidence_Filter.splice(Evidence_Filter.indexOf(evidence_type), 1);
    }
    else {
        evidence_element.style.backgroundColor = 'var(--secondary_color)';
        Evidence_Filter.push(evidence_type);
    }

    //Take the filter into effect:
    let ghost_selection = document.querySelector('.ghost_selection');
    for (let ghost of ghost_selection.querySelectorAll('.ghost')) {
        //Go through each ghost, and check how much evidence it has that matches the filter.
        let ghost_name = ghost.querySelector('h4').innerHTML;
        let ghost_info = ghostsInfo[ghost_name];
        let evidence = ghost_info['evidence'];
        let evidence_found = 0;

        for (let evidence_type of evidence) {
            //check how much evidence the ghost has that matches the filter.
            if (Evidence_Filter.includes(evidence_type)) {
                evidence_found++;
            }
        }

        if (evidence_found >= Evidence_Filter.length) {
            //if the ghost matches the filter (has all the evidence that is selected), show it by the border.
            ghost.style.border = '5px solid var(--accent_color)';
            ghost.style.padding = '5px'; //It reduces the padding so that the element won't get bigger.
        }
        else {
            //If the ghost doesn't match the filter, go back to regular styling.
            if (ghostSelection.includes(ghost.querySelector('h4').innerHTML)) {
                ghost.style.backgroundColor = 'var(--secondary_color)';
                ghost.style.border = 'none';
                ghost.style.padding = '10px'; //Reset the padding to normal
            }
            else {
                ghost.style.backgroundColor = 'var(--main_color)';
                ghost.style.border = 'none';
                ghost.style.padding = '10px'; //Reset the padding to normal
            }
        }
    }
}

function Filter_Selection(mode) {
    //Function to handle the buttons below the evidence selection window
    let ghost_selection_window = document.querySelector('.ghost_selection');
    let evidence_elements = document.querySelectorAll('.evidence');
    let ghost_elements = ghost_selection_window.querySelectorAll('.ghost');

    if (mode == 'clear_evidence') {
        //Deselects all selected evidence filters.
        for (let evidence of evidence_elements) {
            evidence.style.backgroundColor = 'var(--main_color)';
        }
    }

    else if (mode == 'clear_all') {
        //Clears evidence and ghosts selection.
        for (let evidence of evidence_elements) {
            evidence.style.backgroundColor = 'var(--main_color)';
        }

        for (let ghost of ghost_elements) {
            ghost.style.backgroundColor = 'var(--main_color)';
            ghost.style.border = 'none';
            ghost.style.padding = '10px'; //Reset the padding to normal
            ghostSelection.splice(ghostSelection.indexOf(ghost.querySelector('h4').innerHTML), 1);
        }
    }

    else if (mode == 'clear_selection') {
        //Deselects all ghosts.
        for (let ghost of ghost_elements) {
            ghost.style.backgroundColor = 'var(--main_color)';
            ghost.style.border = 'none';
            ghost.style.padding = '10px'; //Reset the padding to normal
            ghostSelection.splice(ghostSelection.indexOf(ghost.querySelector('h4').innerHTML), 1);
        }
    }

    else if (mode == 'filtered') {
        //Selects all ghosts that match the filter (have a border).
        for (let ghost of ghost_elements) {
            if (ghost.style.border.length > 1 && ghost.style.border.includes('none') == false) {
                ghost.style.backgroundColor = 'var(--secondary_color)';
                ghostSelection.push(ghost.querySelector('h4').innerHTML);
            }
            else {
                //Deselect it:
                ghost.style.backgroundColor = 'var(--main_color)';
                ghostSelection.splice(ghostSelection.indexOf(ghost.querySelector('h4').innerHTML), 1);
            }
        }
    }

    else if (mode == 'select_all') {
        // selects all ghosts
        for (let ghost of ghost_elements) {
            ghost.style.backgroundColor = 'var(--secondary_color)';
            ghostSelection.push(ghost.querySelector('h4').innerHTML);
            ghost.style.border = 'none';
            ghost.style.padding = '10px'; //Reset the padding to normal
        }
    }
}

function loadGhostTypes() {
    //Loads the ghosts from storage, if they don't exist, it creates them.
    // After a phasmophobia update, that adds or changes ghosts. Values in this array should be changed.
    let storedData = localStorage.getItem('ghosts');
    if (typeof (storedData) == 'string') {
        let parsedData = JSON.parse(localStorage.getItem('ghosts'));
        //asummes data exists in localstorage
        ghostsInfo = parsedData;
        return parsedData
    }
    ghostsInfo = {
        Spirit: {
            color: "#99ccff",
            text_color: "#000000",
            evidence: ["writing", "emf_5", "spirit_box"]
        },
        Wraith: {
            color: "#00ffcc",
            text_color: "#000000",
            evidence: ["dots", "emf_5", "spirit_box"]
        },
        Phantom: {
            color: "#6666ff",
            text_color: "#FFFFFF",
            evidence: ["dots", "emf_5", "orbs"]
        },
        Poltergeist: {
            color: "#00ccff",
            text_color: "#000000",
            evidence: ["writing", "fingerprints", "spirit_box"]
        },
        Banshee: {
            color: "#6600cc",
            text_color: "#FFFFFF",
            evidence: ["dots", "orbs", "fingerprints"]
        },
        Jinn: {
            color: "#ff9900",
            text_color: "#FFFF00",
            evidence: ["emf_5", "freezing", "fingerprints"]
        },
        Mare: {
            color: "#993333",
            text_color: "#FFFFFF",
            evidence: ["writing", "orbs", "spirit_box"]
        },
        Revenant: {
            color: "#9900cc",
            text_color: "#FF0000",
            evidence: ["writing", "orbs", "freezing"]
        },
        Shade: {
            color: "#666666",
            text_color: "#FFFFFF",
            evidence: ["writing", "emf_5", "freezing"]
        },
        Demon: {
            color: "#990000",
            text_color: "#FF0000",
            evidence: ["freezing", "writing", "fingerprints"]
        },
        Yurei: {
            color: "#9999ff",
            text_color: "#FFFFFF",
            evidence: ["dots", "orbs", "freezing"]
        },
        Oni: {
            color: "#cc6600",
            text_color: "#FFA500",
            evidence: ["dots", "emf_5", "freezing"]
        },
        Yokai: {
            color: "#ff3399",
            text_color: "#FFFFFF",
            evidence: ["dots", "orbs", "spirit_box"]
        },
        Hantu: {
            color: "#3399ff",
            text_color: "#FFFFFF",
            evidence: ["orbs", "freezing", "fingerprints"]
        },
        Goryo: {
            color: "#66ff99",
            text_color: "#FFFFFF",
            evidence: ["dots", "emf_5", "fingerprints"]
        },
        Myling: {
            color: "#ccffcc",
            text_color: "#000000",
            evidence: ["writing", "emf_5", "fingerprints"]
        },
        Onryo: {
            color: "#ff3366",
            text_color: "#FFFFFF",
            evidence: ["orbs", "freezing", "spirit_box"]
        },
        "The Twins": {
            color: "#ff99cc",
            text_color: "#000000",
            evidence: ["dots", "writing", "spirit_box"]
        },
        Raiju: {
            color: "#33cc33",
            text_color: "#FFFFFF",
            evidence: ["dots", "emf_5", "orbs"]
        },
        Obake: {
            color: "#ffcc99",
            text_color: "#FFFFFF",
            evidence: ["emf_5", "orbs", "fingerprints"]
        },
        "The Mimic": {
            color: "#9966ff",
            text_color: "#FFFFFF",
            evidence: ["fingerprints", "freezing", "spirit_box"]
        },
        Moroi: {
            color: "#cc00cc",
            text_color: "#FFFFFF",
            evidence: ["writing", "orbs", "spirit_box"]
        },
        Deogen: {
            color: "#ffcc00",
            text_color: "#000000",
            evidence: ["dots", "writing", "spirit_box"]
        },
        Thaye: {
            color: "#ff6666",
            text_color: "#FFFFFF",
            evidence: ["dots", "writing", "orbs"]
        }
    };

    localStorage.setItem('ghosts', JSON.stringify(ghostsInfo));
    return ghostsInfo

}

function TranslateEvidence(evidence) {
    if (evidence == 'dots') return 'D.O.T.S. Projector';
    if (evidence == 'writing') return 'Ghost Writing';
    if (evidence == 'emf_5') return 'EMF Level 5';
    if (evidence == 'orbs') return 'Ghost Orbs';
    if (evidence == 'fingerprints') return 'Fingerprints';
    if (evidence == 'freezing') return 'Freezing Temperatures';
    if (evidence == 'spirit_box') return 'Spirit Box';
}

function spinWheel() {
    document.querySelector('main').removeEventListener("click", spinWheel);
    document.onkeydown = '';
    let SpinTime = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--spin_speed').replaceAll('s', '000'));
    setTimeout(function () {
        document.onkeydown = function (key) {
            if (key.key == ' ') {
                HidePopUp();
            }
        }
    }, SpinTime);

    const wheel = document.querySelector('.wheel');
    if (wheel.classList.contains('spin')) return;
    var randomDegrees = Math.random() * 360;
    var Rotation = 3600 + randomDegrees;
    const WinningDegree = (1.5 * Math.PI) * (180 / Math.PI);
    var spinspeed = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--spin_speed').replaceAll('s', '000'));

    ghostSelection.forEach((ghost) => {
        info = ghostsInfo[ghost];
        var [lower, upper] = [info['lower_degree'] + randomDegrees, info['upper_degree'] + randomDegrees];

        if (lower > 360) {
            lower -= 360;
            upper -= 360;
        }

        if (lower != undefined) {
            if (WinningDegree > lower && WinningDegree < upper) {
                document.querySelector('.winning_ghost_text').innerHTML = `The winning ghost is ${ghost}!`;

                setTimeout(function () {
                    let PopUpElement = document.querySelector('.PopUp');
                    let SettingsElement = document.querySelector('.Settings');
                    let WinningGhost_Text = document.querySelector('.winning_ghost_text');
                    let Evidence_Div = document.querySelector('.winning_ghost_evidence');
                    WinningGhost_Text.style.display = 'block';
                    SettingsElement.style.display = 'none';
                    document.querySelector('.Winning_Ghost').style.display = 'flex';
                    PopUpElement.style.display = 'flex';
                    PopUpElement.onclick = HidePopUp;
                    PopUpElement.style.cursor = 'cursor';
                    Evidence_Div.style.display = 'flex';

                    let [Evidence1, Evidence2, Evidence3] = info['evidence'];
                    let [Evidence1Image, Evidence1Text] = Evidence_Div.querySelector('.evidence_1').children;
                    let [Evidence2Image, Evidence2Text] = Evidence_Div.querySelector('.evidence_2').children;
                    let [Evidence3Image, Evidence3Text] = Evidence_Div.querySelector('.evidence_3').children;

                    Evidence1Image.src = `./images/evidence/${Evidence1}.webp`;
                    Evidence1Text.innerHTML = TranslateEvidence(Evidence1);
                    Evidence2Image.src = `./images/evidence/${Evidence2}.webp`;
                    Evidence2Text.innerHTML = TranslateEvidence(Evidence2);
                    Evidence3Image.src = `./images/evidence/${Evidence3}.webp`;
                    Evidence3Text.innerHTML = TranslateEvidence(Evidence3);

                    //if the ghost is The Mimic, show the forced orbs.
                    let Evidence_Orbs = Evidence_Div.querySelector('.orbs');
                    if (ghost == 'The Mimic') {
                        Evidence_Orbs.style.display = 'block';
                    }
                    else {
                        Evidence_Orbs.style.display = 'none';
                    }

                }, spinspeed);
            }
        }
    });
    changeToPosition(Rotation);
    wheel.classList.remove('rotate');
    wheel.classList.add('spin');
}

function HidePopUp() {
    document.querySelector('.PopUp').style.display = 'none';
    const wheel = document.querySelector('.wheel');
    generateWheel(ghostSelection);
    wheel.classList.add('rotate');
    wheel.classList.remove('spin');
    setTimeout(function () {
        document.querySelector('main').addEventListener("click", function () {
            //Check what element the mouse has clicked:
            let clickedElement = document.elementFromPoint(mouseX, mouseY);
            if (clickedElement.classList.contains('triggers_wheel')) {
                spinWheel();
            }
        });
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
    let WinningGhost_Text = document.querySelector('.Winning_Ghost');
    let evidence_popup = document.querySelector('.Select_Evidence')
    evidence_popup.style.display = 'none';
    WinningGhost_Text.style.display = 'none';
    SettingsElement.style.display = 'flex';
    PopUpElement.style.display = 'flex';

    PopUpElement.onclick = function (event) {
        //set to only close the popup if the background (.PopUp) is clicked.
        if (event.target != event.currentTarget) return;
        HidePopUp();
    };

    //Clear the event listeners.
    document.querySelector('main').removeEventListener("click", spinWheel);
    PopUpContentElement.onclick = '';
    WinningGhost_Text.onclick = '';
    document.onkeydown = function (key) {
        if (key.key == ' ') {
        }
    }

    PopUpElement.style.cursor = 'default';
    let tableElement = SettingsElement.querySelector('table');
    let template = tableElement.querySelector('.template');
    template.style.display = 'table-row'

    //Clear the table except the template.
    while (tableElement.children.length > 1) {
        tableElement.removeChild(tableElement.lastChild);
    }

    for (let [ghost, info] of Object.entries(ghostsInfo)) {
        let duped_element = template.cloneNode(true);
        ghost = ghost.trim();
        duped_element.querySelector('.ghost_name').value = ghost.replaceAll('_', ' ');
        duped_element.querySelector('.ghost_name').placeholder = ghost.replaceAll('_', ' ');
        duped_element.querySelector('.ghost_name').addEventListener('change', function () {
            CheckForChanges('.' + ghost.replaceAll(' ', '_'), '.ghost_name')
        });

        duped_element.querySelector('.ghost_color').value = info['color'];
        duped_element.querySelector('.text_color').value = info['text_color'];
        duped_element.querySelector('.evidence_popup').addEventListener('click', function () {
            show_evidence(ghost)
        });
        duped_element.querySelector('.remove_ghost').addEventListener('click', function () {
            remove_ghost(ghost);
        });

        duped_element.classList.add(ghost.trim().replaceAll(' ', '_')); //Classnames can't have spaces in them.
        duped_element.classList.remove('template');
        duped_element.style.display = 'table-row';

        if (ghost.includes('New Ghost')) {
            duped_element.querySelector('.ghost_name').style.backgroundColor = 'var(--accent_color)';
            duped_element.querySelector('.ghost_name').classList.add("changedValue");
        }

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

    let TimeSliderElement = PopUpElement.querySelector('.TimeSlider');
    TimeSliderElement.oninput = function () {
        TimeSliderElement.parentElement.querySelector('p').innerHTML = `${TimeSliderElement.value}s`;
    };
    let SpinTime = RootElement.getPropertyValue('--spin_speed');
    TimeSliderElement.value = parseInt(SpinTime);
    TimeSliderElement.parentElement.querySelector('p').innerHTML = `${TimeSliderElement.value}s`;

    ghostsInfoTemp = ghostsInfo;
}

function SaveSettings() {
    let PopUpContentElement = document.querySelector('.PopUpContent');
    let SettingsElement = document.querySelector('.Settings');

    let RootElement = getComputedStyle(document.documentElement);
    let main_color = RootElement.getPropertyValue('--main_color');
    let secondary_color = RootElement.getPropertyValue('--secondary_color');
    let accent_color = RootElement.getPropertyValue('--accent_color');
    let accent_color_negative = RootElement.getPropertyValue('--accent_color_negative');
    let text_color = RootElement.getPropertyValue('--text_color');
    let background_color = RootElement.getPropertyValue('--background_color');
    let SpinTime = RootElement.getPropertyValue('--spin_speed');

    const confirmElement = document.querySelector('.ConfirmSelectionPopUp');
    confirmElement.querySelector('h3').innerHTML = `Are you sure you want to apply the new settings?`;
    confirmElement.querySelector('p').innerHTML = "If you do, you'll need to save the new settings with the Save button in the top right corner";

    confirmElement.querySelector('.SelectionConfirm').onclick = function () {
        //Page settings:
        let main_color_picked = document.querySelector('.main_color').value;
        let secondary_color_picked = document.querySelector('.secondary_color').value;
        let accent_color_picked = document.querySelector('.accent_color').value;
        let accent_color_negative_picked = document.querySelector('.accent_color_negative').value;
        let text_color_picked = document.getElementsByClassName('text_color color_picker')[0].value;
        let background_color_picked = document.querySelector('.background_color').value;
        let TimeSliderElement = PopUpContentElement.querySelector('.TimeSlider');

        let RootElement = document.documentElement.style;
        if (main_color.toLowerCase() != main_color_picked.toLowerCase()) {
            RootElement.setProperty('--main_color', main_color_picked);
        }

        if (secondary_color.toLowerCase() != secondary_color_picked.toLowerCase()) {
            RootElement.setProperty('--secondary_color', secondary_color_picked);
        }
        if (accent_color.toLowerCase() != accent_color_picked.toLowerCase()) {
            RootElement.setProperty('--accent_color', accent_color_picked);
        }
        if (accent_color_negative.toLowerCase() != accent_color_negative_picked.toLowerCase()) {
            RootElement.setProperty('--accent_color_negative', accent_color_negative_picked);
        }
        if (text_color.toLowerCase() != text_color_picked.toLowerCase()) {
            RootElement.setProperty('--text_color', text_color_picked);
        }
        if (background_color.toLowerCase() != background_color_picked.toLowerCase()) {
            RootElement.setProperty('--background_color', background_color_picked);
        }
        if (SpinTime != TimeSliderElement.value) {
            RootElement.setProperty('--spin_speed', `${TimeSliderElement.value}s`);
        }


        //Ghost stuff:
        for (let [ghost, data] of Object.entries(ghostsInfo)) {
            let ghostElement = SettingsElement.querySelector('.' + ghost.replaceAll(' ', '_'));
            let ghostNameElement = ghostElement.querySelector('.ghost_name');
            let ghostColorElement = ghostElement.querySelector('.ghost_color');
            let textColorElement = ghostElement.querySelector('.text_color');
            let ghostName = ghostNameElement.value;
            let ghostColor = ghostColorElement.value;
            let textColor = textColorElement.value;
            let ghostColorStored = data['color'];
            let textColorStored = data['text_color'];

            if (ghostColorStored.toLowerCase() != ghostColor.toLowerCase()) {
                ghostsInfo[ghost]['color'] = ghostColor;
            }

            if (textColorStored.toLowerCase() != textColor.toLowerCase()) {
                ghostsInfo[ghost]['text_color'] = textColor;
            }

            if (ghost != ghostName) {
                ghostName = ghostName.trim();
                //Finally, if the ghost name is different replace the whole array at the olds array index, 
                // this way it will be easier for the user to spot changes they made

                //Write the new ghost data to an array while copying over the winning degrees.
                let NewGhost = { [ghostName]: { color: ghostColor, text_color: textColor, lower_degree: data['lower_degree'], upper_degree: data['upper_degree'] } };

                //find the index of the old ghost data.
                const indexToReplace = Object.keys(ghostsInfo).indexOf(ghost);

                if (indexToReplace !== -1) {
                    //When found, delete the old entry
                    const ghostsArray = Object.entries(ghostsInfo);
                    ghostsArray.splice(indexToReplace, 1);

                    //Put the new ghost data to the old ghost index.
                    const newGhostEntry = Object.entries(NewGhost)[0];
                    ghostsArray.splice(indexToReplace, 0, newGhostEntry);

                    // Convert back to an object
                    const newGhostsInfo = Object.fromEntries(ghostsArray);

                    // Update the ghostsInfo with the new data
                    ghostsInfo = newGhostsInfo;
                }

                //replace the ghostSelection names
                const indexToReplaceSelection = ghostSelection.indexOf(ghost);

                if (indexToReplaceSelection !== -1) {
                    // Step 2: Replace the ghost at the found index with the new ghost
                    ghostSelection.splice(indexToReplace, 1, ghostName);
                }
            }
        }
        HidePopUp();
        changesettings();
        document.querySelector('.Settings').scrollTop = 0;
        document.querySelector('.')
        confirmElement.style.display = 'none';
        setTimeout(function () { generateWheel(ghostSelection) }, 200);
    }
    //Read function remove_ghost() for an documentation for this part.
    confirmElement.querySelector('.SelectionCancel').onclick = function () {
        confirmElement.style.display = 'none';
    }
    confirmElement.style.display = 'flex';
    confirmElement.style.left = `${mouseX - (confirmElement.clientWidth / 1.9)}px`;
    confirmElement.style.top = `${mouseY - (confirmElement.clientHeight)}px`;
}

function show_evidence(ghost) {
    let evidence_popup = document.querySelector('.Select_Evidence');
    let evidence_info = evidence_popup.querySelector('.Current_Evidence');
    evidence_popup.querySelector('h1').innerHTML = `Select the evidence for ${ghost}`;

    let [Current_Evidence_1, Current_Evidence_2, Current_Evidence_3] = ghostsInfo[ghost]['evidence'];
    let evidence_1 = evidence_info.querySelector('.evidence_1');
    let evidence_2 = evidence_info.querySelector('.evidence_2');
    let evidence_3 = evidence_info.querySelector('.evidence_3');
    let evidence_select_1 = evidence_1.querySelector('.evidence_select');
    let evidence_select_2 = evidence_2.querySelector('.evidence_select');
    let evidence_select_3 = evidence_3.querySelector('.evidence_select');

    evidence_select_1.value = Current_Evidence_1;
    evidence_select_2.value = Current_Evidence_2;
    evidence_select_3.value = Current_Evidence_3;

    evidence_1.style.backgroundColor = 'var(--main_color)';
    evidence_2.style.backgroundColor = 'var(--main_color)';
    evidence_3.style.backgroundColor = 'var(--main_color)';

    evidence_1.querySelector('img').src = `./images/evidence/${Current_Evidence_1}.webp`;
    evidence_2.querySelector('img').src = `./images/evidence/${Current_Evidence_2}.webp`;
    evidence_3.querySelector('img').src = `./images/evidence/${Current_Evidence_3}.webp`;


    evidence_popup.style.display = 'flex';
    let [confirm_button, cancel_button] = document.querySelector('.Confirm_Evidence').children;
    confirm_button.onclick = function () {
        let evidence_selection = [evidence_select_1.value, evidence_select_2.value, evidence_select_3.value];
        ghostsInfoTemp[ghost]['evidence'] = evidence_selection;
        evidence_popup.style.display = 'none';
        //Chage the evidence_popup button color to let the user know something here was changed
        let showEvidence_button = document.querySelector('.' + ghost.replaceAll(' ', '_')).querySelector('.evidence_popup');
        showEvidence_button.style.border = '5px solid var(--secondary_color)'; //Change the borders color to the variable
        showEvidence_button.style.padding = '5px'; //Reduce the padding size so that the button won't get bigger and move everything.
    }
    cancel_button.onclick = function () {
        evidence_popup.style.display = 'none';
    }
}

function UpdateEvidence(evidence_id) {
    let evidence_popup = document.querySelector('.Select_Evidence');
    let evidence_info = evidence_popup.querySelector('.Current_Evidence');
    let ghost_name = evidence_popup.querySelector('h1').innerHTML.split('for')[1].trim();
    let [Current_Evidence_1, Current_Evidence_2, Current_Evidence_3] = ghostsInfo[ghost_name]['evidence'];

    let evidence_1_div = evidence_info.querySelector('.evidence_1');
    let evidence_2_div = evidence_info.querySelector('.evidence_2');
    let evidence_3_div = evidence_info.querySelector('.evidence_3');
    let evidence_select_1 = evidence_1_div.querySelector('.evidence_select');
    let evidence_select_2 = evidence_2_div.querySelector('.evidence_select');
    let evidence_select_3 = evidence_3_div.querySelector('.evidence_select');

    let [evidence_1, evidence_2, evidence_3] = [evidence_select_1.value, evidence_select_2.value, evidence_select_3.value];

    //Checks for each evidence_id if it's a duplicate with the other evidences that are currently selected.
    if (evidence_id == 1) {
        if (evidence_1 == evidence_2 || evidence_1 == evidence_3) {
            evidence_1_div.style.backgroundColor = 'var(--main_color)';
            evidence_select_1.value = Current_Evidence_1;
        }
        else {
            evidence_1_div.style.backgroundColor = 'var(--accent_color)';
            evidence_1_div.querySelector('img').src = `./images/evidence/${evidence_select_1.value}.webp`;
        }

    }
    else if (evidence_id == 2) {
        if (evidence_2 == evidence_1 || evidence_2 == evidence_3) {
            evidence_2_div.style.backgroundColor = 'var(--main_color)';
            evidence_select_2.value = Current_Evidence_2;
        }

        else {
            evidence_2_div.style.backgroundColor = 'var(--accent_color)';
            evidence_2_div.querySelector('img').src = `./images/evidence/${evidence_select_2.value}.webp`;
        }
    }
    else if (evidence_id == 3) {
        if (evidence_3 == evidence_1 || evidence_3 == evidence_2) {
            evidence_3_div.style.backgroundColor = 'var(--main_color)';
            evidence_select_3.value = Current_Evidence_3;
        }

        else {
            evidence_3_div.style.backgroundColor = 'var(--accent_color)';
            evidence_3_div.querySelector('img').src = `./images/evidence/${evidence_select_3.value}.webp`;
        }
    }
}

function remove_ghost(ghost) {
    const confirmElement = document.querySelector('.ConfirmSelectionPopUp');
    confirmElement.querySelector('h3').innerHTML = `Are you sure you want to delete ${ghost} from storage?`;
    confirmElement.querySelector('p').innerHTML = `This instantly deletes the ghost from local storage.`;
    confirmElement.querySelector('.SelectionConfirm').onclick = function () {
        //Removes a ghost from the ghostInfo object and stores that new object to storage
        delete ghostsInfo[ghost];

        //Delete the ghost from selection:
        //Get the index of the ghost name in the selection.
        let IndexToDelete = ghostSelection.indexOf(ghost);
        ghostSelection.splice(IndexToDelete, IndexToDelete); //Splices from the same index as the to index.

        localStorage.setItem('ghosts', JSON.stringify(ghostsInfo));
        let scrollPosition = document.querySelector('.Settings').scrollTop;
        changesettings();
        document.querySelector('.Settings').scrollTop = scrollPosition;
        confirmElement.style.display = 'none';
    }
    confirmElement.querySelector('.SelectionCancel').onclick = function () {
        confirmElement.style.display = 'none';
    }
    //First, render the confirm box on the screen to get the dimensions of it.
    confirmElement.style.display = 'flex';
    //Now move the confirm box near the cursor, but a bit to the right side of the screen so that the user can't by accident click on a button.
    confirmElement.style.left = `${mouseX - (confirmElement.clientWidth / 2.5)}px`; //With a divison > 2, right of the cursor. <2, left of the cursor.
    confirmElement.style.top = `${mouseY - (confirmElement.clientHeight / 2)}px`; //The Y is centered on the mouse.
}

function add_ghost() {
    let ghostName = 'New Ghost';
    let iteration = 1;
    while (ghostsInfo[ghostName] != undefined) {
        ghostName = `New Ghost ${iteration}`;
        iteration += 1;
    }
    ghostsInfo[ghostName] = { color: '#FFFFFF', text_color: '#0f0000' };
    ghostSelection.push(ghostName);
    let scrollPosition = document.querySelector('.Settings').scrollTop;
    changesettings();
    document.querySelector('.Settings').scrollTop = scrollPosition;
}

function CheckForChanges(ParentClassName, ElementClassName) {
    //Checks if the value of the box is different from the default (placeholder) value, and shows a different color.
    let Element = document.querySelector(ParentClassName).querySelector(ElementClassName);
    if (Element.placeholder != Element.value) {
        Element.style.backgroundColor = 'var(--accent_color)';
        Element.classList.add("changedValue");
    } else {
        Element.style.backgroundColor = 'var(--secondary_color)';
        Element.classList.remove("changedValue");
    }

    if (Element.placeholder.includes("New Ghost") && Element.value.includes("New Ghost") == false) {
        Element.style.backgroundColor = 'var(--secondary_color)';
        Element.classList.remove("changedValue");
    }
}

function share() {
    WriteParameters();
    alert("Copy the complete URL to share your settings!");
}

function about() {
    window.open("https://github.com/Filipdominik/PhasmophobiaWheel");
}

function SaveSetup() {
    //Stores the changes made by the user to storage.
    localStorage.setItem('data', JSON.stringify(ghostsInfo));
    localStorage.setItem('selection', JSON.stringify(ghostSelection));

    let RootElement = getComputedStyle(document.documentElement);
    let main_color = RootElement.getPropertyValue('--main_color');
    let secondary_color = RootElement.getPropertyValue('--secondary_color');
    let accent_color = RootElement.getPropertyValue('--accent_color');
    let accent_color_negative = RootElement.getPropertyValue('--accent_color_negative');
    let text_color = RootElement.getPropertyValue('--text_color');
    let background_color = RootElement.getPropertyValue('--background_color');
    let SpinTime = RootElement.getPropertyValue('--spin_speed');
    let pageColors = { main_color, secondary_color, accent_color, accent_color_negative, text_color, background_color, SpinTime };
    localStorage.setItem('pageColors', JSON.stringify(pageColors));

    //Show PopUp for 2 seconds to let the user know their settings were saved.
    let PopUpElement = document.querySelector('.PopUp');
    let SettingsElement = document.querySelector('.Settings');
    let WinningGhost_Text = document.querySelector('.winning_ghost_text');
    WinningGhost_Text.style.display = 'block';
    WinningGhost_Text.innerHTML = 'Settings saved!';
    WinningGhost_Text.parentElement.querySelector('.winning_ghost_evidence').style.display = 'none';
    SettingsElement.style.display = 'none';
    PopUpElement.style.display = 'flex';
    PopUpElement.onclick = HidePopUp;
    PopUpElement.style.cursor = 'cursor';
    setTimeout(function () {
        HidePopUp();
    }, 2000);
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
        console.log("Loaded from URL");
        let [data, selection] = ReadParameters();
        ghostsInfo = JSON.parse(data);
        ghostSelection = JSON.parse(selection);
        generateWheel(ghostSelection);
    } else {
        //Attempt to load ghostSelection from storage:
        ghostSelectionText = localStorage.getItem('selection');
        if (typeof (ghostSelectionText) != "string") {
            console.log("Loaded new");
            ghostsInfo = loadGhostTypes();
            generateWheel(['Banshee', 'Demon', 'Deogen', 'Goryo', 'Hantu', 'Jinn', 'Mare', 'Moroi', 'Myling', 'Obake', 'Oni', 'Onryo', 'Phantom', 'Poltergeist', 'Raiju', 'Revenant', 'Shade', 'Spirit', 'Thaye', 'The Mimic', 'The Twins', 'Wraith', 'Yokai', 'Yurei']);
        }
        else {
            //Load the ghostInfo from storage
            let ghostInfoText = localStorage.getItem('data');
            if (typeof (ghostInfoText) != 'string') {
                ghostsInfo = loadGhostTypes();
            }
            else {
                ghostsInfo = JSON.parse(ghostInfoText);
            }
            console.log("Loaded from storage");
            ghostSelection = JSON.parse(ghostSelectionText);
            generateWheel(ghostSelection);
        }
    }

    document.querySelector('main').addEventListener("click", function (event) {
        //Check what element the mouse has clicked:
        let clickedElement = document.elementFromPoint(mouseX, mouseY);
        if (clickedElement.classList.contains('triggers_wheel')) {
            spinWheel();
        }
    });

    document.onkeydown = function (key) {
        if (key.key == ' ') {
            spinWheel();
        }
    }

    window.onmousemove = function (event) {
        //For the confirm box inside of the PopUp.
        mouseX = event.clientX;
        mouseY = event.clientY;
    }

    //Load colors from storage, if it exits.
    let storedColors = localStorage.getItem('pageColors');
    if (typeof (storedColors) == 'string') {
        let parsedColors = JSON.parse(storedColors);
        let RootElement = document.documentElement.style;
        RootElement.setProperty('--main_color', parsedColors['main_color']);
        RootElement.setProperty('--secondary_color', parsedColors['secondary_color']);
        RootElement.setProperty('--accent_color', parsedColors['accent_color']);
        RootElement.setProperty('--accent_color_negative', parsedColors['accent_color_negative']);
        RootElement.setProperty('--text_color', parsedColors['text_color']);
        RootElement.setProperty('--background_color', parsedColors['background_color']);
        RootElement.setProperty('--spin_speed', parsedColors['SpinTime']);
    }

    document.querySelector('.saveBTN').onclick = SaveSetup;
    document.querySelector('.shareBTN').onclick = share;
    document.querySelector('.aboutBTN').onclick = about;
    document.querySelector('.resetBTN').onclick = reset;
    document.querySelector('.settingsBTN').onclick = changesettings;
    selectGhosts();
};