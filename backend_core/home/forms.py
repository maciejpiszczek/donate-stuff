from django import forms
from . import models


class AddDonationForm(forms.ModelForm):
    institution = forms.ModelChoiceField(queryset=models.Institution.objects.all())

    class Meta:
        model = models.Donation
        fields = ('quantity', 'categories', 'institution', 'address', 'phone_number', 'city', 'zip_code',
                  'pick_up_date', 'pick_up_time', 'pick_up_comment')
