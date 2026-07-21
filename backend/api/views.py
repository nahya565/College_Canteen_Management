from rest_framework import viewsets, generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.db.models import Sum, Count
from django.utils import timezone
from .models import MenuItem, Order, Review
from .serializers import UserProfileSerializer, RegisterSerializer, MenuItemSerializer, OrderSerializer, ReviewSerializer
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
User = get_user_model()

# Custom Register view
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

# Get user profile
class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user

# MenuItem CRUD
class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all().order_by('-id')
    serializer_class = MenuItemSerializer

    def get_permissions(self):
        # Admins can do CRUD; anyone can list/retrieve
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

# Order management
class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin' or user.is_staff:
            return Order.objects.all().order_by('-id')
        return Order.objects.filter(user=user).order_by('-id')

    def perform_create(self, serializer):
        order = serializer.save(user=self.request.user)
        print("========== ORDER CREATED ==========")
        print("User:", self.request.user.email)
        print("Order ID:", order.id)    
        print("Order created")
        print("Student Email:", self.request.user.email)
        print("Sending student email...")
        print("Student email sent.")
        print("Admin Email:", self.request.user.email)
        print("Sending admin email...")
        print("Admin email sent.")

        subject = "🍽️ MITS Canteen - Order Confirmation"
        items_text = ""
        items_html = ""

        for item in order.items_json:
            item_total = item["price"] * item["qty"]

            items_text += (
            f"- {item['name']} × {item['qty']} "
            f"@ ₹{item['price']} = ₹{item_total}\n"
            )

            items_html += f"""
<tr>
    <td style="padding:10px;border:1px solid #ddd;">{item['name']}</td>
    <td style="padding:10px;border:1px solid #ddd;text-align:center;">{item['qty']}</td>
    <td style="padding:10px;border:1px solid #ddd;text-align:right;">
        ₹{item_total}
    </td>
</tr>
"""

        text_content = f"""
Hi {self.request.user.username},

Your order has been placed successfully.

Order ID: {order.id}

Ordered Items:
{items_text}

Total Amount: ₹{order.grand_total}
Status: {order.status}

Thank you for ordering from the MITS Canteen!
"""

        html_content = f"""
<html>
<body style="font-family:Arial;background:#f5f5f5;padding:20px;">
<div style="max-width:600px;margin:auto;background:white;padding:25px;border-radius:10px;">
<h2 style="color:#ff6b35;">🍽️ MITS Canteen</h2>

<h3>Hello {self.request.user.username},</h3>

<p>Your order has been placed successfully.</p>

<table style="width:100%;border-collapse:collapse;">
<tr>
    <td><b>Order ID</b></td>
    <td>#{order.id}</td>
</tr>

<tr>
    <td colspan="2">
        <h4 style="margin:15px 0 10px 0;color:#ff6b35;">
            🍽️ Ordered Items
        </h4>

        <table style="width:100%;border-collapse:collapse;border:1px solid #ddd;">
            <tr style="background:#ff6b35;color:white;">
                <th style="padding:10px;border:1px solid #ddd;">Item Name</th>
                <th style="padding:10px;border:1px solid #ddd;">Qty</th>
                <th style="padding:10px;border:1px solid #ddd;">Price</th>
            </tr>

            {items_html}
        </table>
    </td>
</tr>

<tr>
    <td><b>Total Amount</b></td>
    <td>₹{order.grand_total}</td>
</tr>

<tr>
    <td><b>Status</b></td>
    <td>{order.status.title()}</td>
</tr>
</table>

<br>

<p>Thank you for ordering from the MITS Canteen.</p>

<hr>

<p style="color:gray;font-size:12px;">
This is an automated email from the MITS Canteen Management System.
</p>

</div>
</body>
</html>
"""

        try:
            email = EmailMultiAlternatives(
                subject,
                text_content,
                settings.DEFAULT_FROM_EMAIL,
                [self.request.user.email],
        )

            email.attach_alternative(html_content, "text/html")
            email.send(fail_silently=True)

            # Admin email
            admin_subject = "🔔 New Order Received"

            admin_message = f"""
A new order has been placed.

Student Name : {self.request.user.username}
Student Email: {self.request.user.email}

Order ID : {order.id}
Amount   : ₹{order.grand_total}
Status   : {order.status}
"""

            admin_email = EmailMultiAlternatives(
                admin_subject,
                admin_message,
                settings.DEFAULT_FROM_EMAIL,
                ["nahyajaswitha@gmail.com"],   # Change to your admin email if needed
            )

            admin_email.send(fail_silently=True)
            print("Admin email sent successfully")
        except Exception as e:
            print("Error sending order confirmation email:", e)

    def perform_update(self, serializer):
        print("perform_update() called")
        order = serializer.save()
        print("Status:", order.status)
        # Food Ready Email
        if order.status == "ready":
            subject = "🍽️ Your Food is Ready"

            message = f"""
Hi {order.user.username},

Your order is ready for pickup.

Order ID : {order.id}
Amount   : ₹{order.grand_total}

Please collect your order from the canteen.

Thank you!
"""

            EmailMultiAlternatives(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [order.user.email],
            ).send(fail_silently=True)

        # Payment Completed Email
        elif order.status == "completed":
            subject = "✅ Payment Completed"

            message = f"""
Hi {order.user.username},

Your payment has been completed successfully.

Order ID : {order.id}
Amount   : ₹{order.grand_total}

Thank you for ordering from MITS College Canteen.
"""

            EmailMultiAlternatives(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [order.user.email],
            ).send(fail_silently=True)

            # Admin Notification
            EmailMultiAlternatives(
                "💰 Payment Completed",
                f"""
Payment Completed

Student : {order.user.username}
Email   : {order.user.email}

Order ID : {order.id}
Amount   : ₹{order.grand_total}
""",
                settings.DEFAULT_FROM_EMAIL,
                ["nahyajaswitha@gmail.com"],
            ).send(fail_silently=True)
    def get_permissions(self):
        if self.action == "destroy":
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

# Review management
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-id')
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Admin stats/metrics
class AdminStatsView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        today = timezone.localtime(timezone.now()).date()
        
        # Calculate stats
        total_sales = Order.objects.exclude(status='cancelled').aggregate(total=Sum('grand_total'))['total'] or 0
        total_orders = Order.objects.count()
        today_orders = Order.objects.filter(created_at__date=today).count()
        pending_orders = Order.objects.filter(status='pending').count()
        
        return Response({
            'total_sales': float(total_sales),
            'total_orders': total_orders,
            'today_orders': today_orders,
            'pending_orders': pending_orders
        })
