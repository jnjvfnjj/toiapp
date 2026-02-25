from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework_simplejwt.views import TokenRefreshView
from toiapp.views import index
from users.views import CustomTokenObtainPairView

schema_view = get_schema_view(
    openapi.Info(
        title="ToiApp API",
        default_version="v1",
        description="Users, events, venues and bookings API",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = []

if settings.DEBUG:
    assets_path = settings.BASE_DIR / 'templates' / 'build' / 'assets'
    if assets_path.exists():
        urlpatterns.append(re_path(r'^assets/(?P<path>.*)$', serve, {'document_root': assets_path}))
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns += [
    path('admin/', admin.site.urls),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('users.urls')),
    path('api/', include('events.urls')),
]

urlpatterns += [
    re_path(r'^.*$', index, name='index'),
]
