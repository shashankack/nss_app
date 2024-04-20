from django.contrib import admin
from django.urls import path, include
import nss_profile.urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(nss_profile.urls)),
]
