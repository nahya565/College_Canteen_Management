from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.views.static import serve
from django.conf import settings

DIST_DIR = settings.BASE_DIR.parent / 'dist'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    re_path(r'^assets/(?P<path>.*)$', serve, {'document_root': DIST_DIR / 'assets'}),
    re_path(r'^images/(?P<path>.*)$', serve, {'document_root': DIST_DIR / 'images'}),
    re_path(r'^(?P<path>favicon\.svg|icons\.svg)$', serve, {'document_root': DIST_DIR}),
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='frontend'),
]


