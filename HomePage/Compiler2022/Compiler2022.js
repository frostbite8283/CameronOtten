async function main() {
    const outputContainer = document.getElementById("output-container");
    const outputElement = document.getElementById("output");
    const inputArea = document.getElementById("input-area");
    const inputPromptElement = document.getElementById("input-prompt");
    const userInputElement = document.getElementById("user-input");
    const submitButton = document.getElementById("submit-input");

    // Function to append text to the output
    const appendOutput = (text) => {
        if (outputElement && outputContainer) {
            outputElement.textContent += text + "\n";
            outputContainer.scrollTop = outputContainer.scrollHeight; // Scroll to the bottom
        } else {
            console.error("Output elements not found!");
        }
    };

    try {
        console.log("Loading Pyodide...");
        appendOutput("Loading Pyodide...");
        let pyodide = await loadPyodide({
            stdout: appendOutput, // Redirect standard output
            stderr: appendOutput, // Redirect standard error
        });
        appendOutput("Pyodide loaded successfully!");

        console.log("Loading micropip...");
        await pyodide.loadPackage("micropip");
        console.log("micropip loaded.");
        appendOutput("micropip loaded.");

        console.log("Installing PLY using micropip...");
        await pyodide.runPythonAsync(`
            import micropip
            await micropip.install('ply')
        `);
        console.log("PLY installed.");
        appendOutput("PLY installed.");

        // Our custom JavaScript input function
        const jsInput = async (prompt) => {
            inputPromptElement.textContent = prompt;
            inputArea.style.display = "block"; // Show the input area
            userInputElement.value = ""; // Clear previous input
            userInputElement.focus();

            return new Promise((resolve) => {
                const handleSubmission = () => {
                    const value = userInputElement.value;
                    inputArea.style.display = "none"; // Hide the input area
                    submitButton.removeEventListener("click", handleSubmission);
                    resolve(value);
                };

                submitButton.addEventListener("click", handleSubmission);
                userInputElement.addEventListener("keydown", (event) => {
                    if (event.key === "Enter") {
                        handleSubmission();
                    }
                });
            });
        };

        // Set the 'input' function in the Python environment's globals
        pyodide.globals.set("input", jsInput);

        // Fetch the content of test.txt
        console.log("Fetching test.txt...");
        appendOutput("Fetching test.txt...");
        const response = await fetch("test2.txt");
        if (!response.ok) {
            throw new Error(`Failed to fetch test.txt: ${response.status}`);
        }
        const pythonCode = await response.text();
        console.log("test.txt content loaded.");
        appendOutput("test.txt content loaded.");
        console.log("Running test.txt...");
        appendOutput("Running test.txt...");

        // Execute the content of test.txt
        let result = await pyodide.runPythonAsync(pythonCode);
        console.log("Type of result:", typeof result);
        if (result !== undefined) {
            console.log("Python script output:", result);
            appendOutput(`Python script output: ${result}`);
        } else {
            appendOutput("Python script executed successfully (no direct output).");
        }

    } catch (error) {
        console.error("An error occurred:", error);
        appendOutput(`Error: ${error}`);
    }
}

main();