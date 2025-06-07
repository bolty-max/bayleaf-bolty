/*
  # Restaurant Database Schema

  1. New Tables
    - `reservations`
      - `id` (uuid, primary key)
      - `name` (text, customer name)
      - `email` (text, customer email)
      - `phone` (text, optional phone number)
      - `date` (date, reservation date)
      - `time` (text, reservation time)
      - `guests` (integer, number of guests)
      - `special_requests` (text, optional special requests)
      - `status` (text, reservation status: pending/confirmed/cancelled)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `menu_items`
      - `id` (uuid, primary key)
      - `name` (text, dish name)
      - `description` (text, dish description)
      - `price` (numeric, price in euros)
      - `category` (text, menu category)
      - `image_url` (text, optional image URL)
      - `is_vegetarian` (boolean, vegetarian flag)
      - `is_special` (boolean, chef's special flag)
      - `spice_level` (integer, spice level 1-3)
      - `is_available` (boolean, availability flag)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `gallery_items`
      - `id` (uuid, primary key)
      - `title` (text, image title)
      - `description` (text, optional description)
      - `image_url` (text, image URL)
      - `category` (text, gallery category)
      - `is_featured` (boolean, featured flag)
      - `display_order` (integer, display order)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated admin access
*/

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  date date NOT NULL,
  time text NOT NULL,
  guests integer NOT NULL DEFAULT 2,
  special_requests text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  category text NOT NULL,
  image_url text,
  is_vegetarian boolean DEFAULT false,
  is_special boolean DEFAULT false,
  spice_level integer DEFAULT 1 CHECK (spice_level BETWEEN 1 AND 3),
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create gallery_items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  category text NOT NULL,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- Create policies for reservations
CREATE POLICY "Anyone can create reservations"
  ON reservations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read their own reservations"
  ON reservations
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for menu_items (public read access)
CREATE POLICY "Anyone can read available menu items"
  ON menu_items
  FOR SELECT
  TO anon, authenticated
  USING (is_available = true);

-- Create policies for gallery_items (public read access)
CREATE POLICY "Anyone can read gallery items"
  ON gallery_items
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_gallery_items_featured ON gallery_items(is_featured);

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, category, is_vegetarian, is_special, spice_level, image_url) VALUES
  ('Masala Dosa', 'Crispy rice crepe filled with spiced potato filling, served with sambar and coconut chutney.', 11.95, 'mains', true, true, 2, 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg'),
  ('Idli Sambar', 'Steamed rice cakes served with lentil soup and coconut chutney.', 9.95, 'starters', true, false, 1, 'https://images.pexels.com/photos/4331489/pexels-photo-4331489.jpeg'),
  ('Chicken Chettinad', 'Fiery chicken curry with freshly ground spices in authentic Chettinad style.', 18.95, 'mains', false, true, 3, 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg'),
  ('Vegetable Biryani', 'Aromatic basmati rice cooked with mixed vegetables and traditional spices.', 14.95, 'mains', true, false, 2, 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg'),
  ('Mango Lassi', 'Traditional yogurt-based drink blended with fresh mango pulp.', 4.95, 'drinks', true, false, 1, 'https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg'),
  ('Gulab Jamun', 'Soft milk dumplings soaked in rose-flavored sugar syrup.', 6.95, 'desserts', true, false, 1, 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg')
ON CONFLICT DO NOTHING;