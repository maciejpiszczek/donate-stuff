from django.urls import path
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie

from config import settings
from . import views

app_name = 'home'

urlpatterns = [
    path('', vary_on_cookie(cache_page(settings.CACHE_TTL)(views.LandingPageView.as_view())), name='index'),
    path('add_donation/', views.DonationCreateView.as_view(), name='add-donation'),
]
