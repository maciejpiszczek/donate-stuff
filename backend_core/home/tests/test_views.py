import pytest
from django.urls import reverse


@pytest.mark.django_db
def test_view_home(client):
    url = reverse('home:index')
    response = client.get(url)

    assert response.status_code == 200
    assert '<!DOCTYPE html>' in response.content.decode('UTF-8')
