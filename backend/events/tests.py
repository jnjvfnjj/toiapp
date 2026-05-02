from datetime import date, time

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase

from .models import Event, Venue
from .services import validate_no_time_overlap

User = get_user_model()


class EventsApiTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            email='admin@test.local',
            username='admin',
            password='StrongPass123!',
            role='admin',
        )
        self.organizer = User.objects.create_user(
            email='org@test.local',
            username='org',
            password='StrongPass123!',
            role='organizer',
        )
        self.venue = Venue.objects.create(
            name='Hall',
            address='Address 1',
            capacity=150,
            description='desc',
            price_per_hour=1000,
        )

    def _token_for(self, email, password):
        url = reverse('token_obtain_pair')
        res = self.client.post(url, {'email': email, 'password': password}, format='json')
        self.assertEqual(res.status_code, 200, res.data)
        return res.data['access']

    def test_unauthorized_request_is_rejected(self):
        res = self.client.get('/api/events/')
        self.assertEqual(res.status_code, 401)

    def test_jwt_access_for_authorized_user(self):
        token = self._token_for('org@test.local', 'StrongPass123!')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        res = self.client.get('/api/events/')
        self.assertEqual(res.status_code, 200)

    def test_admin_can_create_venue(self):
        token = self._token_for('admin@test.local', 'StrongPass123!')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        payload = {
            'name': 'Grand Hall',
            'address': 'Center',
            'capacity': 200,
            'description': 'Large hall',
            'price_per_hour': '5000.00',
        }
        res = self.client.post('/api/venues/', payload, format='json')
        self.assertEqual(res.status_code, 201, res.data)

    def test_organizer_can_create_event(self):
        token = self._token_for('org@test.local', 'StrongPass123!')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        payload = {
            'title': 'Event A',
            'description': 'Desc',
            'date': '2026-05-01',
            'start_time': '10:00:00',
            'end_time': '12:00:00',
            'venue': self.venue.id,
            'status': 'draft',
            'guest_count': 80,
        }
        res = self.client.post('/api/events/', payload, format='json')
        self.assertEqual(res.status_code, 201, res.data)

    def test_overlap_validation_raises(self):
        Event.objects.create(
            title='A',
            description='A',
            date=date(2026, 1, 1),
            start_time=time(10, 0),
            end_time=time(12, 0),
            organizer=self.organizer,
            venue=self.venue,
        )
        with self.assertRaises(ValueError):
            validate_no_time_overlap(self.venue, date(2026, 1, 1), time(11, 0), time(13, 0))
