"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from toiapp.views import index
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

urlpatterns = []

# 1. СНАЧАЛА статические файлы (должны быть ПЕРВЫМИ, чтобы не перехватывались catch-all)
if settings.DEBUG:
    # Serve React build assets
    assets_path = settings.BASE_DIR / 'templates' / 'build' / 'assets'
    if assets_path.exists():
        def serve_assets(request, path):
            """Отдает статические файлы из build/assets с правильными заголовками"""
            from django.http import HttpResponse, Http404
            import os
            
            # Полный путь к файлу
            file_path = assets_path / path
            
            # Проверяем безопасность пути (защита от path traversal)
            try:
                file_path = file_path.resolve()
                if not str(file_path).startswith(str(assets_path.resolve())):
                    raise Http404("File not found")
            except (ValueError, OSError):
                raise Http404("File not found")
            
            # Проверяем существование файла
            if not file_path.exists() or not file_path.is_file():
                raise Http404("File not found")
            
            # Читаем файл
            try:
                with open(file_path, 'rb') as f:
                    content = f.read()
            except IOError:
                raise Http404("File not found")
            
            # Определяем Content-Type
            content_type = 'application/octet-stream'
            if path.endswith('.js'):
                content_type = 'application/javascript; charset=utf-8'
            elif path.endswith('.css'):
                content_type = 'text/css; charset=utf-8'
            elif path.endswith('.json'):
                content_type = 'application/json; charset=utf-8'
            elif path.endswith('.png'):
                content_type = 'image/png'
            elif path.endswith('.jpg') or path.endswith('.jpeg'):
                content_type = 'image/jpeg'
            elif path.endswith('.svg'):
                content_type = 'image/svg+xml'
            
            # Создаем ответ
            response = HttpResponse(content, content_type=content_type)
            response['Cache-Control'] = 'public, max-age=31536000'
            return response
        
        urlpatterns.append(re_path(r'^assets/(?P<path>.*)$', serve_assets))
    
    # Serve Vite dev server assets (если используется dev режим)
    src_path = settings.BASE_DIR / 'templates' / 'src'
    if src_path.exists():
        urlpatterns.append(re_path(r'^src/(?P<path>.*)$', serve, {
            'document_root': src_path
        }))
    
    node_modules_path = settings.BASE_DIR / 'templates' / 'node_modules'
    if node_modules_path.exists():
        urlpatterns.append(re_path(r'^node_modules/(?P<path>.*)$', serve, {
            'document_root': node_modules_path
        }))
    
    # Django static files
    urlpatterns += static(
        settings.STATIC_URL,
        document_root=settings.STATIC_ROOT
    )

# 2. Admin маршруты
urlpatterns += [
    path('admin/', admin.site.urls),
]

# 3. API маршруты
urlpatterns += [
    path('api/', include('toiapp.urls')),
]

# 4. React catch-all (ПОСЛЕДНИМ, чтобы не перехватывать другие маршруты)
urlpatterns += [
    re_path(r'^.*$', index, name='index'),
]