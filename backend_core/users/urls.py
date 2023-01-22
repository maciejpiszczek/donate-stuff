from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('register/', views.SignUpView.as_view(), name='registration'),
    path('login/', views.LogInView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('settings/<int:pk>', views.UserSettingsView.as_view(), name='user-settings'),
    path('password_change/', views.ChangePasswordView.as_view(), name='password-change'),
    path('password_change/done/', views.ChangePasswordDoneView.as_view(), name='password-change-done'),
]
