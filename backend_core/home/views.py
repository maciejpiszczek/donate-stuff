import json

from django.views.generic import TemplateView, CreateView
from django.db import DatabaseError
from django.urls import reverse_lazy
from django.http import HttpResponse
from django.contrib.auth.mixins import LoginRequiredMixin

from home.forms import AddDonationForm
from home.models import Category, Donation, Institution


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

    def post(self, request, *args, **kwargs):
        form_data = json.loads(self.request.body)

        try:
            donation = Donation.objects.create(
                quantity=form_data['quantity'],
                institution=Institution.objects.get(id=int(form_data['institution'])),
                address=form_data['address'],
                phone_number=form_data['phone_number'],
                city=form_data['city'],
                zip_code=form_data['zip_code'],
                pick_up_date=form_data['pick_up_date'],
                pick_up_time=form_data['pick_up_time'],
                pick_up_comment=form_data['pick_up_comment'],
                user=self.request.user,
            )
            for cat in form_data['categories']:
                donation.categories.add(Category.objects.get(id=int(cat)))
            return HttpResponse(status=200)

        except DatabaseError:
            return HttpResponse(status=400)


class DonationConfirmView(TemplateView):
    template_name = 'form-confirmation.html'
