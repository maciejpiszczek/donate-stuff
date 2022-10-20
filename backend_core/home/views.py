from functools import reduce

from django.views.generic import TemplateView

from home.models import Donation, Institution


class LandingPageView(TemplateView):
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['bags_count'] = sum([donation.quantity for donation in Donation.objects.all()])
        context['inst_count'] = Institution.objects.count()

        foundations = Institution.objects.filter(type="1")
        ngos = Institution.objects.filter(type="2")
        local_fundrs = Institution.objects.filter(type="3")
        context['institutions'] = [(1, foundations), (2, ngos), (3, local_fundrs)]

        return context


class AddDonationView(TemplateView):
    template_name = 'form.html'
