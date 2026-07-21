from django.db import models
from django.contrib.auth.models import AbstractUser

class UserProfile(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    phone = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

class MenuItem(models.Model):
    CATEGORY_CHOICES = (
        ('Breakfast', 'Breakfast'),
        ('Lunch', 'Lunch'),
        ('Snacks', 'Snacks'),
        ('Beverages', 'Beverages'),
        ('Milkshakes', 'Milkshakes'),
    )
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    is_popular = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.5)
    is_veg = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready for Pickup'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='orders')
    items_json = models.JSONField() # Stores list of items ordered: [{"id": 1, "name": "Idly", "price": 30, "qty": 2}]
    subtotal = models.DecimalField(max_digits=8, decimal_places=2)
    gst = models.DecimalField(max_digits=8, decimal_places=2)
    grand_total = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} by {self.user.username} - {self.status}"

class Review(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='reviews')
    rating = models.DecimalField(max_digits=2, decimal_places=1)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} - {self.rating}★"
