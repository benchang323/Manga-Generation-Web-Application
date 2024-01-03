import "../style.css";

// Constants
// 12. Spec: The constants ENDPOINT_COMPLETIONS and ENDPOINT_IMAGES should be properly declared and utilized in API interactions.
const ENDPOINT_COMPLETIONS = "https://api.openai.com/v1/chat/completions";
const ENDPOINT_IMAGES = "https://api.openai.com/v1/images/generations";

// Global variables
// 14. Spec: The API_KEY global variable should be correctly initialized from local storage on DOM content load and properly used for API authentication.
let API_KEY;

// Helper functions
// 3. Spec: The application should properly implement and call the getBlurb and getCoverImage functions to interact with OpenAI's API to generate blurbs and images based on user input.
// 13. Spec: The code must use the async/await pattern for dealing with asynchronous operations and not rely on callbacks or Promises directly.
async function getBlurb(title, theme) {
    // Request body
    // 10. Spec: The getBlurb function should accurately construct the prompt, utilize OpenAI's chat completion API (with gpt-3.5-turbo as the model) through the fetch function, and finally, return the generated blurb.
    const body = {
        "model": "gpt-3.5-turbo-0613",
        "messages": [
            {
            "role": "assistant",
            "content": `You are a manga author. You are writing a manga with the title "${title}" and the theme "${theme}". Please write a very short and very concise blurb for the manga that summarizes the plot and/or key features. You must only output complete sentences.`
            }
        ],
        "max_tokens": 75,
    };

    try {
        // 13. Spec: The code must use the async/await pattern for dealing with asynchronous operations and not rely on callbacks or Promises directly.
        // 12. Spec: The constants ENDPOINT_COMPLETIONS and ENDPOINT_IMAGES should be properly declared and utilized in API interactions.
        // 10. Spec: The getBlurb function should accurately construct the prompt, utilize OpenAI's chat completion API (with gpt-3.5-turbo as the model) through the fetch function, and finally, return the generated blurb.
        const response = await fetch(ENDPOINT_COMPLETIONS, {
            "method": 'POST',
            "headers": {
                // 14. Spec: The API_KEY global variable should be correctly initialized from local storage on DOM content load and properly used for API authentication.
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            "body": JSON.stringify(body)
        });

        // Wait for response and parse into JSON
        // 13. Spec: The code must use the async/await pattern for dealing with asynchronous operations and not rely on callbacks or Promises directly.
        const data = await response.json();

        // Return generated blurb 
        // 10. Spec: The getBlurb function should accurately construct the prompt, utilize OpenAI's chat completion API (with gpt-3.5-turbo as the model) through the fetch function, and finally, return the generated blurb.
        return data.choices[0].message.content.trim();
    } catch (error) {
        // 7. Spec: The application should correctly handle API errors by displaying relevant alerts to the user and logging the error messages to the console.
        console.error("Error in getBlurb:", error);
        alert("ERROR - blurb generation failed.");
    }
}

// 3. Spec: The application should properly implement and call the getBlurb and getCoverImage functions to interact with OpenAI's API to generate blurbs and images based on user input.
// 13. Spec: The code must use the async/await pattern for dealing with asynchronous operations and not rely on callbacks or Promises directly.
async function getCoverImage(blurb) {
    // Request body and prompt
    // 11. Spec: The getCoverImage function should correctly construct the prompt, call OpenAI's image generation API using the fetch function, and then return the URL of the generated image.
    const prompt = `You are a manga artist. You are to draw a manga cover image based on this blurb: "${blurb}". Please employ Japanese manga art style. Be as creative and imaginative as possible.`;
    const body = {
        prompt: prompt,
        n: 1
    };

    try {
        // 11. Spec: The getCoverImage function should correctly construct the prompt, call OpenAI's image generation API using the fetch function, and then return the URL of the generated image.
        // 13. Spec: The code must use the async/await pattern for dealing with asynchronous operations and not rely on callbacks or Promises directly.
        // 12. Spec: The constants ENDPOINT_COMPLETIONS and ENDPOINT_IMAGES should be properly declared and utilized in API interactions.
        const response = await fetch(ENDPOINT_IMAGES, {
            method: 'POST',
            headers: {
                // 14. Spec: The API_KEY global variable should be correctly initialized from local storage on DOM content load and properly used for API authentication.
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        // 13. Spec: The code must use the async/await pattern for dealing with asynchronous operations and not rely on callbacks or Promises directly.
        const data = await response.json();
        console.log(data);
        
        // Return generated image URL
        // 11. Spec: The getCoverImage function should correctly construct the prompt, call OpenAI's image generation API using the fetch function, and then return the URL of the generated image.
        return data.data[0].url;
    } catch (error) {
        // 7. Spec: The application should correctly handle API errors by displaying relevant alerts to the user and logging the error messages to the console.
        console.error("Error fetching image:", error);
        alert("ERROR - image generation failed.");
    }
}

// Event handlers
async function handleFormSubmission(e) {
    // Prevent default form behavior
    e.preventDefault();

    // Extract data
    // 1. Spec: The application should facilitate users in entering a title and theme to generate a manga blurb and cover image.
    // 9. Spec: The handleFormSubmission function should be invoked when the form is submitted. It should retrieve the title and theme from the form. Subsequently, it should invoke getBlurb and getCoverImage to generate the blurb and image respectively. Lastly, it should update the DOM to display the blurb and image.
    const title = e.target.elements["mangaTitle"].value.trim();
    const theme = e.target.elements["mangaTheme"].value.trim();

    // Error handling
    // 2. Spec: The application should correctly validate user inputs and display an alert if the title or theme is missing.
    if (!title && !theme) {
        alert("Please enter a title and theme.");
        return;
    } else if (!title) {
        alert("Please enter a title.");
        return;
    } else if (!theme) {
        alert("Please enter a theme.");
        return;
    } 

    // Clear contents
    document.getElementById("generatedBlurb").textContent = ""; 
    // Hide blurb
    document.getElementById("generatedBlurb").style.display = "none"; 
    document.getElementById("coverImage").src = ""; 
    // Hide image
    document.getElementById("coverImage").style.display = "none"; 

    // Loading spinner and disabling inputs (CHECK)
    // 4. Spec: The application should display a loading spinner while waiting for the API's response and remove it once the response is received.
    // 5. Spec: The application should disable user inputs and hide the "Generate" button while waiting for the API's response and enable them back once the response is received.
    const load = document.getElementById("spinner");
    load.style.display = "block";
    e.target.elements["mangaTitle"].disabled = true;
    e.target.elements["mangaTheme"].disabled = true;
    e.target.elements["generateButton"].style.display = "none";

    try {
        // Get blurb and image from API call
        // 13. Spec: The code must use the async/await pattern for dealing with asynchronous operations and not rely on callbacks or Promises directly.
        // 3. Spec: The application should properly implement and call the getBlurb and getCoverImage functions to interact with OpenAI's API to generate blurbs and images based on user input.
        // 9. Spec: The handleFormSubmission function should be invoked when the form is submitted. It should retrieve the title and theme from the form. Subsequently, it should invoke getBlurb and getCoverImage to generate the blurb and image respectively. Lastly, it should update the DOM to display the blurb and image.
        const blurb = await getBlurb(title, theme);

        // Update DOM
        // 9. Spec: The handleFormSubmission function should be invoked when the form is submitted. It should retrieve the title and theme from the form. Subsequently, it should invoke getBlurb and getCoverImage to generate the blurb and image respectively. Lastly, it should update the DOM to display the blurb and image.
        // 6. Spec: The application should correctly update the DOM to display the generated blurb and image once received.
        document.getElementById("generatedBlurb").textContent = blurb;
        document.getElementById("generatedBlurb").style.display = "block";

        // Get blurb and image from API call
        // 13. Spec: The code must use the async/await pattern for dealing with asynchronous operations and not rely on callbacks or Promises directly.
        // 3. Spec: The application should properly implement and call the getBlurb and getCoverImage functions to interact with OpenAI's API to generate blurbs and images based on user input.
        // 9. Spec: The handleFormSubmission function should be invoked when the form is submitted. It should retrieve the title and theme from the form. Subsequently, it should invoke getBlurb and getCoverImage to generate the blurb and image respectively. Lastly, it should update the DOM to display the blurb and image.
        const image = await getCoverImage(blurb);
        
        // Update DOM
        // 9. Spec: The handleFormSubmission function should be invoked when the form is submitted. It should retrieve the title and theme from the form. Subsequently, it should invoke getBlurb and getCoverImage to generate the blurb and image respectively. Lastly, it should update the DOM to display the blurb and image.
        // 6. Spec: The application should correctly update the DOM to display the generated blurb and image once received.
        document.getElementById("coverImage").src = image;
        document.getElementById("coverImage").style.display = "block";
    } catch (error) {
        // 7. Spec: The application should correctly handle API errors by displaying relevant alerts to the user and logging the error messages to the console.
        console.error("Error in handleFormSubmission:", error);
        alert("ERROR - form submission failed.")
    } finally {
        // Clear contents
        // 8. Spec: The application should clear previous results when the "Generate" button is clicked again.
        e.target.elements["mangaTitle"].value = "";
        e.target.elements["mangaTheme"].value = "";

        // Hide spinner and allow new inputs
        // 4. Spec: The application should display a loading spinner while waiting for the API's response and remove it once the response is received.
        load.style.display = "none";
        e.target.elements["mangaTitle"].disabled = false;
        e.target.elements["mangaTheme"].disabled = false;
        e.target.elements["generateButton"].style.display = "block";
    }
}

document.addEventListener("DOMContentLoaded", () => {
  API_KEY = localStorage.getItem("openai_api_key");

  // 15. Spec: The application should correctly display an alert if the API key is not found in local storage.
  if (!API_KEY) {
    alert(
      "Please store your API key in local storage with the key 'openai_api_key'.",
    );
    return;
  }

  const mangaInputForm = document.getElementById("mangaInputForm");
  mangaInputForm.addEventListener("submit", handleFormSubmission);
});

// General Specs:
// 16. Spec: The deployed app should run smoothly without any errors and should be efficient. It should not display debugging messages in the console. (You may use debugging messages during development but remove them for deployment)
// 17. Spec: Ensure adherence to best practices in code readability, such as consistent indentation, clear naming, and relevant code comments. Properly organize and structure the code by using separate, well-named functions for different functionalities, with each function having a single responsibility.