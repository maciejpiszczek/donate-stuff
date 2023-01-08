from django import forms
from . import models


class AddDonationForm(forms.ModelForm):
    categories = forms.ModelMultipleChoiceField(queryset=models.Category.objects.all(),
                                                widget=forms.CheckboxSelectMultiple)
    institution = forms.ModelChoiceField(queryset=models.Institution.objects.all(),
                                         widget=forms.RadioSelect)

    class Meta:
        model = models.Donation
        fields = ('quantity', 'categories', 'institution', 'address', 'phone_number', 'city', 'zip_code',
                  'pick_up_date', 'pick_up_time', 'pick_up_comment')
