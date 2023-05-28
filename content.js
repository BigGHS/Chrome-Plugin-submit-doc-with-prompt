//Message send/receive
chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
    //    console.log(message);
    if (message.txt === "button clicked") {
        if (message.num % 2 === 0) {
            //            console.log("The number is divisible by 2.");
            injectCode();
            //            console.log('code injected');
        } else {
            //            console.log("The number is not divisible by 2.");
            removeCode();
            //            console.log('code removed');
        }
    }
}


function injectCode() {
    //Code to inject

    // Create the first container element and add the next two elements

    const container1 = document.createElement("div");
    container1.id = "container1";

    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit File";
    submitButton.style.backgroundColor = "green";
    submitButton.style.color = "white";
    submitButton.style.padding = "5px";
    submitButton.style.border = "none";
    submitButton.style.borderRadius = "5px";
    submitButton.style.margin = "5px";
    container1.appendChild(submitButton);

    const textChunkSizeLimitInput = document.createElement("input");
    textChunkSizeLimitInput.type = "number";
    textChunkSizeLimitInput.value = 15000;
    textChunkSizeLimitInput.style.width = "80px";
    textChunkSizeLimitInput.style.backgroundColor = "white";
    textChunkSizeLimitInput.style.color = "black";
    textChunkSizeLimitInput.style.padding = "5px";
    textChunkSizeLimitInput.style.border = "none";
    textChunkSizeLimitInput.style.borderRadius = "5px";
    textChunkSizeLimitInput.style.margin = "5px";
    container1.appendChild(textChunkSizeLimitInput);

    // Create the second container element and add the next two elements
    const container2 = document.createElement("div");
    container2.id = "container2";

    const clearButton = document.createElement("button");
    clearButton.textContent = "Clear";
    clearButton.style.backgroundColor = "red";
    clearButton.style.color = "white";
    clearButton.style.padding = "5px";
    clearButton.style.border = "none";
    clearButton.style.borderRadius = "5px";
    clearButton.style.margin = "5px";
    clearButton.addEventListener("click", () => {
        promptInput.value = "";
    });
    container2.appendChild(clearButton);

    // Create the prompt element
    const promptInput = document.createElement("input");
    promptInput.type = "text";
    promptInput.placeholder = 'Input your prompt . . .';
    promptInput.value = "";
    promptInput.style.width = "calc(100% - 75px)";
    promptInput.style.backgroundColor = "white";
    promptInput.style.color = "black";
    promptInput.style.padding = "5px";
    promptInput.style.border = "none";
    promptInput.style.borderRadius = "5px";
    promptInput.style.margin = "5px";
    container2.appendChild(promptInput);

    // Create the progress elements it into the DOM
    const progressElement = document.createElement("progress");
    progressElement.id = "progressElement";
    progressElement.style.width = "99%";
    progressElement.style.height = "5px";
    progressElement.style.backgroundColor = "gray";

    const progressBar = document.createElement("div");
    progressBar.style.width = "0%";
    progressBar.style.height = "100%";
    progressBar.style.backgroundColor = "blue";
    progressElement.appendChild(progressBar);

    // Insert the containers into the DOM
    const targetElement = document.querySelector(".flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4");
    targetElement.parentNode.insertBefore(container1, targetElement);
    targetElement.parentNode.insertBefore(container2, targetElement);
    targetElement.parentNode.insertBefore(progressElement, targetElement);

    //Functions

    // Function to handle file selection
    async function handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async function(event) {
                const fileContent = event.target.result;

                let text = '';
                const ext = file.name.toLowerCase().split('.').pop();

                // Extract text based on the file extension
                if (ext === 'txt' || ext === 'md') {
                    text = fileContent;
                } else if (ext === 'doc' || ext === 'docx' || ext === 'pdf') {
                    const docToText = new DocToText();
                    text = await docToText.extractToText(file, ext);
                }

                const textChunks = splitTextIntoChunks(text);
                const numChunks = textChunks.length;
                const prompt = promptInput.value;
                for (let i = 0; i < numChunks; i++) {
                    const part = i + 1;
                    const filename = file.name;
                    const textChunk = textChunks[i];
                    await submitConversation(textChunk, part, filename, prompt);
                    progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;
                }
                progressBar.style.backgroundColor = "blue";
            };
            reader.readAsText(file);
        }
    }

    // Function to split text into chunks
    function splitTextIntoChunks(text) {
        const paragraphDelimiter = "\n"; // Change this as needed
        const textChunkSizeLimit = textChunkSizeLimitInput.value; // Change this as needed
        const paragraphs = text.split(paragraphDelimiter);
        const textChunks = [];
        let currentChunk = "";
        for (const paragraph of paragraphs) {
            if (currentChunk.length + paragraph.length + paragraphDelimiter.length > textChunkSizeLimit) {
                textChunks.push(currentChunk);
                currentChunk = "";
            }
            currentChunk += paragraph + paragraphDelimiter;
        }
        textChunks.push(currentChunk);
        return textChunks;
    }

    // Function to submit conversation
    async function submitConversation(text, part, filename, prompt) {
        const textarea = document.querySelector("textarea[tabindex='0']");
        const enterKeyEvent = new KeyboardEvent("keydown", {
            bubbles: true,
            cancelable: true,
            keyCode: 13,
        });
        textarea.value = `${prompt} \n Part ${part} of ${filename}: \n ${text}`;
        textarea.dispatchEvent(enterKeyEvent);
        await waitForChatGPTReady();
    }

    // Function to wait for ChatGPT to be ready
    async function waitForChatGPTReady() {
        let chatGPTReady = false;
        while (!chatGPTReady) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            chatGPTReady = !document.querySelector(".text-2xl > span:not(.invisible)");
        };
    }

    // Add event listener to button for file selection
    submitButton.addEventListener("click", function() {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".txt,.md,.doc,.docx,.pdf";
        fileInput.addEventListener("change", handleFileSelect);
        fileInput.click();
    });
}

function removeCode() {
    // Function to remove the injected objects
    // Remove the containers
    const container1 = document.querySelector("#container1");
    const container2 = document.querySelector("#container2");
    container1.remove();
    container2.remove();

    // Remove the progress element
    const progressElement = document.querySelector("#progressElement");
    progressElement.remove();
}