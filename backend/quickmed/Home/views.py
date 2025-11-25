from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Contact

@api_view(['POST'])
def save_contact(request):
    data = request.data

    Contact.objects.create(
        name=data.get("name"),
        email=data.get("email"),
        phone=data.get("phone"),
        service=data.get("service"),
        message=data.get("message"),
    )

    return Response({"message": "Contact saved successfully!"}, status=status.HTTP_201_CREATED)
