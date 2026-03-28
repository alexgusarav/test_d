from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):

    # Разрешает доступ только администраторам

    def has_permission(self, request, view):
        return request.user and request.user.is_superuser

class IsOwnerOrReadOnly(permissions.BasePermission):

    # Разрешает доступ только владельцу объекта или администратору.

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            # читает владелец или администратор.
            return obj.owner == request.user or request.user.is_superuser
        # запись только владелец.
        return obj.owner == request.user