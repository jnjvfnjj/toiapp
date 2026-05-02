from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.management.base import BaseCommand

from events.models import Booking, Event, Venue


class Command(BaseCommand):
    help = "Seeds real venues, owner/organizer accounts, events and bookings."

    def add_arguments(self, parser):
        parser.add_argument(
            "--owner-email",
            type=str,
            default="owner.real@toiapp.local",
            help="Owner email to use/create.",
        )
        parser.add_argument(
            "--organizer-email",
            type=str,
            default="organizer.real@toiapp.local",
            help="Organizer email to use/create.",
        )
        parser.add_argument(
            "--password",
            type=str,
            default="RealData123!",
            help="Password for created users.",
        )

    def handle(self, *args, **options):
        User = get_user_model()
        owner_email = options["owner_email"]
        organizer_email = options["organizer_email"]
        password = options["password"]

        owner, owner_created = User.objects.get_or_create(
            email=owner_email,
            defaults={
                "username": "real_owner",
                "phone": "+996700100001",
                "role": "owner",
                "is_active": True,
            },
        )
        if owner_created:
            owner.set_password(password)
            owner.save(update_fields=["password"])

        organizer, organizer_created = User.objects.get_or_create(
            email=organizer_email,
            defaults={
                "username": "real_organizer",
                "phone": "+996700100002",
                "role": "organizer",
                "is_active": True,
            },
        )
        if organizer_created:
            organizer.set_password(password)
            organizer.save(update_fields=["password"])

        call_command("seed_real_venues", owner_email=owner.email)

        venues = list(Venue.objects.filter(owner=owner).order_by("id")[:3])
        if len(venues) < 3:
            venues = list(Venue.objects.all().order_by("id")[:3])

        if not venues:
            self.stderr.write(self.style.ERROR("No venues found after seeding."))
            return

        today = date.today()
        seed_events = [
            {
                "title": "Wedding Reception",
                "description": "Formal wedding reception with live music.",
                "date": today + timedelta(days=14),
                "start_time": "17:00:00",
                "end_time": "21:00:00",
                "guest_count": 180,
                "venue": venues[0],
                "status": "published",
            },
            {
                "title": "Corporate Gala Night",
                "description": "Company annual celebration and awards.",
                "date": today + timedelta(days=21),
                "start_time": "18:00:00",
                "end_time": "22:00:00",
                "guest_count": 140,
                "venue": venues[min(1, len(venues) - 1)],
                "status": "draft",
            },
            {
                "title": "Family Anniversary Toi",
                "description": "Large family event with dinner and photo zone.",
                "date": today + timedelta(days=28),
                "start_time": "16:00:00",
                "end_time": "20:00:00",
                "guest_count": 220,
                "venue": venues[min(2, len(venues) - 1)],
                "status": "published",
            },
        ]

        created_events = []
        for item in seed_events:
            event, _created = Event.objects.get_or_create(
                title=item["title"],
                organizer=organizer,
                venue=item["venue"],
                date=item["date"],
                defaults={
                    "description": item["description"],
                    "start_time": item["start_time"],
                    "end_time": item["end_time"],
                    "guest_count": item["guest_count"],
                    "status": item["status"],
                },
            )
            created_events.append(event)

        statuses = ["pending", "approved", "cancelled"]
        for idx, event in enumerate(created_events):
            Booking.objects.get_or_create(
                user=organizer,
                event=event,
                venue=event.venue,
                defaults={"status": statuses[idx % len(statuses)]},
            )

        self.stdout.write(self.style.SUCCESS("Real data seed completed successfully."))
        self.stdout.write(f"Owner: {owner.email}")
        self.stdout.write(f"Organizer: {organizer.email}")
        self.stdout.write("Password: " + password)
