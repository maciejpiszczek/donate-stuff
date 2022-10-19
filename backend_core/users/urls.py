from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('register/', views.SignUpView.as_view(), name='registration'),
    path('login/', views.LogInView.as_view(), name='login'),
]
