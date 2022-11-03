from django.db import models
from django.contrib.auth import get_user_model
from phonenumber_field.modelfields import PhoneNumberField


class Category(models.Model):
    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.name


class Institution(models.Model):
    class InstitutionTypes(models.TextChoices):
        FN = "1", "foundation"
        NGO = "2", "non-governmental organisation"
        FR = "3", "local fundraising"

    name = models.CharField(max_length=200, unique=True)
    description = models.TextField()
    type = models.CharField(max_length=200, choices=InstitutionTypes.choices, default=InstitutionTypes.FN)
    categories = models.ManyToManyField('Category', related_name='institutions')

    def __str__(self):
        return f'{self.name} ({self.get_type_display()}) - {", ".join([category.name for category in self.categories.all()])}'


class Donation(models.Model):
    quantity = models.PositiveIntegerField()
    categories = models.ManyToManyField('Category', related_name='donations')
    institution = models.ForeignKey('Institution', on_delete=models.CASCADE)
    address = models.CharField(max_length=200)
    phone_number = PhoneNumberField(null=False, blank=False)
    city = models.CharField(max_length=200)
    zip_code = models.CharField(max_length=6)
    pick_up_date = models.DateField()
    pick_up_time = models.TimeField()
    pick_up_comment = models.TextField(default="", blank=True)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, null=True)
    is_taken = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.pick_up_date} {self.pick_up_time} - {self.city} - {self.institution.name}'

    class Meta:
        ordering = ['is_taken', 'pick_up_date']
