from django.views.generic import TemplateView, CreateView
from django.urls import reverse_lazy
from django.http import HttpResponseRedirect
from django.contrib.auth.mixins import LoginRequiredMixin

from home.forms import AddDonationForm
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


class DonationCreateView(LoginRequiredMixin, CreateView):
    model = Donation
    template_name = 'form.html'
    form_class = AddDonationForm
    login_url = reverse_lazy('users:login')
    success_url = 'form-confirmation.html'

    def form_valid(self, form):
        donation = form.save(commit=False)
        donation.user = self.request.user
        donation.save()
        return HttpResponseRedirect(self.get_success_url())

    def get_success_url(self):
        return reverse_lazy('form-confirmation.html')


class DonationConfirmView(TemplateView):
    template_name = 'form-confirmation.html'
