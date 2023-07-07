import {languageColors} from './languageColors.js';

// Config
// Dimensions
const width = 400;
const height = 120;

// Positioning of the elements
const firstRowY = height * 0.23; // y-coordinate of the first row
const secondRowY = height * 0.45; // y-coordinate of the second row
const thirdRowY = height * 0.75; // y-coordinate of the third row

// Description
const maxRowLength = Math.floor(width * 0.20); // maximum number of characters in a row
const maxLines = 3; // maximum number of lines in the description
const fontSize = 10; // font size of the description
const lineHeight = 15; // line height of the description

export function generateErrorSVG(errorMessage) {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" >
            <rect x="0" y="0" width="${width}" height="${height}" fill="#fff" stroke="#eaecef" stroke-width="2"></rect>
            <text x="20" y="60" font-family="sans-serif" font-size="14" fill="#333">${errorMessage}</text>
        </svg>`;
}

export function generateSVG(data, backgroundColor, titleColor, textColor, iconColor) {

    console.log("Colors: ", backgroundColor, titleColor, textColor, iconColor);

    const finalBackgroundColor = "#" + backgroundColor;
    const finalTitleColor = "#" + titleColor;
    const finalTextColor = "#" + textColor;
    const finalIconColor = "#" + iconColor;

    console.log("Final Colors: ", finalBackgroundColor, finalTitleColor, finalTextColor, finalIconColor);


    const descriptionLines = splitText(data.description || '', maxRowLength);
    const repoIcon = generateRepoIcon(finalIconColor);
    const header = generateHeader(data.name, data.html_url, finalTitleColor);
    const starSection = generateStarSection(data.stargazers_count, data.html_url, finalTextColor, finalIconColor);
    const descriptionSection = generateDescriptionSection(descriptionLines, finalTextColor);
    const languageSection = generateLanguageSection(data.language, finalTextColor);
    const forksSection = generateForksSection(data.forks_count, data.html_url, finalTextColor, finalIconColor);

    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
            <rect x="0" y="0" width="100%" height="100%" fill="${finalBackgroundColor}" stroke="#eaecef" stroke-width="2"></rect>
            ${repoIcon}
            ${header}
            ${starSection}
            ${languageSection}
            ${forksSection}
            ${descriptionSection}
        </svg>`;
}

function generateRepoIcon(iconColor) {
    // Size and position relative to the canvas
    const iconSize = width * 0.0035;
    const iconPositionX = width * 0.05;
    const iconPositionY = height * 0.1;

    return `
<g fill="${iconColor}" transform="translate(${iconPositionX}, ${iconPositionY}) scale(${iconSize})">
    <path fill-rule="evenodd" d="M4,9 L3,9 L3,8 L4,8 L4,9 M4,6 L3,6 L3,7 L4,7 L4,6 M4,4 L3,4 L3,5 L4,5 L4,4 M4,2 L3,2 L3,3 L4,3 L4,2 M12,1 L12,13 C12,13.55 11.55,14 11,14 L6,14 L6,16 L4.5,14.5 L3,16 L3,14 L1,14 C0.45,14 0,13.55 0,13 L0,1 C0,0.45 0.45,0 1,0 L11,0 C11.55,0 12,0.45 12,1 M11,11 L1,11 L1,13 L3,13 L3,12 L6,12 L6,13 L11,13 L11,11 M11,1 L2,1 L2,10 L11,10 L11,1"></path>
</g>`;
}

function generateHeader(repoName, repoUrl, titleColor) {
    // Position relative to the canvas
    const positionX = width * 0.12;

    return `
<g fill="#0366d6" transform="translate(${positionX}, ${firstRowY})">
    <a target="_blank" href="${repoUrl}">
        <text font-family="sans-serif" font-size="16" font-weight="600" fill="${titleColor}">${repoName}</text>
    </a>
</g>`;
}

function generateDescriptionSection(descriptionLines, textColor) {
    // Slicing the description lines to maxLines
    const lines = descriptionLines.slice(0, maxLines);
    if (descriptionLines.length > maxLines) {
        const lastLine = lines[maxLines - 1];
        lines[maxLines - 1] = lastLine.substring(0, lastLine.length - 3) + '...';
    }
    return lines.map((line, index) => `<text x="17" y="${secondRowY + index * lineHeight}" font-family="sans-serif" font-size="${fontSize}"  fill="${textColor}">${line}</text>`).join('');
}

function generateLanguageSection(language, textColor) {
    const languageLength = (language || '').length * 6; // Approximation
    const positionX = Math.min(33, 450 - languageLength - 10); // 10 as margin
    const color = languageColors[language] || '#000';

    return `
<g transform="translate(${positionX}, ${thirdRowY + 11})">
    <circle cx="-10" cy="0" r="7" fill="${color}"></circle>
    <text x="0" y="4" font-family="sans-serif" font-size="12" fill="${textColor}">${language}</text>
</g>`;
}

function generateStarSection(stargazersCount, repoUrl, textColor, iconColor) {
    // Position relative to the canvas
    const positionX = width * 0.75;

    return `
<g transform="translate(${positionX}, ${thirdRowY + 16})"> <!-- Adjusted the x-coordinate -->
    <a target="_blank" href="${repoUrl}/stargazers">
        <text x="0" y="0" font-family="sans-serif" font-size="12" fill="${iconColor}">★</text>
        <text x="13" y="0" font-family="sans-serif" font-size="12" fill="${textColor}">${stargazersCount}</text>
    </a>
</g>`;
}

function generateForksSection(forksCount, repoUrl, textColor, iconColor) {
    // Position relative to the canvas
    const positionX = width * 0.9;

    return `
<g transform="translate(${positionX}, ${thirdRowY})"> <!-- Adjusted the x-coordinate -->
    <a target="_blank" href="${repoUrl}/network/members">
        <svg width="14" height="20" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 5C7 3.89543 7.89543 3 9 3C10.1046 3 11 3.89543 11 5C11 5.74028 10.5978 6.38663 10 6.73244V14.0396H11.7915C12.8961 14.0396 13.7915 13.1441 13.7915 12.0396V10.7838C13.1823 10.4411 12.7708 9.78837 12.7708 9.03955C12.7708 7.93498 13.6662 7.03955 14.7708 7.03955C15.8753 7.03955 16.7708 7.93498 16.7708 9.03955C16.7708 9.77123 16.3778 10.4111 15.7915 10.7598V12.0396C15.7915 14.2487 14.0006 16.0396 11.7915 16.0396H10V17.2676C10.5978 17.6134 11 18.2597 11 19C11 20.1046 10.1046 21 9 21C7.89543 21 7 20.1046 7 19C7 18.2597 7.4022 17.6134 8 17.2676V6.73244C7.4022 6.38663 7 5.74028 7 5Z" fill="${iconColor}"/>
        </svg>
        <text x="16" y="16" font-family="sans-serif" font-size="12" fill="${textColor}">${forksCount}</text>
    </a>
</g>`;
}

function splitText(text, maxLineLength) {
    // Splits the text into lines with maxLineLength
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
        if ((currentLine + word).length > maxLineLength) {
            lines.push(currentLine.trim());
            currentLine = '';
        }
        currentLine += `${word} `;
    }

    if (currentLine.trim()) lines.push(currentLine.trim());
    return lines;
}