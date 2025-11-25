from django.urls import path
from .views import save_contact

urlpatterns = [
    path("contact/submit/", save_contact),
]
