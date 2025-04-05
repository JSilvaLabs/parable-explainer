document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element References ---
    const listContainer = document.getElementById('parable-list');
    const textDisplay = document.getElementById('parable-text');
    const explanationDisplay = document.getElementById('parable-explanation');
    const referenceDisplay = document.getElementById('parable-reference');
    const searchInput = document.getElementById('search-input');
    const messageDisplay = document.getElementById('message-display');
  
    // --- State Variables ---
    let bsbData = null; // To hold the entire fetched BSB JSON data
    let parableIndex = []; // To hold the processed list of parables {id, title, ref, text, explanation}
    let currentlySelectedButton = null;
  
    // --- Data Definitions ---
    // List of target parables with references and simple explanations (Step A + Step C)
    // Explanations provided by AI as requested.
    const targetParables = [
      { title: "Salt of the Earth", reference: "Matthew 5:13", explanation: "Believers should positively influence the world, like salt flavoring food. If they lose their distinctiveness, they lose their purpose." },
      { title: "Lamp Under a Bowl", reference: "Matthew 5:14-16", explanation: "Faith and good deeds should be visible, like a lamp giving light, to glorify God." },
      { title: "Wise and Foolish Builders", reference: "Matthew 7:24-27", explanation: "Building one's life on Jesus' teachings is like building on rock (stable); ignoring them is like building on sand (unstable)." },
      { title: "New Cloth on an Old Coat", reference: "Matthew 9:16", explanation: "Jesus' new way (the gospel) cannot simply patch up old traditions or systems; it requires a new framework." },
      { title: "New Wine in Old Wineskins", reference: "Matthew 9:17", explanation: "Similar to New Cloth; the new life and power of the gospel requires new structures (hearts/minds) to contain it." },
      { title: "The Sower", reference: "Matthew 13:3-9", explanation: "Describes different ways people respond to God's message (the seed) based on their heart condition (the soil)." }, // Note: Explanation usually includes Matt 13:18-23
      { title: "The Weeds (Tares)", reference: "Matthew 13:24-30", explanation: "Good (wheat) and evil (weeds) coexist in the world until the final judgment, when God will separate them." }, // Note: Explanation usually includes Matt 13:36-43
      { title: "The Mustard Seed", reference: "Matthew 13:31-32", explanation: "God's kingdom starts incredibly small but grows surprisingly large and provides shelter." },
      { title: "The Leaven (Yeast)", reference: "Matthew 13:33", explanation: "God's kingdom works subtly but powerfully to influence and transform the whole world, like yeast in dough." },
      { title: "The Hidden Treasure", reference: "Matthew 13:44", explanation: "The kingdom of heaven is so valuable that one finding it would joyfully give up everything else to possess it." },
      { title: "The Pearl of Great Price", reference: "Matthew 13:45-46", explanation: "Similar to Hidden Treasure; the kingdom is worth sacrificing all other possessions for once its true value is recognized." },
      { title: "The Net (Drawing in the Net)", reference: "Matthew 13:47-50", explanation: "The kingdom gathers all kinds of people, but there will be a final separation of the righteous and the wicked at the end of the age." },
      { title: "Owner of a House", reference: "Matthew 13:52", explanation: "A teacher of the kingdom should bring out truths both old (from the Law/Prophets) and new (from Jesus' teachings)." },
      { title: "The Lost Sheep", reference: "Matthew 18:12-14", explanation: "God actively seeks out and rejoices over even one 'lost' person who repents and returns to Him." },
      { title: "The Unforgiving Servant", reference: "Matthew 18:23-35", explanation: "Since God has forgiven our immense debt, we must forgive the much smaller debts others owe us." },
      { title: "The Workers in the Vineyard", reference: "Matthew 20:1-16", explanation: "God's grace and rewards are based on His generosity, not strictly on merit or time served; all who respond receive the full gift." },
      { title: "The Two Sons", reference: "Matthew 21:28-32", explanation: "Actual obedience is better than lip service; those who initially refuse but later repent and obey are preferred over those who say yes but do nothing." },
      { title: "The Wicked Tenants", reference: "Matthew 21:33-44", explanation: "An allegory of Israel's leaders rejecting God's prophets and ultimately His Son, leading to judgment and the kingdom given to others." },
      { title: "The Wedding Feast", reference: "Matthew 22:1-14", explanation: "God invites many to His kingdom feast, but those who reject the invitation or come unprepared (without righteousness) will be excluded." },
      { title: "The Fig Tree", reference: "Matthew 24:32-35", explanation: "Just as budding leaves signal summer, specific signs will indicate the nearness of the end times and Jesus' return." },
      { title: "The Faithful and Wise Servant", reference: "Matthew 24:45-51", explanation: "Believers should remain faithful and ready for Christ's return, performing their duties diligently, as unpreparedness leads to judgment." },
      { title: "The Ten Virgins", reference: "Matthew 25:1-13", explanation: "Emphasizes the need for constant spiritual preparedness for Christ's return; one cannot rely on others' readiness at the last moment." },
      { title: "The Talents", reference: "Matthew 25:14-30", explanation: "Believers are expected to use the gifts and resources God gives them productively for His kingdom; failure to do so results in judgment." },
      { title: "The Sheep and the Goats", reference: "Matthew 25:31-46", explanation: "Final judgment will separate people based on how they treated Jesus implicitly by serving (or neglecting) the needs of others ('the least of these')." },
      { title: "The Growing Seed", reference: "Mark 4:26-29", explanation: "The kingdom of God grows mysteriously by its own power, independent of human understanding, until the harvest time (judgment)." },
      { title: "The Doorkeeper", reference: "Mark 13:33-37", explanation: "A call to remain watchful and alert for the master's (Christ's) return, as the time is unknown." },
      { title: "The Two Debtors", reference: "Luke 7:40-43", explanation: "Those who are forgiven much tend to love much; gratitude is proportional to the awareness of forgiveness received." },
      { title: "The Good Samaritan", reference: "Luke 10:25-37", explanation: "Defines 'neighbor' as anyone in need, regardless of background, and emphasizes compassionate action as true neighborliness." },
      { title: "The Friend at Midnight", reference: "Luke 11:5-13", explanation: "Encourages persistent prayer, assuring that God, unlike the reluctant friend, generously gives good gifts (especially the Holy Spirit) to those who ask." },
      { title: "The Rich Fool", reference: "Luke 12:13-21", explanation: "Warns against greed and hoarding wealth, emphasizing that life's value is not in possessions but in being 'rich toward God'." },
      { title: "The Unfruitful Fig Tree", reference: "Luke 13:6-9", explanation: "Illustrates God's patience in giving chances for repentance and fruitfulness, but warns that judgment eventually comes for persistent unfruitfulness." },
      { title: "The Lowest Seat at the Feast", reference: "Luke 14:7-14", explanation: "Teaches humility; those who exalt themselves will be humbled, and those who humble themselves will be exalted. Also encourages serving those who cannot repay." },
      { title: "Counting the Cost", reference: "Luke 14:28-33", explanation: "Urges potential disciples to seriously consider the total commitment required to follow Jesus, comparing it to planning a tower or a war." },
      { title: "The Lost Coin", reference: "Luke 15:8-10", explanation: "Similar to the Lost Sheep; highlights God's diligent seeking of the lost and the great joy in heaven over one sinner who repents." },
      { title: "The Prodigal Son", reference: "Luke 15:11-32", explanation: "Illustrates God's unconditional love and joyful forgiveness for those who repent and return, contrasting it with self-righteousness (the older brother)." },
      { title: "The Shrewd Manager", reference: "Luke 16:1-13", explanation: "Urges disciples to use worldly resources astutely for eternal purposes, emphasizing faithfulness in small things and the incompatibility of serving both God and money." },
      { title: "The Rich Man and Lazarus", reference: "Luke 16:19-31", explanation: "Warns against callous indifference to the poor and highlights the finality of one's state after death, emphasizing belief in scripture." },
      { title: "Master and His Servant", reference: "Luke 17:7-10", explanation: "Teaches that disciples should serve God with humility, recognizing they are only doing their duty, not earning special merit." },
      { title: "The Persistent Widow", reference: "Luke 18:1-8", explanation: "Encourages believers to pray persistently and not lose heart, trusting that God will surely grant justice to His chosen ones." },
      { title: "The Pharisee and the Tax Collector", reference: "Luke 18:9-14", explanation: "Contrasts self-righteous pride with humble repentance; God justifies the humble who recognize their need for mercy, not the proud who trust in their own righteousness." },
      { title: "The Shepherd and His Flock", reference: "John 10:1-18", explanation: "Jesus identifies Himself as the Good Shepherd who knows His sheep, lays down His life for them, and offers eternal security, contrasting Himself with false leaders." } // Note: Often seen as allegory.
    ];
  
    // --- Utility Functions ---
  
    /**
     * Parses a Bible reference string into an object.
     * Handles single verses, ranges, and specific book names.
     * Example: "Matthew 13:3-9" -> { book: "Matthew", chapter: 13, startVerse: 3, endVerse: 9 }
     * Example: "Matthew 5:13" -> { book: "Matthew", chapter: 5, startVerse: 13, endVerse: 13 }
     * @param {string} refString - The Bible reference string.
     * @returns {object|null} Parsed reference object or null if parsing fails.
     */
    function parseRef(refString) {
      // Match pattern like "Book Name Chapter:StartVerse-EndVerse" or "Book Name Chapter:Verse"
      const match = refString.match(/^(.+)\s(\d+):(\d+)(?:-(\d+))?$/);
      if (!match) {
        console.error(`Could not parse reference: ${refString}`);
        return null;
      }
      let bookName = match[1].trim();
      // Handle specific book name case
      if (bookName === "Revelation of John") {
          bookName = "Revelation"; // Assuming the JSON uses "Revelation"
      }
      const chapter = parseInt(match[2], 10);
      const startVerse = parseInt(match[3], 10);
      const endVerse = match[4] ? parseInt(match[4], 10) : startVerse; // If no end verse, it's the same as start
  
      if (isNaN(chapter) || isNaN(startVerse) || isNaN(endVerse)) {
        console.error(`Invalid numbers in reference: ${refString}`);
        return null;
      }
      return { book: bookName, chapter, startVerse, endVerse };
    }
  
    /**
     * Extracts text for a given parsed reference from the loaded BSB JSON data.
     * Concatenates verses if it's a range.
     * @param {object} parsedRef - The object returned by parseRef.
     * @param {object} fullBsbData - The parsed BSB.json data.
     * @returns {string} The extracted Bible text or an error message.
     */
    function getTextFromBSB(parsedRef, fullBsbData) {
      if (!parsedRef || !fullBsbData || !fullBsbData.books) {
        return "[Error: Invalid reference or BSB data]";
      }
  
      const bookData = fullBsbData.books.find(b => b.name === parsedRef.book);
      if (!bookData) {
        return `[Error: Book "${parsedRef.book}" not found in BSB data]`;
      }
  
      const chapterData = bookData.chapters.find(c => c.chapter === parsedRef.chapter);
      if (!chapterData) {
        return `[Error: Chapter ${parsedRef.chapter} not found in "${parsedRef.book}"]`;
      }
  
      let extractedText = "";
      for (let v = parsedRef.startVerse; v <= parsedRef.endVerse; v++) {
        const verseData = chapterData.verses.find(verse => verse.verse === v);
        if (verseData) {
          extractedText += verseData.text + " "; // Add space between verses
        } else {
          // Option: Add warning for missing verse, or just skip
          console.warn(`Verse ${v} not found in ${parsedRef.book} ${parsedRef.chapter}`);
        }
      }
  
      return extractedText.trim() || `[Error: Verses ${parsedRef.startVerse}-${parsedRef.endVerse} not found]`;
    }
  
    /**
     * Processes the target parables list after BSB data is loaded.
     * Extracts text and builds the parableIndex.
     */
    function processParables() {
      if (!bsbData) return; // Ensure BSB data is loaded
  
      parableIndex = targetParables.map((target, index) => {
        const parsedRef = parseRef(target.reference);
        const text = getTextFromBSB(parsedRef, bsbData);
        return {
          id: index, // Use array index as simple ID
          title: target.title,
          reference: target.reference,
          text: text, // Extracted text
          explanation: target.explanation // Explanation from targetParables array
        };
      });
  
      // Initial render of the full list
      renderList(parableIndex);
    }
  
  
    // --- UI Update Functions ---
  
     /**
     * Displays messages (loading, error, info) in the message area.
     * @param {string} message - The message text.
     * @param {string} type - 'loading', 'error', or 'info'.
     */
     function showMessage(message, type = 'info') {
          messageDisplay.textContent = message;
          messageDisplay.className = type; // Add class for styling
          messageDisplay.style.display = message ? 'block' : 'none'; // Show/hide
     }
  
    /**
     * Renders the list of parables (buttons) into the list container.
     * @param {Array} parablesToRender - Array of parable objects to display.
     */
    function renderList(parablesToRender) {
      listContainer.innerHTML = ''; // Clear previous list
  
      if (parablesToRender.length === 0) {
        listContainer.innerHTML = '<p>No matching parables found.</p>';
        return;
      }
  
      parablesToRender.forEach(parable => {
        const button = document.createElement('button');
        button.textContent = parable.title;
        button.setAttribute('data-id', parable.id);
        button.addEventListener('click', () => {
          displayParable(parable.id);
        });
        listContainer.appendChild(button);
      });
    }
  
    /**
     * Displays the details of the selected parable.
     * @param {number} parableId - The ID of the parable in the parableIndex.
     */
    function displayParable(parableId) {
      const selectedParable = parableIndex.find(p => p.id === parableId);
  
      if (selectedParable) {
        textDisplay.innerHTML = `<h2>${selectedParable.title}</h2><p>${selectedParable.text.replace(/\n/g, '<br>')}</p>`;
        explanationDisplay.innerHTML = `<h3>Explanation</h3><p>${selectedParable.explanation}</p>`;
        referenceDisplay.innerHTML = `<p>Reference: ${selectedParable.reference}</p>`;
  
        // Update button highlighting
        const selectedButton = listContainer.querySelector(`button[data-id='${parableId}']`);
        if (currentlySelectedButton) {
          currentlySelectedButton.classList.remove('selected');
        }
        if (selectedButton) {
          selectedButton.classList.add('selected');
          currentlySelectedButton = selectedButton;
        }
         showMessage(""); // Clear any previous messages
      } else {
        // Should not happen if IDs are correct, but good practice
        showMessage(`Error: Could not find details for parable ID ${parableId}.`, 'error');
        textDisplay.innerHTML = `<h2>Error</h2>`;
        explanationDisplay.innerHTML = `<h3>Explanation</h3>`;
        referenceDisplay.innerHTML = `<p>Reference:</p>`;
      }
    }
  
    // --- Filtering Function ---
  
    /**
     * Filters the parableIndex based on the search input value and re-renders the list.
     */
    function filterParables() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      if (!parableIndex || parableIndex.length === 0) return; // Don't filter if no data
  
      const filteredParables = parableIndex.filter(parable =>
        parable.title.toLowerCase().includes(searchTerm)
      );
      renderList(filteredParables);
    }
  
    // --- Data Fetching Function ---
  
    /**
     * Fetches the BSB JSON data, processes it, and handles initial UI setup.
     */
    async function fetchData() {
      showMessage("Loading Bible data...", "loading");
      listContainer.innerHTML = ''; // Clear initial message
      textDisplay.innerHTML = '<h2>Parable Text</h2><p>Loading...</p>';
      explanationDisplay.innerHTML = '<h3>Explanation</h3><p>Loading...</p>';
      referenceDisplay.innerHTML = '<p>Reference:</p>';
  
  
      try {
        const response = await fetch('BSB.json'); // Assuming BSB.json is in the same folder
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        bsbData = await response.json(); // Store the full Bible data
  
        // Now process the parables using the loaded data
        processParables();
  
        // Check if processing resulted in any parables
        if (parableIndex.length > 0) {
           // Optional: Display first parable initially
           displayParable(parableIndex[0].id);
           showMessage(""); // Clear loading message on success
        } else {
           showMessage("No parables processed. Check data definitions.", "error");
        }
  
  
      } catch (error) {
        console.error('Error fetching or processing BSB data:', error);
        showMessage(`Error loading Bible data: ${error.message}. Please ensure BSB.json is present and valid.`, 'error');
         textDisplay.innerHTML = '<h2>Error</h2><p>Could not load data.</p>';
         explanationDisplay.innerHTML = '<h3>Explanation</h3>';
         referenceDisplay.innerHTML = '<p>Reference:</p>';
      }
    }
  
    // --- Event Listeners ---
    searchInput.addEventListener('input', filterParables);
  
    // --- Initialisation ---
    fetchData(); // Start the process when the script loads
  
  }); // End of DOMContentLoaded listener