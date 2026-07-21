import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'canteen_backend.settings')
django.setup()

from django.core.management import call_command
from django.contrib.auth import get_user_model
from api.models import MenuItem

User = get_user_model()

def seed():
    print("Applying migrations...")
    call_command('makemigrations')
    call_command('migrate')

    # 1. Create Users
    print("\nSeeding Users...")
    
    # Admin Staff
    admin_email = 'admin@mits.edu'
    if not User.objects.filter(email=admin_email).exists():
        admin_user = User.objects.create_superuser(
            username='canteen_admin',
            email=admin_email,
            password='admin123',
            role='admin'
        )
        print(f"Created Admin Superuser: {admin_email} / admin123")
    else:
        print(f"Admin User {admin_email} already exists.")

    # Student User
    student_email = 'student@mits.edu'
    if not User.objects.filter(email=student_email).exists():
        student_user = User.objects.create_user(
            username='Student Demo',
            email=student_email,
            password='student123',
            role='student',
            phone='9876543210'
        )
        print(f"Created Student Demo: {student_email} / student123")
    else:
        print(f"Student User {student_email} already exists.")

    # 2. Create Menu Items
    print("\nSeeding Menu Items...")
    MenuItem.objects.all().delete() # Clean state

    menuData = [
      # BREAKFAST
      {
        "name": "Idly (3 pcs)",
        "category": "Breakfast",
        "price": 30,
        "description": "Soft, steamed rice cakes served with spicy sambar and coconut chutney.",
        "image_url": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80",
        "is_popular": False,
        "is_available": True,
        "rating": 4.5,
        "is_veg": True
      },
      {
        "name": "Plain Dosa",
        "category": "Breakfast",
        "price": 40,
        "description": "Crisp and golden rice crepe cooked to perfection, served with chutneys.",
        "image_url": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=500&q=80",
        "is_popular": False,
        "is_available": True,
        "rating": 4.3,
        "is_veg": True
      },
      {
        "name": "Pongal",
        "category": "Breakfast",
        "price": 45,
        "description": "A classic South Indian savory ghee lentil rice pudding, cooked with black pepper, ginger, and cashew nuts.",
        "image_url": "/images/pongal.jpg",
        "is_popular": True,
        "is_available": True,
        "rating": 4.7,
        "is_veg": True
      },
      {
        "name": "Poori",
        "category": "Breakfast",
        "price": 50,
        "description": "Golden, fluffy deep-fried whole wheat bread served with spiced potato masala and chutneys.",
        "image_url": "/images/poori.jpg",
        "is_popular": True,
        "is_available": True,
        "rating": 4.6,
        "is_veg": True
      },

      # LUNCH
      {
        "name": "Veg Biryani",
        "category": "Lunch",
        "price": 110,
        "description": "Fragrant basmati rice cooked with fresh seasonal vegetables and aromatic spices.",
        "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80",
        "is_popular": True,
        "is_available": True,
        "rating": 4.7,
        "is_veg": True
      },
      {
        "name": "Chicken Biryani",
        "category": "Lunch",
        "price": 170,
        "description": "Rich, aromatic basmati rice layered with tender marinated chicken, saffron, and fresh herbs.",
        "image_url": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=500&q=80",
        "is_popular": True,
        "is_available": True,
        "rating": 4.9,
        "is_veg": False
      },
      {
        "name": "Gobi Fried Rice",
        "category": "Lunch",
        "price": 100,
        "description": "Stir-fried rice tossed with crispy, spiced cauliflower florets and Asian sauces.",
        "image_url": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80",
        "is_popular": False,
        "is_available": True,
        "rating": 4.4,
        "is_veg": True
      },
      {
        "name": "Noodles",
        "category": "Lunch",
        "price": 90,
        "description": "Savory stir-fried Hakka noodles packed with crunchy julienned veggies.",
        "image_url": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80",
        "is_popular": False,
        "is_available": True,
        "rating": 4.3,
        "is_veg": True
      },
      {
        "name": "Chapati (2 pcs)",
        "category": "Lunch",
        "price": 40,
        "description": "Soft, roasted whole wheat flatbreads served with a rich vegetable kurma.",
        "image_url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=80",
        "is_popular": False,
        "is_available": True,
        "rating": 4.2,
        "is_veg": True
      },

      # SNACKS
      {
        "name": "Pizza",
        "category": "Snacks",
        "price": 150,
        "description": "Single-serving personal pizza loaded with tangy tomato sauce, vegetables, and hot bubbling cheese.",
        "image_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80",
        "is_popular": True,
        "is_available": True,
        "rating": 4.7,
        "is_veg": True
      },
      {
        "name": "French Fries",
        "category": "Snacks",
        "price": 90,
        "description": "Dynamic golden salted potato fingers served piping hot with tomato ketchup.",
        "image_url": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80",
        "is_popular": True,
        "is_available": True,
        "rating": 4.4,
        "is_veg": True
      },
      {
        "name": "Pasta",
        "category": "Snacks",
        "price": 120,
        "description": "Creamy, spiced Indian-style red or white sauce pasta tossed with bell peppers and corn.",
        "image_url": "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=500&q=80",
        "is_popular": False,
        "is_available": True,
        "rating": 4.3,
        "is_veg": True
      },
      {
        "name": "Maggi",
        "category": "Snacks",
        "price": 60,
        "description": "Everyone's favorite comfort food—2-minute instant noodles prepared with butter and classic masala.",
        "image_url": "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=500&q=80",
        "is_popular": False,
        "is_available": True,
        "rating": 4.8,
        "is_veg": True
      },
      {
        "name": "Ice Cream",
        "category": "Snacks",
        "price": 40,
        "description": "A scoop of premium, rich vanilla/chocolate ice cream topped with chocolate syrup.",
        "image_url": "/images/ice_cream.jpg",
        "is_popular": False,
        "is_available": True,
        "rating": 4.5,
        "is_veg": True
      },

      # HOT BEVERAGES
      {
        "name": "Coffee",
        "category": "Beverages",
        "price": 20,
        "description": "Aromatic South Indian filter coffee frothed with hot milk.",
        "image_url": "/images/coffee.jpg",
        "is_popular": False,
        "is_available": True,
        "rating": 4.6,
        "is_veg": True
      },
      {
        "name": "Tea",
        "category": "Beverages",
        "price": 15,
        "description": "Classic hot milk tea brewed with aromatic cardamom and ginger.",
        "image_url": "/images/tea.jpg",
        "is_popular": False,
        "is_available": True,
        "rating": 4.5,
        "is_veg": True
      },

      # COLD DRINKS
      {
        "name": "Coca-Cola",
        "category": "Beverages",
        "price": 40,
        "description": "Chilled, fizzy Coca-Cola bottle (250ml) to quench your thirst.",
        "image_url": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80",
        "is_popular": False,
        "is_available": True,
        "rating": 4.3,
        "is_veg": True
      },
      {
        "name": "Thumbs Up",
        "category": "Beverages",
        "price": 40,
        "description": "Strong, fizzy cola drink with a spicy punch.",
        "image_url": "/images/thumbs_up.jpg",
        "is_popular": False,
        "is_available": True,
        "rating": 4.5,
        "is_veg": True
      },
      {
        "name": "Sprite",
        "category": "Beverages",
        "price": 40,
        "description": "Refreshing, crisp, lemon-lime flavored carbonated soft drink.",
        "image_url": "/images/sprite.jpg",
        "is_popular": False,
        "is_available": True,
        "rating": 4.4,
        "is_veg": True
      },
      {
        "name": "Maaza",
        "category": "Beverages",
        "price": 35,
        "description": "Indulge in sweet, pulpy, delicious real mango drink.",
        "image_url": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=80",
        "is_popular": False,
        "is_available": True,
        "rating": 4.6,
        "is_veg": True
      },

      # MILKSHAKES
      {
        "name": "Chocolate Milkshake",
        "category": "Milkshakes",
        "price": 90,
        "description": "Rich, blended milkshake with chocolate syrup, cocoa powder, and vanilla ice cream.",
        "image_url": "/images/chocolate_milkshake.jpg",
        "is_popular": True,
        "is_available": True,
        "rating": 4.8,
        "is_veg": True
      },
      {
        "name": "Vanilla Milkshake",
        "category": "Milkshakes",
        "price": 80,
        "description": "Creamy, smooth milkshake made with premium vanilla beans and milk.",
        "image_url": "/images/vanilla_milkshake.jpg",
        "is_popular": False,
        "is_available": True,
        "rating": 4.4,
        "is_veg": True
      },
      {
        "name": "Strawberry Milkshake",
        "category": "Milkshakes",
        "price": 90,
        "description": "Delicious pink milkshake blended with fresh strawberries and sweet cream.",
        "image_url": "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=500&q=80",
        "is_popular": False,
        "is_available": True,
        "rating": 4.5,
        "is_veg": True
      }
    ]

    for item in menuData:
        MenuItem.objects.create(
            name=item['name'],
            category=item['category'],
            price=item['price'],
            description=item['description'],
            image_url=item['image_url'],
            is_popular=item['is_popular'],
            is_available=item['is_available'],
            rating=item['rating'],
            is_veg=item['is_veg']
        )
    
    print(f"Created {len(menuData)} food items successfully!")
    print("Database seeding completed.")

if __name__ == '__main__':
    seed()
