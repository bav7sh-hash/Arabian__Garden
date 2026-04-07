import type { MenuItem } from '@/lib/types'

export const SEED_MENU_ITEMS: Omit<MenuItem, 'id'>[] = [
  {
    name: 'Pizza',
    price: 200,
    category: 'Mains',
    description: 'Wood-fired crust with house tomato sauce and fresh mozzarella.',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
  },
  {
    name: 'Burger',
    price: 150,
    category: 'Mains',
    description: 'Grilled patty, cheddar, caramelized onions, brioche bun.',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
  },
  {
    name: 'Pasta',
    price: 180,
    category: 'Mains',
    description: 'Creamy Alfredo with herbs and parmesan.',
    image:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
  },
]
