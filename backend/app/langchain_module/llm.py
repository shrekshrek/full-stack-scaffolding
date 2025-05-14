# from langchain_openai import ChatOpenAI
# from langchain_anthropic import ChatAnthropic # Example for Anthropic
# from app.core.config import get_settings

# settings = get_settings()

# Example LLM initialization (adjust based on your needs and chosen provider)

# def get_openai_llm(temperature: float = 0.7, model_name: str = "gpt-3.5-turbo"):
#     if not settings.OPENAI_API_KEY:
#         raise ValueError("OPENAI_API_KEY is not set in environment variables.")
#     return ChatOpenAI(
#         openai_api_key=settings.OPENAI_API_KEY,
#         model_name=model_name,
#         temperature=temperature
#     )

# def get_anthropic_llm(temperature: float = 0.7, model_name: str = "claude-2"):
#     if not settings.ANTHROPIC_API_KEY:
#         raise ValueError("ANTHROPIC_API_KEY is not set in environment variables.")
#     return ChatAnthropic(
#         anthropic_api_key=settings.ANTHROPIC_API_KEY,
#         model_name=model_name,
#         temperature=temperature
#     )

# You might have a default LLM getter or a factory based on configuration
# def get_default_llm():
#     # Example: prioritize OpenAI if key is available, else try Anthropic, etc.
#     if settings.OPENAI_API_KEY:
#         return get_openai_llm()
#     # elif settings.ANTHROPIC_API_KEY:
#     #     return get_anthropic_llm()
#     else:
#         # Potentially raise an error or return a mock/dummy LLM for local dev if no keys
#         raise ValueError("No LLM API key configured.")

# print("Langchain LLM module loaded. Configure API keys in .env") 