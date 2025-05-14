# from .celery_app import celery_app

# @celery_app.task
# def example_task(x, y):
#     return x + y

# @celery_app.task(bind=True)
# def self_aware_task(self, message: str):
#     print(f"Task ID: {self.request.id} received message: {message}")
#     # You can access task metadata via self.request
#     return f"Processed: {message}"

# print("Celery tasks module loaded.") 