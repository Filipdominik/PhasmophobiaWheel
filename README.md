# Phasmophobia Ghost Casino (Version 1.1)

This web-based program allows you to select certain evidence or ghosts and spin a wheel to randomly choose a ghost. The project was inspired by Insym's Ghost Casino series. Please note that version 1.0.0 was developed within a week, so expect bugs, and kindly report them.

## Features:
- Spin the wheel to get a random ghost.
- The winning ghost is displayed on the screen along with its related evidence.
- Customize the evidence and colors for each ghost on the wheel.
- Customize the colors on the page.
- Filter ghosts by their evidence.
- Setup sharing: Share the ghosts stored locally, the ghosts on the wheel, and their colors.

# How to use the app:
## Launch it:
To use the app, visit this page: https://filipdominik.github.io/PhasmophobiaWheel/
Alternatively, download all the files and run it locally.

## Quick start:
After starting the app for the first time, all ghosts are selected automatically. As there are more cases where you'll need to deselect ghosts than select them all.\
I tried to make this program as intuitive as possible for all users.

## Buttons:
- **Reset Page:** Quickly reset the page to default settings.
- **Select Ghosts** Read [Select Ghosts](#select-ghosts)
- **Change Settings:** Opens a menu to modify the page's settings and stored ghosts. Refer to the [Settings](#settings) section for more information.
- **Share:** Share the current ghost setup with a link. If the app is hosted locally, remove the http://127.0.0.1:5500/(index.html) part and share the data starting with */?* to your friend.
- **Save Setup:** Stores the current ghost settings and page settings in the browser's storage.
- **About & Credits:** Redirects to this page.

## Settings:
In the settings menu, you can change ghost information, remove ghosts, customize the page's theme colors, and adjust the time it takes for the wheel to spin.

**Ghost settings:** 
- **Ghost name:** Change the ghost's name to something else.
- **Color:** Customize the ghost's color on the wheel.
- **Text Color:** Customize the text color that displays the ghost's name on the wheel.
- **Change Evidence:** Opens a new window where you can modify the ghost's evidence. Currently, only The Twins are hardcoded to show orbs.
- **Remove Ghost:** Removes the ghost and prompts the user to confirm the action.

Any changes made to the ghost, except removing it, will require confirmation by pressing the Save button at the bottom of the settings window.

## Select Ghosts:
This window is seperated into two segments; Evidence and Ghost Selection\
In the evidence part you can select the evidence to filter out ghosts, this is the same as in Phasmophobia, even the lay-out is the same for the individuals that have muscle-memory.\
When you press on an evidence item, the ghost that are falling under that filter get a border of the accent color.\
When an item is selected, either evidence or a ghost. They turn into the secondary color. Which is by default the darker color.

## Issues:
If you encounter an issue, please report it along with the following basic information:
- If the issue occurred after changing the ghosts' names or evidence:
  - **The share link** (if not working, open the console and share the dict **ghostsInfo** and **ghostSelection**)
  - **Event description** describing what you did before the issue occurred and your thoughts on the possible cause.

## Recommendations and Contributing:
If you'd like to contribute to this project, please feel free to do so! You can open an issue and tag it with enhancements, describing what you want in detail. This will help me or any other contributors create the feature you desire.

If you want to contribute, just do your best. I'm a beginner with HTML5 and JavaScript. You can also review the code and suggest improvements.

## Read this about future-proofing:
In case new ghosts are added to the game and I no longer have access to this repo, you can change the ghosts array in the function **function loadGhostTypes()** to match the new ghosts. After that, press the **Reset Page** button to get the newest version.

### Credits:
Evidence image credit to https://phasmophobia.fandom.com/wiki/Evidence
