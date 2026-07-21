from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, UserProfileView, MenuItemViewSet, OrderViewSet, ReviewViewSet, AdminStatsView

router = DefaultRouter()
router.register(r'menu', MenuItemViewSet, basename='menu')
router.register(r'orders', OrderViewSet, basename='orders')
router.register(r'reviews', ReviewViewSet, basename='reviews')

urlpatterns = [
    # Auth endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', UserProfileView.as_view(), name='profile'),
    
    # Custom Admin stats
    path('admin/stats/', AdminStatsView.as_view(), name='admin_stats'),
    
    # Viewset endpoints
    path('', include(router.urls)),
]
