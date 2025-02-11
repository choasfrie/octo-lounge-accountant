document.addEventListener("DOMContentLoaded", () => {
  const loadComponents = async () => {
    try {
      // Check if components are already loaded
      const existingSidebar = document.getElementById("ai-sidebar");
      if (existingSidebar) {
        console.log("AI Sidebar already exists, initializing chat...");
        initAIChat();
        return;
      }

      // Load components if not already present
      const componentsResponse = await fetch("components.html");
      const componentsHtml = await componentsResponse.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(componentsHtml, "text/html");

      // Insert into document
      const aiSidebar = doc.querySelector(".ai-sidebar");
      if (aiSidebar) {
        document.body.appendChild(aiSidebar.cloneNode(true));
        console.log("AI Sidebar added to document, initializing chat...");
        initAIChat();
      } else {
        console.error("AI Sidebar element not found in components.html");
      }
    } catch (error) {
      console.error("Error loading components:", error);
    }
  };

  const initAIChat = () => {
    // Immediately attempt initialization
    const tryInit = () => {
      const aiSidebar = document.getElementById("ai-sidebar");
      const toggleButton = document.getElementById("toggle-ai-sidebar");
      const closeButton = document.querySelector(".close-ai-sidebar");
      const sendButton = document.getElementById("send-message");
      const userInput = document.getElementById("user-input");
      const chatMessages = document.getElementById("chat-messages");

      if (
        !aiSidebar ||
        !toggleButton ||
        !closeButton ||
        !sendButton ||
        !userInput ||
        !chatMessages
      ) {
        // If elements aren't ready, wait for components
        document.addEventListener("componentsLoaded", tryInit);
        return;
      }

      const exampleMessages = [
        "On the 24th of October, I bought a car for 20,000 CHF.",
        "On the 23rd of August, we withdrew 1,000 CHF from the bank for cash.",
        "On the 20th of November, we had a water leak that cost 10,000 CHF to repair.",
      ];

      // Toggle sidebar
      toggleButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        aiSidebar.classList.toggle("collapsed");

        // If opening the sidebar, add random example message
        if (!aiSidebar.classList.contains("collapsed")) {
          // Clear previous
          chatMessages.innerHTML = "";

          // Example message placeholder
          chatMessages.setAttribute(
            "data-placeholder",
            exampleMessages[Math.floor(Math.random() * exampleMessages.length)]
          );
        }
      });

      // Close sidebar
      closeButton.addEventListener("click", () => {
        aiSidebar.classList.add("collapsed");
      });

      // Handle messages
      const sendMessage = async () => {
        const message = userInput.value.trim();
        if (!message) return;

        try {
          // Add user message to chat
          const userMessageDiv = document.createElement("div");
          userMessageDiv.className = "message user-message";
          userMessageDiv.textContent = message;
          chatMessages.appendChild(userMessageDiv);

          // Clear input
          userInput.value = "";

          // Get current user ID from session storage
          const userId = sessionStorage.getItem("userId");
          if (!userId) {
            throw new Error("User not authenticated");
          }

          // Call the API
          const response = await fetch(
            `http://localhost:5116/api/Records/createRecordGPT/${userId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(message),
            }
          );

          // Create AI response message
          const aiMessageDiv = document.createElement("div");
          aiMessageDiv.className = "message ai-message";

          if (response.ok) {
            aiMessageDiv.textContent = "Code 200: Successfully created Record.";
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            const errorData = await response
              .json()
              .catch(() => ({ message: "Unknown error" }));
            aiMessageDiv.textContent = `[Error ${response.status}: ${errorData.message}]`;
          }

          chatMessages.appendChild(aiMessageDiv);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch (error) {
          const aiMessageDiv = document.createElement("div");
          aiMessageDiv.className = "message ai-message";
          aiMessageDiv.textContent = `[Error: ${error.message}]`;
          chatMessages.appendChild(aiMessageDiv);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      };

      // Send button click
      sendButton.addEventListener("click", async (e) => {
        e.preventDefault();
        await sendMessage();
      });

      // Enter key press
      userInput.addEventListener("keydown", async (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          await sendMessage();
        }
      });
    };

    tryInit();
  };

  // Initial load
  loadComponents();

  // Toggle button handler
  document.addEventListener("click", (e) => {
    if (e.target.closest("#toggle-ai-sidebar")) {
      loadComponents();
    }
  });
});