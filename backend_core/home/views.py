from django.views.generic import TemplateView


class LandingPageView(TemplateView):
    template_name = 'index.html'


class AddDonationView(TemplateView):
    template_name = 'form.html'
