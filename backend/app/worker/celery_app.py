# from celery import Celery
# from app.core.config import get_settings

# settings = get_settings()

# celery_app = Celery(
#     "worker",
#     broker=settings.CELERY_BROKER_URL,
#     backend=settings.CELERY_RESULT_BACKEND,
#     include=["app.worker.tasks"]  # List of modules to import when the worker starts
# )

# celery_app.conf.update(
#     task_track_started=True,
#     # Add other Celery configurations here if needed
#     # result_expires=3600, # Example: Results expire in 1 hour
# )

# if __name__ == "__main__":
#     celery_app.start()

# print("Celery app module loaded. Configure broker/backend URLs in .env") 