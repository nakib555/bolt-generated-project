import { extractCodeFromMarkdown } from "@/lib/utils";

const DEFAULT_API_KEY = "AIzaSyACnwbJGLaXfmW_QVtin9hlpdLyhh-LLJo";
const GOOGLE_SEARCH_API_KEY = "AIzaSyDzYny8oRzyBKqt9i6B4_u_NsiopPETA5Y";
const GOOGLE_SEARCH_ENGINE_ID = "f2b4f3f852e3242c1";

export const useApiService = () => {
  const generateContent = async (model: string, input: string, apiKey?: string): Promise<string> => {
    try {
      if (!input || typeof input !== 'string') {
        throw new Error("Input must be a non-empty string.");
      }

      if (!model || typeof model !== 'string') {
        throw new Error("Model name must be a non-empty string.");
      }

      const requestBody = {
        contents: [{
          parts: [{ text: input }],
        }],
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey || DEFAULT_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || errorMessage;
          console.error("API Error Details:", errorData);
        } catch (jsonError) {
          console.error("Failed to parse error JSON:", jsonError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (!data || !data.candidates || data.candidates.length === 0 || !data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
        throw new Error("Invalid API response format.");
      }
      return data.candidates[0].content.parts[0].text;
    } catch (error: any) {
      console.error('Error fetching data:', error);
      throw new Error(error.message || 'Failed to fetch data from API');
    }
  };

  const fetchGoogleResults = async (query: string) => {
    try {
      if (!query || typeof query !== 'string') {
        throw new Error("Query must be a non-empty string.");
      }
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error(`Google Search API error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data || !data.items) {
        return 'No search results found.';
      }
      return data.items?.map((item: any) => item.snippet).join('\n') || 'No search results found.';
    } catch (error: any) {
      console.error("Error fetching Google search results:", error);
      return 'Error fetching search results.';
    }
  };

  return { generateContent, fetchGoogleResults };
};
