# Phasmophobia Ghost Casino (Version 1.4.8)

Phasmophobia Ghost Casino is a web-based program that allows you to select certain evidence or ghosts and spin a wheel to randomly choose a ghost. The project was inspired by Insym's Ghost Casino series. Please note that version 1.0.0 was developed within a week, so expect bugs, and kindly report them.

# How to use the app:

## Launch it:

To use the app, visit this page: https://filipdominik.github.io/PhasmophobiaWheel/

Alternatively, download all the files and run it locally.

## Quick start:

After starting the app for the first time, all ghosts are selected automatically. As there are more cases where you'll need to deselect ghosts than select them all, the program is designed to be intuitive for all users.

### Buttons Legend:

![selectdunfil](https://github.com/Filipdominik/PhasmophobiaWheel/assets/57330830/2b19a14a-084f-4e78-90ea-c1df70864bb0)
![desel filtered applied](https://github.com/Filipdominik/PhasmophobiaWheel/assets/57330830/bc4d3c03-9cad-46e4-9bc6-53ec52675b3f)
![selunfilter](https://github.com/Filipdominik/PhasmophobiaWheel/assets/57330830/c6dfaac2-bdca-4db2-972a-35c948c7dd6f)
![desel unfiltered](https://github.com/Filipdominik/PhasmophobiaWheel/assets/57330830/3789c382-83e9-4848-aad1-717962a9767a)

## Buttons:

- **Reset Page:** Quickly reset the page to default settings.
- **Select Ghosts:** Read [Select Ghosts](#select-ghosts)
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

### Page colors:

Change the individual colors of the page, as it is drawn dynamically.

- **Main Color:** This is the color for the more common stuff and deselected items.
- **Secondary Color:** This is the color for the least common items and selected items.
- **Accent Color:** This is the color of buttons and filtered items.
- **Text Color:** This is the color of the text on the page.
- **Background Color:** This is the color of the background.
- **Revert Color:** Reverts the color of this element to the previously saved color.

Any changes made to the ghost, except removing it, will require confirmation by pressing the Save button at the bottom of the settings window.

## Select Ghosts:

This window is divided into two segments: Evidence and Ghost Selection.

**Evidence Part:** In this section, you can choose the evidence to filter out ghosts. It works the same way as in Phasmophobia, and even the layout is familiar to those with muscle memory. When you click on an evidence item, the ghosts that match that filter will be highlighted with the accent color border.

**Selection Indicator:** When you select an item, whether it's evidence or a ghost, it will be displayed with the secondary color. By default, the secondary color is a darker shade.

## Features:

- Spin the wheel to get a random ghost.
- The winning ghost is displayed on the screen along with its related evidence.
- Customize the evidence and colors for each ghost on the wheel.
- Customize the colors on the page.
- Filter ghosts by their evidence.
- Setup sharing: Share the ghosts stored locally, the ghosts on the wheel, and their colors.

## Issues:

If you encounter an issue, please report it along with the following basic information:

**If you're using an ad-blocker, it can cause issues with ghost selection.**

- If the issue occurred after changing the ghosts' names or evidence:
  - **The share link** (if not working, open the console and share the dict **ghostsInfo** and **ghostSelection**)
  - **Event description:** Describe what you did before the issue occurred and your thoughts on the possible cause.

- If it is related to something else:
  - **Event description:** Describe as precisely as you can what led to the issue that you're experiencing. I know this can be difficult, please don't be deterred by trying to go over the top with your description.

## Recommendations and Contributing:

If you'd like to contribute to this project, please feel free to do so! You can open an issue and tag it with enhancements, describing what you want in detail. This will help me or any other contributors create the feature you desire.

If you want to contribute, just do your best. I'm a beginner with HTML5 and JavaScript. You can also review the code and suggest improvements.

## Read this about future-proofing:

In case new ghosts are added to the game and I no longer have access to this repo, you can change the ghosts array in the function **function loadGhostTypes()** to match the new ghosts. After that, press the **Reset Page** button to get the newest version.

### Credits:

Evidence image credit to [Phasmophobia Wiki - Evidence](https://phasmophobia.fandom.com/wiki/Evidence)
