from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from events.models import Venue


REAL_VENUES = [
    {
        "name": "Sheraton Bishkek",
        "address": "148B Kyiv Street, Bishkek, Kyrgyzstan",
        "capacity": 300,
        "description": "International hotel with event halls suitable for weddings and corporate events.",
        "price_per_hour": "12000.00",
    },
    {
        "name": "Novotel Bishkek City Center",
        "address": "Manas Avenue 16, Bishkek, Kyrgyzstan",
        "capacity": 220,
        "description": "City-center venue with modern banquet and conference spaces.",
        "price_per_hour": "9000.00",
    },
    {
        "name": "Hyatt Regency Bishkek",
        "address": "191 Abdrahmanov Street, Bishkek, Kyrgyzstan",
        "capacity": 250,
        "description": "Premium hotel venue for large celebrations and business events.",
        "price_per_hour": "15000.00",
    },
    {
        "name": "Orion Hotel Bishkek",
        "address": "Erkindik Boulevard 21, Bishkek, Kyrgyzstan",
        "capacity": 180,
        "description": "Elegant venue with service infrastructure for private events.",
        "price_per_hour": "10000.00",
    },
    {
        "name": "Supara Ethno Complex",
        "address": "Chunkurchak Gorge, Chuy Region, Kyrgyzstan",
        "capacity": 400,
        "description": "Traditional ethno-complex for large outdoor and cultural events.",
        "price_per_hour": "18000.00",
    },
]


class Command(BaseCommand):
    help = "Seeds the database with real-world venues."

    def add_arguments(self, parser):
        parser.add_argument(
            "--owner-email",
            type=str,
            required=False,
            help="Existing user email to assign as owner for seeded venues.",
        )

    def handle(self, *args, **options):
        owner = None
        owner_email = options.get("owner_email")
        if owner_email:
            User = get_user_model()
            owner = User.objects.filter(email=owner_email).first()
            if owner is None:
                self.stderr.write(self.style.WARNING(f"Owner with email '{owner_email}' not found. Seeding without owner."))

        created_count = 0
        updated_count = 0
        for item in REAL_VENUES:
            venue, created = Venue.objects.get_or_create(
                name=item["name"],
                address=item["address"],
                defaults={
                    "owner": owner,
                    "capacity": item["capacity"],
                    "description": item["description"],
                    "price_per_hour": item["price_per_hour"],
                    "phone": "+996700000000",
                    "whatsapp": "+996700000000",
                    "photos": [],
                    "amenities": ["parking"],
                    "is_active": True,
                },
            )
            if created:
                created_count += 1
            elif owner and venue.owner_id != owner.id:
                venue.owner = owner
                venue.save(update_fields=["owner"])
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed completed. Created {created_count} venues, updated {updated_count} venues."
            )
        )
