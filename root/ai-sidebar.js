document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Sidebar
    const loadComponents = async () => {
        try {
            // Check if components are already loaded
            const existingSidebar = document.getElementById('ai-sidebar');
            if (existingSidebar) {
                initAIChat();
                return;
            }

            // Load components if not already present
            const componentsResponse = await fetch('components.html');
            const componentsHtml = await componentsResponse.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(componentsHtml, 'text/html');

            // Insert into document
            const aiSidebar = doc.querySelector('.ai-sidebar');
            if (aiSidebar) {
                document.body.appendChild(aiSidebar.cloneNode(true));
                // Dispatch event when components are loaded
                document.dispatchEvent(new Event('componentsLoaded'));
                initAIChat();
            }
        } catch (error) {
            console.error('Error loading components:', error);
        }
    };

    const initAIChat = () => {
        // Wait for components to be loaded
        const tryInit = () => {
            const aiSidebar = document.getElementById('ai-sidebar');
            const toggleButton = document.getElementById('toggle-ai-sidebar');
            const closeButton = document.querySelector('.close-ai-sidebar');
            const sendButton = document.getElementById('send-message');
            const userInput = document.getElementById('user-input');
            const chatMessages = document.getElementById('chat-messages');

            if (!aiSidebar || !toggleButton || !closeButton || !sendButton || !userInput || !chatMessages) {
                // If elements aren't ready, wait for components
                document.addEventListener('componentsLoaded', tryInit);
                return;
            }

    const exampleMessages = [
        "On the 24th of October, I bought a car for 20,000 CHF.",
        "On the 23rd of August, we withdrew 1,000 CHF from the bank for cash.",
        "On the 20th of November, we had a water leak that cost 10,000 CHF to repair."
    ];

    // Toggle sidebar
    toggleButton.addEventListener('click', () => {
        aiSidebar.classList.toggle('collapsed');
        
        // If opening the sidebar, add random example message
        if (!aiSidebar.classList.contains('collapsed')) {
            // Clear previous
            chatMessages.innerHTML = '';
            
            // Example message placeholder
            chatMessages.setAttribute('data-placeholder', exampleMessages[Math.floor(Math.random() * exampleMessages.length)]);
        }
    });

    // Close sidebar
    closeButton.addEventListener('click', () => {
        aiSidebar.classList.add('collapsed');
    });

    // Handle messages
    const sendMessage = async () => {
        const message = userInput.value.trim();
        if (message) {
            try {
                // Add user message to chat
                const userMessageDiv = document.createElement('div');
                userMessageDiv.className = 'message user-message';
                userMessageDiv.textContent = message;
                chatMessages.appendChild(userMessageDiv);
                
                // Clear input
                userInput.value = '';

                // Get current user ID from session storage
                const userId = sessionStorage.getItem('userId');
                if (!userId) {
                    throw new Error('User not authenticated');
                }

                // Call the API
                const response = await fetch(`http://localhost:5116/api/Records/createRecordGPT/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(message)
                });

                // Create AI response message
                const aiMessageDiv = document.createElement('div');
                aiMessageDiv.className = 'message ai-message';

                if (response.ok) {
                    aiMessageDiv.textContent = "Code 200: Successfully created Record.";
                    // Reload the page after a short delay to show the message
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                    aiMessageDiv.textContent = `[Error ${response.status}: ${errorData.message}]`;
                }

                chatMessages.appendChild(aiMessageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;

            } catch (error) {
                // Handle errors
                const aiMessageDiv = document.createElement('div');
                aiMessageDiv.className = 'message ai-message';
                aiMessageDiv.textContent = `[Error: ${error.message}]`;
                chatMessages.appendChild(aiMessageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }
    };

    // Send button click
    sendButton.addEventListener('click', sendMessage);

        // Enter key press (with shift+enter for new line)
        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    };

    // Start the initialization
    await loadComponents();
});
