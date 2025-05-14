from httpx import AsyncClient
from fastapi import status

# from app.core.config import get_settings # If needed for constructing URLs or checking settings

# settings = get_settings()

async def test_health_check(client: AsyncClient):
    response = await client.get("/api/health") # Assuming /api/health from main.py
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"status": "OK"}

# Example of a test for a non-existent route (if you have a general 404 handler)
# async def test_not_found(client: AsyncClient):
#     response = await client.get("/api/v1/non_existent_route")
#     assert response.status_code == status.HTTP_404_NOT_FOUND
#     # Add more specific checks for the 404 response if needed
#     # assert response.json() == {"detail": "Not Found"} 