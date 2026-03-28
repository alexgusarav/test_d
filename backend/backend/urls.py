"""
URL configuration for backend project.

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
from django.urls import path
from rest_framework import routers
from backend_api.views import RegisterView
from backend_api.views import LoginView, LogoutView, UserFilesView
from backend_api.views import AdminUsersZone,AdminFilesZone
from backend_api.views import get_csrf_token, download_file_view

router = routers.DefaultRouter()
router.register(r'adminusers', AdminUsersZone)
router.register(r'adminfiles', AdminFilesZone)
router.register(r'ownerfiles', UserFilesView, basename='files')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register',RegisterView.as_view(), name='register'),
    path('api/login', LoginView, name='login' ),
    path('api/logout', LogoutView, name='logout'),
    path('api/get-csrf/', get_csrf_token, name='get-csrf'),
    path('api/download/<file_id>/', download_file_view, name='download')
]

urlpatterns += router.urls