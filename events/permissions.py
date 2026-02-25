from rest_framework.permissions import BasePermission, SAFE_METHODS


class OnlyAdminCanManageVenue(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'admin'
        )


class OnlyOrganizerCanModifyEvent(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return bool(request.user and request.user.is_authenticated)
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ('organizer', 'admin')
        )

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        if request.user.role == 'admin':
            return True
        return obj.organizer_id == request.user.id


class BookingPermission(BasePermission):
    """
    - Любой авторизованный пользователь может читать и создавать свои брони.
    - Только admin может менять статус/редактировать/удалять бронь.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in SAFE_METHODS or request.method == 'POST':
            return True
        return request.user.role == 'admin'

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        if request.method in SAFE_METHODS:
            return obj.user_id == request.user.id
        return False
