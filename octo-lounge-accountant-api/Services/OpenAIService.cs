using OpenAI.Chat;
using OpenAI.Models;
using OpenAI.Assistants;
using System.Threading.Tasks;

namespace octo_lounge_accountant_api.Services
{
    public class OpenAIService
    {
        private readonly string _apiKey;

        public OpenAIService(string apiKey)
        {
            _apiKey = apiKey;
        }
        

        public async Task<string> GetResponseFromOpenAI(string prompt)
        {
            var openai = new OpenAIAPI(_apiKey);

            var completionRequest = new CompletionRequest
            {
                Prompt = prompt,
                MaxTokens = 500,
                Temperature = 0.2,
                TopP = 1,
                N = 1,
                StopSequences = null,
                FrequencyPenalty = 0,
                PresencePenalty = 0
            };

            var result = await openai.Completions.CreateCompletionAsync(completionRequest);
            return result.Completions[0].Text.Trim();
        }
    }
}

