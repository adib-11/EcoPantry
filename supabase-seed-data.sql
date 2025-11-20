-- =============================================
-- EcoPantry Data Seeding Script
-- Run this AFTER schema and RLS policies
-- =============================================

-- =============================================
-- SEED SUSTAINABILITY TIPS
-- =============================================

insert into public.resources (title, category, content, icon, is_public) values
  ('FIFO Method', 'tip', 'First In, First Out - use older items before newer ones to prevent waste. Label items with purchase dates to track freshness.', '🔄', true),
  ('Proper Storage', 'tip', 'Store vegetables in the crisper drawer and keep herbs in water like flowers. Keep bananas separate from other fruits.', '❄️', true),
  ('Meal Planning', 'tip', 'Plan your weekly meals based on what''s expiring soon in your pantry. Make a shopping list to avoid overbuying.', '📅', true),
  ('Composting', 'tip', 'Turn unavoidable food waste into nutrient-rich compost for plants. Vegetable peels and fruit scraps work great.', '🌱', true),
  ('Temperature Control', 'tip', 'Keep your refrigerator at 4°C or below to extend food freshness. Check the temperature regularly.', '🌡️', true),
  ('Portion Control', 'tip', 'Cook and serve appropriate portions to avoid plate waste. You can always serve seconds if needed.', '🍽️', true),
  ('Freeze Extras', 'tip', 'Freeze leftover ingredients and meals for later use. Most cooked foods can be frozen for up to 3 months.', '🧊', true),
  ('Use Leftovers', 'tip', 'Transform leftovers into new dishes instead of discarding them. Yesterday''s rice makes great fried rice today.', '♻️', true),
  ('Root to Stem Cooking', 'tip', 'Use vegetable stems, leaves, and peels creatively. Radish leaves make great stir-fries, potato peels can be roasted.', '🥬', true),
  ('Preserve Seasonal Items', 'tip', 'Pickle or preserve seasonal vegetables when abundant. Make chutneys, pickles, or sun-dried items to enjoy year-round.', '🫙', true),
  ('Organize Your Fridge', 'tip', 'Keep items visible at eye level. Store frequently used items in front. This prevents forgotten food in the back.', '📦', true),
  ('Buy Local & Seasonal', 'tip', 'Purchase locally grown seasonal produce. They last longer and support local farmers in Bangladesh.', '🛒', true),
  ('Understand Expiry Dates', 'tip', '''Best Before'' dates are about quality, not safety. Use your senses to check if food is still good to eat.', '📆', true),
  ('Share Excess Food', 'tip', 'Share excess food with neighbors, family, or local community centers. Don''t let good food go to waste.', '🤝', true),
  ('Water Management', 'tip', 'Reuse water from washing rice or vegetables to water plants. Every drop counts in reducing waste.', '💧', true);

-- =============================================
-- SEED BANGLADESHI RECIPES
-- =============================================

insert into public.resources (
  title, category, content, image_url, ingredients, expiring_ingredients, 
  prep_time, difficulty, is_public
) values
  (
    'Quick Potato Curry (Aloo Torkari)',
    'recipe',
    'A simple and delicious Bengali potato curry perfect for using expiring potatoes. Serve with rice or roti.',
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    '["Potato", "Onion", "Mustard Oil", "Green Chili", "Turmeric", "Cumin", "Salt"]'::jsonb,
    '["Potato", "Green Chili"]'::jsonb,
    '30 min',
    'Easy',
    true
  ),
  (
    'Spicy Dal Fry (Masoor Dal)',
    'recipe',
    'Traditional Bengali dal preparation using red lentils. A staple dish packed with protein and flavor.',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
    '["Red Lentils", "Onion", "Green Chili", "Turmeric", "Cumin", "Ghee", "Garlic"]'::jsonb,
    '["Red Lentils"]'::jsonb,
    '40 min',
    'Easy',
    true
  ),
  (
    'Hilsha Paturi',
    'recipe',
    'Classic Bengali preparation of Hilsha fish wrapped in banana leaf with mustard paste. A delicacy that showcases fresh fish.',
    'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400',
    '["Hilsha Fish", "Mustard Paste", "Green Chili", "Turmeric", "Mustard Oil", "Banana Leaf"]'::jsonb,
    '["Hilsha Fish"]'::jsonb,
    '45 min',
    'Medium',
    true
  ),
  (
    'Mixed Vegetable Bhaji',
    'recipe',
    'Use up any expiring vegetables in this versatile stir-fry. Perfect for reducing waste while making a nutritious meal.',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    '["Mixed Vegetables", "Onion", "Garlic", "Ginger", "Turmeric", "Cumin", "Mustard Seeds"]'::jsonb,
    '["Mixed Vegetables", "Onion"]'::jsonb,
    '25 min',
    'Easy',
    true
  ),
  (
    'Chicken Rezala',
    'recipe',
    'A mild, creamy chicken curry from Mughlai cuisine. Great for using chicken before it expires.',
    'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
    '["Chicken", "Yogurt", "Onion", "Cashew Paste", "Green Chili", "Ginger-Garlic Paste", "Ghee"]'::jsonb,
    '["Chicken", "Yogurt"]'::jsonb,
    '50 min',
    'Medium',
    true
  ),
  (
    'Vegetable Khichuri',
    'recipe',
    'A one-pot meal combining rice, lentils, and vegetables. Perfect comfort food that uses multiple ingredients.',
    'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=400',
    '["Rice", "Lentils", "Mixed Vegetables", "Onion", "Ginger", "Turmeric", "Ghee"]'::jsonb,
    '["Mixed Vegetables", "Lentils"]'::jsonb,
    '35 min',
    'Easy',
    true
  ),
  (
    'Begun Bhaja (Eggplant Fry)',
    'recipe',
    'Crispy fried eggplant slices with turmeric and salt. A quick side dish to use up eggplants.',
    'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400',
    '["Eggplant", "Turmeric", "Salt", "Mustard Oil"]'::jsonb,
    '["Eggplant"]'::jsonb,
    '20 min',
    'Easy',
    true
  ),
  (
    'Chingri Malai Curry',
    'recipe',
    'Prawns cooked in coconut milk. A luxurious dish to prepare when prawns are about to expire.',
    'https://images.unsplash.com/photo-1633504581786-316c8002b1b9?w=400',
    '["Prawns", "Coconut Milk", "Onion", "Ginger-Garlic Paste", "Green Chili", "Ghee"]'::jsonb,
    '["Prawns", "Coconut Milk"]'::jsonb,
    '40 min',
    'Medium',
    true
  ),
  (
    'Tomato Chutney',
    'recipe',
    'Sweet and tangy tomato chutney. Perfect way to preserve expiring tomatoes for weeks.',
    'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400',
    '["Tomatoes", "Sugar", "Mustard Seeds", "Dried Red Chili", "Salt", "Mustard Oil"]'::jsonb,
    '["Tomatoes"]'::jsonb,
    '30 min',
    'Easy',
    true
  ),
  (
    'Macher Jhol (Fish Curry)',
    'recipe',
    'Light fish curry with minimal spices. A Bengali staple that''s quick to make with fresh or expiring fish.',
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400',
    '["Fish", "Potato", "Onion", "Turmeric", "Green Chili", "Ginger Paste", "Mustard Oil"]'::jsonb,
    '["Fish", "Potato"]'::jsonb,
    '35 min',
    'Easy',
    true
  ),
  (
    'Panta Bhat (Fermented Rice)',
    'recipe',
    'Traditional way to use leftover rice by fermenting overnight. A zero-waste staple enjoyed especially during Pohela Boishakh.',
    'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400',
    '["Leftover Rice", "Water", "Salt", "Green Chili", "Onion"]'::jsonb,
    '["Leftover Rice"]'::jsonb,
    '10 min (+ overnight)',
    'Easy',
    true
  ),
  (
    'Moong Dal Pakora',
    'recipe',
    'Crispy lentil fritters made from moong dal. Great snack to use up lentils before expiry.',
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    '["Moong Dal", "Onion", "Green Chili", "Cumin", "Baking Soda", "Oil for frying"]'::jsonb,
    '["Moong Dal"]'::jsonb,
    '30 min (+ 2hr soaking)',
    'Medium',
    true
  ),
  (
    'Shukto (Mixed Vegetable)',
    'recipe',
    'A Bengali bitter-sweet vegetable dish. Excellent way to use multiple expiring vegetables at once.',
    'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=400',
    '["Bitter Gourd", "Drumstick", "Potato", "Eggplant", "Ginger Paste", "Mustard Seeds", "Milk"]'::jsonb,
    '["Bitter Gourd", "Potato", "Eggplant"]'::jsonb,
    '40 min',
    'Medium',
    true
  ),
  (
    'Banana Flower Curry',
    'recipe',
    'Nutritious curry made from banana flower. A zero-waste recipe using parts of banana plant.',
    'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400',
    '["Banana Flower", "Potato", "Coconut", "Mustard Paste", "Green Chili", "Turmeric"]'::jsonb,
    '["Banana Flower"]'::jsonb,
    '45 min',
    'Hard',
    true
  ),
  (
    'Payesh (Rice Pudding)',
    'recipe',
    'Sweet rice pudding to use up leftover rice and milk. A traditional dessert for celebrations.',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    '["Rice", "Milk", "Sugar", "Cardamom", "Cashews", "Raisins"]'::jsonb,
    '["Rice", "Milk"]'::jsonb,
    '50 min',
    'Easy',
    true
  );

-- =============================================
-- DATA SEEDING COMPLETE!
-- =============================================
-- You now have:
-- - 15 Sustainability Tips
-- - 15 Bangladeshi Recipes
-- =============================================
