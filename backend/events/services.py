from .models import Event


def validate_no_time_overlap(venue, date, start_time, end_time, exclude_event_id=None):
    qs = Event.objects.filter(venue=venue, date=date)
    if exclude_event_id:
        qs = qs.exclude(id=exclude_event_id)

    overlap_exists = qs.filter(start_time__lt=end_time, end_time__gt=start_time).exists()
    if overlap_exists:
        raise ValueError('Venue is already booked for this time range.')


def validate_capacity(venue, requested_capacity):
    if requested_capacity and requested_capacity > venue.capacity:
        raise ValueError('Venue capacity is lower than requested capacity.')
