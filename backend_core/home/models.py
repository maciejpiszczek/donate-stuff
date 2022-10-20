from django.db import models


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
        return self.name
