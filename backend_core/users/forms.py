from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import AuthenticationForm
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator


class RegistrationForm(forms.ModelForm):
    first_name = forms.CharField(widget=forms.TextInput(attrs={
        'placeholder': 'Imię',
    }))
    last_name = forms.CharField(widget=forms.TextInput(attrs={
        'placeholder': 'Nazwisko',
    }))
    password = forms.CharField(widget=forms.PasswordInput(attrs={
        'minlength': 5,
        'placeholder': 'Hasło'
    }))
    password_confirmation = forms.CharField(label='Password confirmation', widget=forms.PasswordInput(attrs={
        'placeholder': 'Powtórz hasło'
    }))
    email = forms.CharField(widget=forms.TextInput(attrs={
        'placeholder': 'Email',
        'validators': EmailValidator,
    }))

    class Meta:
        model = get_user_model()
        fields = ('first_name', 'last_name', 'email', 'password')

    def clean_email(self):
        email = self.cleaned_data.get('email')
        result = get_user_model().objects.filter(email=email)

        if len(result):
            raise ValidationError('Email is not unique!')

        return email

    def clean_password_confirmation(self):
        password = self.cleaned_data.get('password')
        password_confirmation = self.cleaned_data.get('password_confirmation')

        if password and password_confirmation and password != password_confirmation:
            raise ValidationError('Passwords are not matching!')

        return password_confirmation

    def save(self, commit=True):
        user = super().save(commit=False)
        user.username = self.cleaned_data.get('email')
        user.set_password(self.cleaned_data.get('password'))

        if commit:
            user.save()

        return user


class LoginForm(AuthenticationForm):
    username = forms.EmailField(label='Email', widget=forms.TextInput(attrs={
        'name': 'username',
        'placeholder': 'Email',
    }))

    password = forms.CharField(widget=forms.PasswordInput(attrs={
        'placeholder': 'Hasło',
    }))

    class Meta:
        fields = ('username', 'password')
