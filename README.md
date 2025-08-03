# Image Hider Chrome Extension

This extension allows you to hide specific images on any website. Rules are saved per-domain.

## Features

*   **Hide Images:** Right-click on any image and select "Auto-hide this image on this site" to hide it. The image will be hidden on all pages of that website.
*   **Manage Rules:** A popup allows you to view and remove hiding rules for each domain.
*   **Toggle Auto-Hide:** You can temporarily disable or enable the auto-hiding functionality for the current tab. This setting resets when you close the tab.
*   **Restore Images:** Restore all images hidden by this extension on the current page.

## Installation

1.  Open Chrome and navigate to `chrome://extensions`.
2.  Enable "Developer mode" by clicking the toggle switch at the top right.
3.  Click the "Load unpacked" button and select the directory where you have this code.

## How to Use

1.  **Hide an image:**
    *   Right-click on the image you want to hide.
    *   Select "Auto-hide this image on this site" from the context menu.
3.  **Manage hidden images:**
    *   Click on the extension icon in the Chrome toolbar to open the popup.
    *   Here you can see all the rules you've created, grouped by website.
    *   Click the "Remove" button next to a filename to un-hide that image.
    *   Click the "Clear All Rules" button to remove all hiding rules.
4.  **Toggle auto-hiding:**
    *   Right-click anywhere on a page.
    *   Select "Toggle auto-hide on this page". This will disable or re-enable image hiding for the current tab only.
5.  **Restore hidden images:**
    *   Right-click anywhere on a page.
    *   Select "Restore hidden images (this page)".

## Files

*   `manifest.json`: Defines the extension's configuration, permissions, and files.
*   `background.js`: Manages the context menu and handles events.
*   `content.js`: Injects code into web pages to hide the images based on the saved rules.
*   `popup.html`: The HTML for the popup window.
*   `popup.js`: The JavaScript for the popup window, which handles displaying and managing the rules.
*   `popup.css`: The CSS for styling the popup window.
*   `icons/`: Contains the extension's icons.