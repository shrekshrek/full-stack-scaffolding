# Utility functions for LangChain module

# Example: A custom output parser (very basic)
# from langchain_core.output_parsers import BaseOutputParser
# from typing import Any

# class CustomJSONOutputParser(BaseOutputParser):
#     """Parse the output of an LLM call to a JSON object."""

#     def parse(self, text: str) -> Any:
#         import json
#         try:
#             # Attempt to find a JSON block if the LLM includes preamble/postamble text
#             json_match = re.search(r"```json\n(.*?)\n```", text, re.DOTALL)
#             if json_match:
#                 text = json_match.group(1)
#             return json.loads(text)
#         except json.JSONDecodeError as e:
#             # Handle cases where the output is not valid JSON
#             # You might want to log the error and the problematic text
#             # Or attempt a more lenient parsing strategy
#             raise ValueError(f"Failed to parse LLM output as JSON: {e}\nOutput: {text}") from e

# print("Langchain utils module loaded.") 