from django.urls import path
from . import views

app_name = 'home'

urlpatterns = [
    path('', views.LandingPageView.as_view(), name='index'),
    path('add_donation/', views.DonationCreateView.as_view(), name='add-donation'),
    path('done/', views.DonationConfirmView.as_view(), name='form-confirmation'),
]
