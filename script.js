// Wait for the HTML DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Data Store ---
    // Array of objects holding the parable data.
    // NOTE: Parable texts are shortened for this POC. Full versions would be longer.
    const parableData = [
        {
            id: 0,
            title: "The Sower",
            text: "A farmer went out to sow his seed. As he was scattering the seed, some fell along the path, and the birds came and ate it up. Some fell on rocky places... Other seed fell among thorns... Still other seed fell on good soil, where it produced a crop—a hundred, sixty or thirty times what was sown. (Matthew 13:3-9 excerpt)",
            explanation: "This story uses a farmer scattering seeds to represent teaching God's message. The different types of soil show how people respond differently depending on their hearts and circumstances."
        },
        {
            id: 1,
            title: "The Good Samaritan",
            text: "Jesus said: 'A man was going down from Jerusalem to Jericho, when he was attacked by robbers... A priest happened to be going down the same road, and... passed by on the other side. So too, a Levite... But a Samaritan... took pity on him... went to him and bandaged his wounds... Which of these three do you think was a neighbor to the man...?' (Luke 10:30-37 excerpt)",
            explanation: "This story answers 'Who is my neighbor?'. It teaches that loving your neighbor means showing compassion and helping anyone in need, regardless of their background or social standing."
        },
        {
            id: 2,
            title: "The Prodigal Son",
            text: "'There was a man who had two sons. The younger one said to his father, 'Father, give me my share of the estate.'... he set off for a distant country and there squandered his wealth... But while he was still a long way off, his father saw him and was filled with compassion for him; he ran to his son, threw his arms around him and kissed him... 'For this son of mine was dead and is alive again; he was lost and is found.' So they began to celebrate. (Luke 15:11-32 excerpt)",
            explanation: "This story illustrates God's immense joy and willingness to forgive and welcome back those who have strayed (sinned) but then turn back to Him with repentance."
        },
        {
            id: 3,
            title: "The Mustard Seed",
            text: "He told them another parable: 'The kingdom of heaven is like a mustard seed, which a man took and planted in his field. Though it is the smallest of all seeds, yet when it grows, it is the largest of garden plants and becomes a tree, so that the birds come and perch in its branches.' (Matthew 13:31-32)",
            explanation: "This parable compares the Kingdom of God to a tiny mustard seed that grows into a large tree. It shows that God's kingdom starts small but will grow to become unexpectedly large and significant."
        }
    ];

    // --- 2. DOM Element References ---
    // Get references to the HTML elements we need to interact with.
    const parableListContainer = document.getElementById('parable-list');
    const parableTextDisplay = document.getElementById('parable-text');
    const parableExplanationDisplay = document.getElementById('parable-explanation');
    let currentlySelectedButton = null; // Variable to keep track of the currently selected button for styling

    // --- 3. Display Updater Function ---
    /**
     * Updates the text and explanation display areas based on the selected parable ID.
     * Also handles highlighting the selected button.
     * @param {number} parableId - The ID of the parable to display.
     */
    function displayParable(parableId) {
        // Find the parable object from the data array using its ID.
        const selectedParable = parableData.find(p => p.id === parableId);

        // Check if a parable was found
        if (selectedParable) {
            // Update the HTML content of the display areas.
            // Using innerHTML to allow basic HTML like <p> tags if needed.
            // Added headings for clarity.
            parableTextDisplay.innerHTML = `<h2>${selectedParable.title} - Text</h2><p>${selectedParable.text.replace(/\n/g, '<br>')}</p>`; // Replace newlines with <br> for display
            parableExplanationDisplay.innerHTML = `<h3>Explanation</h3><p>${selectedParable.explanation}</p>`;

            // --- Handle Button Highlighting ---
            const selectedButton = parableListContainer.querySelector(`button[data-id='${parableId}']`);

            // Remove 'selected' class from the previously selected button, if any.
            if (currentlySelectedButton) {
                currentlySelectedButton.classList.remove('selected');
            }

            // Add 'selected' class to the newly clicked button and update the tracker variable.
            if (selectedButton) {
                selectedButton.classList.add('selected');
                currentlySelectedButton = selectedButton;
            }

        } else {
            // Optional: Handle cases where the ID might not match (shouldn't happen with this setup).
            parableTextDisplay.innerHTML = '<h2>Error</h2><p>Parable not found.</p>';
            parableExplanationDisplay.innerHTML = '<h3>Explanation</h3><p></p>';
            if (currentlySelectedButton) {
                currentlySelectedButton.classList.remove('selected');
                currentlySelectedButton = null;
            }
        }
    }

    // --- 4. Initialization Function ---
    /**
     * Populates the parable list container with buttons and attaches event listeners.
     */
    function initializeUI() {
        // Clear the initial "Loading..." message
        parableListContainer.innerHTML = '';

        // Loop through the parable data
        parableData.forEach(parable => {
            // Create a button element for each parable
            const button = document.createElement('button');
            button.textContent = parable.title; // Set button text
            button.setAttribute('data-id', parable.id); // Store parable ID on the button for easy retrieval

            // Add an event listener to the button. When clicked, call displayParable with its ID.
            button.addEventListener('click', () => {
                displayParable(parable.id);
            });

            // Append the created button to the list container in the HTML.
            parableListContainer.appendChild(button);
        });

        // Optional: Automatically display the first parable when the page loads.
         if (parableData.length > 0) {
            displayParable(parableData[0].id);
         } else {
            // Handle case with no data
             parableTextDisplay.innerHTML = '<h2>Welcome</h2><p>No parables loaded.</p>';
             parableExplanationDisplay.innerHTML = '<h3>Explanation</h3><p></p>';
         }
    }

    // --- 5. Run Initialization ---
    // Call the function to set up the UI once the DOM is ready.
    initializeUI();

}); // End of DOMContentLoaded listener