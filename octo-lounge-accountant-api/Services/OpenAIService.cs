using OpenAI_API;

namespace octo_lounge_accountant_api.Services
{
    public class OpenAIService
    {
        private readonly string _apiKey;
        private readonly OpenAIAPI _openAiApi;

        public OpenAIService(string apiKey)
        {
            _apiKey = apiKey;
            _openAiApi = new OpenAIAPI(_apiKey);
        }

        public async Task<string> GetResponseFromOpenAI(string prompt)
        {
            var chat = _openAiApi.Chat.CreateConversation();
            
            // Configure the chat parameters
            chat.Model = OpenAI_API.Models.Model.GPT4;
            chat.RequestParameters.Temperature = 0.2;
            chat.RequestParameters.MaxTokens = 500;

            // Add the system message to set the context
            chat.AppendSystemMessage("You are a helpful assistant that extracts transaction details from text and returns them in JSON format.");
            
            // Add the user's prompt
            chat.AppendUserInput(prompt);

            // Get the response
            string response = await chat.GetResponseFromChatbotAsync();
            return response.Trim();
        }
    }
}

