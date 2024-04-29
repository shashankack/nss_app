from django.contrib import admin
from django.urls import path, include
import nss_profile.urls, nss_events.urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(nss_profile.urls)),
    path('api/', include(nss_events.urls)),
]
