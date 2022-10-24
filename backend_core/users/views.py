from functools import reduce

from django.urls import reverse_lazy
from django.views.generic import CreateView, DetailView
from django.contrib.auth import authenticate, login, get_user_model
from django.contrib.auth.views import LoginView, LogoutView
from django.shortcuts import redirect, render

from home import models
from .forms import RegistrationForm, LoginForm


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


class UserProfileView(DetailView):
    model = get_user_model()
    template_name = 'user-page.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['donations'] = models.Donation.objects.filter(user_id=self.request.user.id)
        context['bags_count'] = sum([don.quantity for don in context['donations']])
        context['inst_count'] = len(set([don.institution for don in context['donations']]))

        return context
