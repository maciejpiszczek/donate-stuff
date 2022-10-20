from django.views.generic import TemplateView

from home.models import Donation, Institution


class LandingPageView(TemplateView):
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['donations_count'] = Donation.objects.count()
        context['inst_count'] = Institution.objects.count()

        return context


class AddDonationView(TemplateView):
    template_name = 'form.html'
