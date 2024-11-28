document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Sidebar
    const loadComponents = async () => {
        try {
            const componentsResponse = await fetch('components.html');
            const componentsHtml = await componentsResponse.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(componentsHtml, 'text/html');

            // Insert into document
            const aiSidebar = doc.querySelector('.ai-sidebar');
            if (aiSidebar) {
                document.body.appendChild(aiSidebar);
            }

            // Initialize functionality
            initAIChat();
        } catch (error) {
            console.error('Error loading components:', error);
        }
    };

    const initAIChat = () => {
        const aiSidebar = document.getElementById('ai-sidebar');
        const toggleButton = document.getElementById('toggle-ai-sidebar');
        const closeButton = document.querySelector('.close-ai-sidebar');
        const sendButton = document.getElementById('send-message');
        const userInput = document.getElementById('user-input');
        const chatMessages = document.getElementById('chat-messages');

        if (!aiSidebar || !toggleButton || !closeButton || !sendButton || !userInput || !chatMessages) {
            console.error('Some AI chat elements not found');
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
    const sendMessage = () => {
        const message = userInput.value.trim();
        if (message) {
            // Add user message to chat
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'message user-message';
            userMessageDiv.textContent = message;
            chatMessages.appendChild(userMessageDiv);
            
            // Clear input
            userInput.value = '';
            
            // TODO: Integrate with ChatGPT API
            // Placeholder response
            const aiMessageDiv = document.createElement('div');
            aiMessageDiv.className = 'message ai-message';
            aiMessageDiv.textContent = "AI integration coming soon...";
            chatMessages.appendChild(aiMessageDiv);
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
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
