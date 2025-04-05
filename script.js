/**
 * Simple Parable Explainer (MVP2 Iteration)
 *
 * Fetches Bible text from BSB.json, processes a predefined list of parables
 * (including handling multiple references per parable), extracts relevant text
 * for a primary reference, displays all references, and includes explanations.
 * Features title filtering and robust error handling.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element References ---
    const listContainer = document.getElementById('parable-list');
    const textDisplay = document.getElementById('parable-text');
    const explanationDisplay = document.getElementById('parable-explanation');
    const referenceDisplay = document.getElementById('parable-reference');
    const searchInput = document.getElementById('search-input');
    const messageDisplay = document.getElementById('message-display');
  
    // --- State Variables ---
    let bsbData = null; // Holds the fetched BSB JSON data
    let parableIndex = []; // Holds the processed list: {id, title, allReferencesArray, primaryRefString, primaryReferenceText, explanation}
    let currentlySelectedButton = null;
  
    // --- Data Definitions ---
    // Target parables: Title, array of References, Explanation.
    // NOTE: The order of references in the array matters; the FIRST one listed
    // will be used to fetch the primary text displayed. Ensure accuracy.
    const targetParables = [
        // Matthew
        { title: "Salt of the Earth", references: ["Matthew 5:13"], explanation: "Believers should positively influence the world, like salt flavoring food. If they lose their distinctiveness, they lose their purpose." }, // Mark/Luke refs often considered separate sayings
        { title: "Lamp Under a Bowl", references: ["Matthew 5:14-16", "Mark 4:21-22", "Luke 8:16", "Luke 11:33"], explanation: "Faith and good deeds should be visible, like a lamp giving light, to glorify God." },
        { title: "Wise and Foolish Builders", references: ["Matthew 7:24-27", "Luke 6:47-49"], explanation: "Building one's life on Jesus' teachings is like building on rock (stable); ignoring them is like building on sand (unstable)." },
        { title: "New Cloth on an Old Coat", references: ["Matthew 9:16", "Mark 2:21", "Luke 5:36"], explanation: "Jesus' new way (the gospel) cannot simply patch up old traditions or systems; it requires a new framework." },
        { title: "New Wine in Old Wineskins", references: ["Matthew 9:17", "Mark 2:22", "Luke 5:37-39"], explanation: "Similar to New Cloth; the new life and power of the gospel requires new structures (hearts/minds) to contain it." },
        { title: "The Sower", references: ["Matthew 13:3-9", "Mark 4:1-9", "Luke 8:4-8"], explanation: "Describes different ways people respond to God's message (the seed) based on their heart condition (the soil). (See also Matt 13:18-23, Mark 4:13-20, Luke 8:11-15 for interpretation)." },
        { title: "The Weeds (Tares)", references: ["Matthew 13:24-30"], explanation: "Good (wheat) and evil (weeds) coexist in the world until the final judgment, when God will separate them. (See also Matt 13:36-43 for interpretation)." },
        { title: "The Mustard Seed", references: ["Matthew 13:31-32", "Mark 4:30-32", "Luke 13:18-19"], explanation: "God's kingdom starts incredibly small but grows surprisingly large and provides shelter." },
        { title: "The Leaven (Yeast)", references: ["Matthew 13:33", "Luke 13:20-21"], explanation: "God's kingdom works subtly but powerfully to influence and transform the whole world, like yeast in dough." },
        { title: "The Hidden Treasure", references: ["Matthew 13:44"], explanation: "The kingdom of heaven is so valuable that one finding it would joyfully give up everything else to possess it." },
        { title: "The Pearl of Great Price", references: ["Matthew 13:45-46"], explanation: "Similar to Hidden Treasure; the kingdom is worth sacrificing all other possessions for once its true value is recognized." },
        { title: "The Net (Drawing in the Net)", references: ["Matthew 13:47-50"], explanation: "The kingdom gathers all kinds of people, but there will be a final separation of the righteous and the wicked at the end of the age." },
        { title: "Owner of a House", references: ["Matthew 13:52"], explanation: "A teacher of the kingdom should bring out truths both old (from the Law/Prophets) and new (from Jesus' teachings)." },
        { title: "The Lost Sheep", references: ["Matthew 18:12-14", "Luke 15:3-7"], explanation: "God actively seeks out and rejoices over even one 'lost' person who repents and returns to Him." },
        { title: "The Unforgiving Servant", references: ["Matthew 18:23-35"], explanation: "Since God has forgiven our immense debt, we must forgive the much smaller debts others owe us." },
        { title: "The Workers in the Vineyard", references: ["Matthew 20:1-16"], explanation: "God's grace and rewards are based on His generosity, not strictly on merit or time served; all who respond receive the full gift." },
        { title: "The Two Sons", references: ["Matthew 21:28-32"], explanation: "Actual obedience is better than lip service; those who initially refuse but later repent and obey are preferred over those who say yes but do nothing." },
        { title: "The Wicked Tenants", references: ["Matthew 21:33-44", "Mark 12:1-11", "Luke 20:9-18"], explanation: "An allegory of Israel's leaders rejecting God's prophets and ultimately His Son, leading to judgment and the kingdom given to others." },
        { title: "The Wedding Feast", references: ["Matthew 22:1-14", "Luke 14:16-24"], explanation: "God invites many to His kingdom feast, but those who reject the invitation or come unprepared (without righteousness) will be excluded." }, // Note Luke version differs slightly (Great Banquet)
        { title: "The Fig Tree", references: ["Matthew 24:32-35", "Mark 13:28-31", "Luke 21:29-33"], explanation: "Just as budding leaves signal summer, specific signs will indicate the nearness of the end times and Jesus' return." },
        { title: "The Faithful and Wise Servant", references: ["Matthew 24:45-51", "Luke 12:42-48"], explanation: "Believers should remain faithful and ready for Christ's return, performing their duties diligently, as unpreparedness leads to judgment." }, // Note Luke version slightly different context
        { title: "The Ten Virgins", references: ["Matthew 25:1-13"], explanation: "Emphasizes the need for constant spiritual preparedness for Christ's return; one cannot rely on others' readiness at the last moment." },
        { title: "The Talents", references: ["Matthew 25:14-30", "Luke 19:11-27"], explanation: "Believers are expected to use the gifts and resources God gives them productively for His kingdom; failure to do so results in judgment." }, // Note Luke version (Minas) differs significantly
        { title: "The Sheep and the Goats", references: ["Matthew 25:31-46"], explanation: "Final judgment will separate people based on how they treated Jesus implicitly by serving (or neglecting) the needs of others ('the least of these')." },
        // Mark
        { title: "The Growing Seed", references: ["Mark 4:26-29"], explanation: "The kingdom of God grows mysteriously by its own power, independent of human understanding, until the harvest time (judgment)." },
        { title: "The Doorkeeper", references: ["Mark 13:33-37"], explanation: "A call to remain watchful and alert for the master's (Christ's) return, as the time is unknown." },
        // Luke
        { title: "The Two Debtors", references: ["Luke 7:40-43"], explanation: "Those who are forgiven much tend to love much; gratitude is proportional to the awareness of forgiveness received." },
        { title: "The Good Samaritan", references: ["Luke 10:25-37"], explanation: "Defines 'neighbor' as anyone in need, regardless of background, and emphasizes compassionate action as true neighborliness." },
        { title: "The Friend at Midnight", references: ["Luke 11:5-13"], explanation: "Encourages persistent prayer, assuring that God, unlike the reluctant friend, generously gives good gifts (especially the Holy Spirit) to those who ask." },
        { title: "The Rich Fool", references: ["Luke 12:13-21"], explanation: "Warns against greed and hoarding wealth, emphasizing that life's value is not in possessions but in being 'rich toward God'." },
        { title: "The Unfruitful Fig Tree", references: ["Luke 13:6-9"], explanation: "Illustrates God's patience in giving chances for repentance and fruitfulness, but warns that judgment eventually comes for persistent unfruitfulness." },
        { title: "The Lowest Seat at the Feast", references: ["Luke 14:7-14"], explanation: "Teaches humility; those who exalt themselves will be humbled, and those who humble themselves will be exalted. Also encourages serving those who cannot repay." },
        { title: "Counting the Cost", references: ["Luke 14:28-33"], explanation: "Urges potential disciples to seriously consider the total commitment required to follow Jesus, comparing it to planning a tower or a war." },
        { title: "The Lost Coin", references: ["Luke 15:8-10"], explanation: "Similar to the Lost Sheep; highlights God's diligent seeking of the lost and the great joy in heaven over one sinner who repents." },
        { title: "The Prodigal Son", references: ["Luke 15:11-32"], explanation: "Illustrates God's unconditional love and joyful forgiveness for those who repent and return, contrasting it with self-righteousness (the older brother)." },
        { title: "The Shrewd Manager", references: ["Luke 16:1-13"], explanation: "Urges disciples to use worldly resources astutely for eternal purposes, emphasizing faithfulness in small things and the incompatibility of serving both God and money." },
        { title: "The Rich Man and Lazarus", references: ["Luke 16:19-31"], explanation: "Warns against callous indifference to the poor and highlights the finality of one's state after death, emphasizing belief in scripture." },
        { title: "Master and His Servant", references: ["Luke 17:7-10"], explanation: "Teaches that disciples should serve God with humility, recognizing they are only doing their duty, not earning special merit." },
        { title: "The Persistent Widow", references: ["Luke 18:1-8"], explanation: "Encourages believers to pray persistently and not lose heart, trusting that God will surely grant justice to His chosen ones." },
        { title: "The Pharisee and the Tax Collector", references: ["Luke 18:9-14"], explanation: "Contrasts self-righteous pride with humble repentance; God justifies the humble who recognize their need for mercy, not the proud who trust in their own righteousness." },
        // John (Allegory/Discourse)
        { title: "The Shepherd and His Flock", references: ["John 10:1-18"], explanation: "Jesus identifies Himself as the Good Shepherd who knows His sheep, lays down His life for them, and offers eternal security, contrasting Himself with false leaders." }
      ];
  
    // --- Utility Functions ---
  
    /**
     * Parses a Bible reference string (e.g., "Book Chapter:Verse-Verse") into an object.
     * Designed to be testable. Includes specific handling for "Revelation of John".
     * @param {string} refString - The Bible reference string.
     * @returns {object|null} Parsed object { book, chapter, startVerse, endVerse } or null on failure.
     */
    function parseRef(refString) {
      if (!refString || typeof refString !== 'string') return null;
      // Updated Regex: Handle potential spaces around colon and hyphen, more robust book name capture.
      const match = refString.match(/^(.+?)\s+(\d+)\s*:\s*(\d+)(?:\s*-\s*(\d+))?\s*$/);
      if (!match) {
        console.error(`[parseRef] Failed to parse reference format: "${refString}"`);
        return null;
      }
      try {
        let bookName = match[1].trim();
        // Handle specific book name variation
        if (bookName === "Revelation of John") {
            bookName = "Revelation"; // Standardize to common name likely used in JSON keys
        }
        const chapter = parseInt(match[2], 10);
        const startVerse = parseInt(match[3], 10);
        const endVerse = match[4] ? parseInt(match[4], 10) : startVerse; // Default endVerse to startVerse
  
        // Basic validation
        if (isNaN(chapter) || isNaN(startVerse) || isNaN(endVerse) || chapter <= 0 || startVerse <= 0 || endVerse < startVerse) {
          console.error(`[parseRef] Invalid numbers in parsed reference: "${refString}"`);
          return null;
        }
        return { book: bookName, chapter, startVerse, endVerse };
      } catch (error) {
        console.error(`[parseRef] Error processing reference "${refString}":`, error);
        return null;
      }
    }
  
    /**
     * Extracts text for a given parsed reference from the loaded BSB JSON data.
     * Handles missing data gracefully. Designed to be testable.
     * @param {object} parsedRef - The object returned by parseRef { book, chapter, startVerse, endVerse }.
     * @param {object} fullBsbData - The parsed BSB.json data.
     * @returns {string} The extracted Bible text, or a specific error indicator string.
     */
    function getTextFromBSB(parsedRef, fullBsbData) {
      const errorPrefix = "[Text Unavailable] ";
      if (!parsedRef) return errorPrefix + "Invalid reference format provided.";
      if (!fullBsbData || !Array.isArray(fullBsbData.books)) return errorPrefix + "BSB data is missing or invalid.";
  
      // Find the book case-insensitively, handling potential slight variations if needed, though BSB.json likely consistent.
      const bookData = fullBsbData.books.find(b => b.name.toLowerCase() === parsedRef.book.toLowerCase());
      if (!bookData) return errorPrefix + `Book "${parsedRef.book}" not found.`;
  
      if (!Array.isArray(bookData.chapters)) return errorPrefix + `Invalid chapter data for "${parsedRef.book}".`;
      // Find chapter
      const chapterData = bookData.chapters.find(c => c.chapter === parsedRef.chapter);
      if (!chapterData) return errorPrefix + `Chapter ${parsedRef.chapter} not found in "${parsedRef.book}".`;
  
      if (!Array.isArray(chapterData.verses)) return errorPrefix + `Invalid verse data for ${parsedRef.book} ${parsedRef.chapter}.`;
  
      let extractedText = "";
      let versesFound = 0;
      // Iterate through the required verse range
      for (let v = parsedRef.startVerse; v <= parsedRef.endVerse; v++) {
        const verseData = chapterData.verses.find(verse => verse.verse === v);
        if (verseData && typeof verseData.text === 'string') {
          extractedText += verseData.text.trim() + " "; // Add space between verses
          versesFound++;
        } else {
          // Log missing verses but continue if possible
          console.warn(`[getTextFromBSB] Verse ${v} missing or invalid in ${parsedRef.book} ${parsedRef.chapter}.`);
        }
      }
  
      // Return error if no verses in the specified range were found at all
      if (versesFound === 0) {
          return errorPrefix + `No verses found for range ${parsedRef.startVerse}-${parsedRef.endVerse} in ${parsedRef.book} ${parsedRef.chapter}.`;
      }
  
      return extractedText.trim(); // Return the concatenated text
    }
  
    /**
     * Processes the target parables list after BSB data is loaded.
     * Extracts primary text, builds the parableIndex. Includes error handling.
     */
    function processParables() {
      if (!bsbData) {
        console.error("[processParables] Cannot process parables: BSB data not loaded.");
        showMessage("Critical Error: Bible data is not available for processing.", "error");
        return;
      }
  
      let processingErrors = 0;
      // Map targetParables to the parableIndex structure
      parableIndex = targetParables.map((target, index) => {
        // Determine the primary reference (first one in the array)
        const primaryRefString = (Array.isArray(target.references) && target.references.length > 0)
                                  ? target.references[0]
                                  : null;
  
        let primaryReferenceText = `[Text unavailable: No primary reference defined for "${target.title}"]`; // Default error text
  
        // If a primary reference exists, try to parse it and get text
        if (primaryRefString) {
            const parsedPrimaryRef = parseRef(primaryRefString);
            if (parsedPrimaryRef) {
                primaryReferenceText = getTextFromBSB(parsedPrimaryRef, bsbData);
                // Check if getTextFromBSB returned an error string
                if (primaryReferenceText.startsWith("[Text Unavailable]") || primaryReferenceText.startsWith("[Error:")) {
                    console.error(`[processParables] Failed to get primary text for "${target.title}" (${primaryRefString}): ${primaryReferenceText}`);
                    processingErrors++;
                }
            } else {
                primaryReferenceText = `[Text unavailable: Failed to parse primary reference "${primaryRefString}"]`;
                processingErrors++;
            }
        } else {
            processingErrors++; // Increment error count if no reference defined
        }
  
        // Return the object for the parableIndex
        return {
          id: index, // Use index as ID
          title: target.title,
          allReferencesArray: Array.isArray(target.references) ? target.references : [target.reference || "N/A"], // Ensure it's always an array
          primaryRefString: primaryRefString || "N/A", // Store which ref was used for text
          primaryReferenceText: primaryReferenceText, // Store extracted text or error string
          explanation: target.explanation || "[Explanation not provided]" // Use provided explanation or default
        };
      });
  
      console.log(`[processParables] Processed ${parableIndex.length} parables. ${processingErrors} errors encountered during primary text extraction.`);
  
      // Update UI based on processing outcome
      if (parableIndex.length > 0) {
          renderList(parableIndex); // Render the full list initially
          displayParable(parableIndex[0].id); // Display the first parable
          if (processingErrors > 0) {
             showMessage(`Note: Text for ${processingErrors} parable(s) could not be loaded. Check console for details.`, "info");
          } else {
             showMessage(""); // Clear loading message on full success
          }
      } else {
          showMessage("Error: No parables could be processed.", "error");
          renderList([]); // Ensure list area shows appropriate message
          // Clear display areas
          textDisplay.innerHTML = '<h2>Parable Text</h2>';
          explanationDisplay.innerHTML = '<h3>Explanation</h3>';
          referenceDisplay.innerHTML = '<p>References:</p>';
      }
    }
  
  
    // --- UI Update Functions ---
  
     /**
     * Displays status messages (loading, error, info) in the designated area.
     * @param {string} message - The message text. Empty string hides the message area.
     * @param {string} type - 'loading', 'error', or 'info'. Determines CSS class.
     */
     function showMessage(message, type = 'info') {
        messageDisplay.textContent = message;
        // Apply class based on type for styling (ensure corresponding CSS rules exist)
        messageDisplay.className = message ? type : '';
        // Show the message area only if there is a message
        messageDisplay.style.display = message ? 'block' : 'none';
     }
  
    /**
     * Renders the list of parable buttons into the list container.
     * @param {Array} parablesToRender - Array of parable objects from parableIndex (potentially filtered).
     */
    function renderList(parablesToRender) {
      listContainer.innerHTML = ''; // Clear previous list contents
  
      if (!Array.isArray(parablesToRender) || parablesToRender.length === 0) {
        // Display appropriate message based on whether a search is active
        const message = searchInput.value.trim() ? 'No matching parables found.' : 'Parable list is empty or failed to load.';
        listContainer.innerHTML = `<p>${message}</p>`;
        return;
      }
  
      // Create and append a button for each parable in the provided array
      parablesToRender.forEach(parable => {
        const button = document.createElement('button');
        button.textContent = parable.title;
        button.setAttribute('data-id', parable.id); // Store the index/ID
        button.setAttribute('title', parable.allReferencesArray.join(', ')); // Show all refs on hover
        // Add click listener to display details when button is clicked
        button.addEventListener('click', () => {
          displayParable(parable.id);
        });
        listContainer.appendChild(button);
      });
    }
  
    /**
     * Displays the details of the selected parable (primary text, explanation, all references).
     * Handles selection highlighting.
     * @param {number} parableId - The ID (index) of the parable in the parableIndex array.
     */
    function displayParable(parableId) {
      // Find the parable object in our processed index
      const selectedParable = parableIndex.find(p => p.id === parableId);
  
      if (selectedParable) {
        // Update main display areas
        textDisplay.innerHTML = `<h2>${selectedParable.title}</h2><p>${selectedParable.primaryReferenceText.replace(/\n/g, '<br>')}</p>`;
        explanationDisplay.innerHTML = `<h3>Explanation</h3><p>${selectedParable.explanation}</p>`;
  
        // Format and display all references
        let referenceHTML = '<p>References:</p>';
        if (selectedParable.allReferencesArray && selectedParable.allReferencesArray.length > 0) {
            referenceHTML += '<ul>';
            selectedParable.allReferencesArray.forEach(ref => {
                referenceHTML += `<li>${ref}</li>`; // Display each reference as a list item
            });
            referenceHTML += '</ul>';
        } else {
            referenceHTML += '<p>N/A</p>'; // Indicate if no references are listed
        }
        referenceDisplay.innerHTML = referenceHTML;
  
        // --- Handle Button Highlighting ---
        const selectedButton = listContainer.querySelector(`button[data-id='${parableId}']`);
        // Remove highlight from previously selected button
        if (currentlySelectedButton) {
          currentlySelectedButton.classList.remove('selected');
        }
        // Highlight the newly selected button
        if (selectedButton) {
          selectedButton.classList.add('selected');
          currentlySelectedButton = selectedButton;
        }
         // Clear any general status/error messages when showing a parable successfully
         // showMessage(""); // Decide if selection should always clear messages
  
      } else {
        // Handle error case where the ID doesn't match any processed parable
        console.error(`[displayParable] Parable ID ${parableId} not found in index.`);
        showMessage(`Error: Could not display details for the selected parable.`, 'error');
        // Clear or update display areas to indicate error
        textDisplay.innerHTML = `<h2>Error</h2><p>Details unavailable.</p>`;
        explanationDisplay.innerHTML = `<h3>Explanation</h3>`;
        referenceDisplay.innerHTML = `<p>References:</p>`;
        // Ensure no button remains highlighted if display fails
        if (currentlySelectedButton) {
            currentlySelectedButton.classList.remove('selected');
            currentlySelectedButton = null;
        }
      }
    }
  
    // --- Filtering Function ---
  
    /**
     * Filters the parableIndex based on the search input value (case-insensitive title match)
     * and triggers re-rendering of the list.
     */
    function filterParables() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      // Ensure parableIndex is ready before filtering
      if (!Array.isArray(parableIndex)) {
          console.warn("[filterParables] Filtering attempted before parableIndex was initialized.");
          return;
      }
  
      const filteredParables = parableIndex.filter(parable =>
        parable.title.toLowerCase().includes(searchTerm)
      );
      renderList(filteredParables); // Re-render the list with filtered results
    }
  
    // --- Data Fetching and Initialization ---
  
    /**
     * Fetches the BSB JSON data asynchronously, triggers processing,
     * and handles initial UI state and errors robustly.
     */
    async function fetchDataAndInitialize() {
      // Set initial UI state to loading
      showMessage("Loading Bible data...", "loading");
      listContainer.innerHTML = '<p>Loading...</p>'; // Show loading message in list area too
      textDisplay.innerHTML = '<h2>Parable Text</h2><p>Loading data...</p>';
      explanationDisplay.innerHTML = '<h3>Explanation</h3>';
      referenceDisplay.innerHTML = '<p>References:</p>';
  
  
      try {
        // Fetch the JSON file
        const response = await fetch('BSB.json');
        // Check for network errors (e.g., 404 Not Found)
        if (!response.ok) {
          throw new Error(`HTTP error fetching BSB.json! Status: ${response.status} ${response.statusText}`);
        }
        // Try to parse the response as JSON
        bsbData = await response.json();
  
        // If fetch and parse succeeded, proceed to process parables
        showMessage("Processing parables...", "loading");
        // Use setTimeout to allow UI update before potentially blocking processing
        setTimeout(processParables, 10);
  
      } catch (error) {
        // Catch errors from fetch() or response.json()
        console.error('Critical Error: Could not fetch or parse BSB.json:', error);
        showMessage(`Error: ${error.message}. Please ensure BSB.json is in the same folder and is valid JSON.`, 'error');
        // Update UI to show failure clearly
         listContainer.innerHTML = '<p>Error loading data.</p>';
         textDisplay.innerHTML = '<h2>Error</h2><p>Could not load data.</p>';
         explanationDisplay.innerHTML = '';
         referenceDisplay.innerHTML = '';
      }
    }
  
    // --- Event Listeners Setup ---
    // Add listener for the search input field to filter the list on input
    searchInput.addEventListener('input', filterParables);
    // The DOMContentLoaded listener at the top ensures the rest of the script runs after HTML is ready.
  
    // --- Initialisation ---
    // Start the data fetching and processing chain.
    fetchDataAndInitialize();
  
  }); // End of DOMContentLoaded listener