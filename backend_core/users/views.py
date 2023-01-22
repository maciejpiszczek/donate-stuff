import json

from django.urls import reverse_lazy
from django.views.generic import CreateView, TemplateView, UpdateView
from django.contrib.auth import authenticate, login, get_user_model
from django.contrib.auth.views import LoginView, LogoutView, PasswordChangeView, PasswordChangeDoneView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect, render, get_object_or_404
from django.http import HttpResponse

from home import models
from .forms import RegistrationForm, LoginForm, ChangePasswordForm
import datetime


class SignUpView(CreateView):
    form_class = RegistrationForm
    success_url = reverse_lazy('login')
    template_name = 'register.html'


class LogInView(LoginView):
    def get(self, request, *args, **kwargs):
        form = LoginForm()
        return render(request, 'login.html', {'form': form})

    def post(self, request, *args, **kwargs):
        form = LoginForm(request, request.POST)

        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')

            user = authenticate(email=username, password=password)
            if user is not None:
                if user.is_active:
                    login(request, user)
                    return redirect(reverse_lazy('home:index'))

        return redirect(reverse_lazy('users:registration'))


class UserProfileView(LoginRequiredMixin, TemplateView):
    model = get_user_model()
    template_name = 'user-page.html'

    def get_object(self, queryset=None):
        return self.request.user

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['donations'] = models.Donation.objects.filter(user_id=self.request.user.id)
        context['today'] = datetime.date.today()
        context['bags_count'] = sum([don.quantity for don in context['donations']])
        context['inst_count'] = len(set([don.institution for don in context['donations']]))

        return context

    def post(self, request, *args, **kwargs):
        json_data = json.loads(self.request.body)

        donation = get_object_or_404(models.Donation, id=int(json_data["donation_id"]))
        donation.is_taken = True
        donation.save()

        return HttpResponse(status=200)


class UserSettingsView(LoginRequiredMixin, UpdateView):
    model = get_user_model()
    fields = ('first_name', 'last_name')
    template_name = 'user-settings.html'
    raise_exception = False
    context_object_name = 'profile'
    success_url = reverse_lazy('users:user-profile')

    def form_valid(self, form):
        form.instance.owner = self.request.user
        form.save()
        return super().form_valid(form)


class ChangePasswordView(PasswordChangeView):
    form_class = ChangePasswordForm
    template_name = 'password-change.html'


class ChangePasswordDoneView(PasswordChangeDoneView):
    template_name = 'password-change-done.html'
