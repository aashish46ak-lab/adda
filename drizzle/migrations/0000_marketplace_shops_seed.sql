CREATE TABLE public.shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  city text,
  description text,
  rating numeric NOT NULL DEFAULT 4.5,
  status text NOT NULL DEFAULT 'pending',
  commission_rate numeric NOT NULL DEFAULT 10,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.shops TO anon;
GRANT SELECT, INSERT, UPDATE ON public.shops TO authenticated;
GRANT ALL ON public.shops TO service_role;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved shops are public" ON public.shops FOR SELECT USING (status = 'approved' OR owner_id = auth.uid() OR public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Users apply for own shop" ON public.shops FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid() AND status = 'pending');
CREATE POLICY "Owners update own shop" ON public.shops FOR UPDATE TO authenticated USING (owner_id = auth.uid() OR public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'admin'));

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS shop_id uuid REFERENCES public.shops(id) ON DELETE SET NULL;

INSERT INTO public.categories (name, slug, sort_order) VALUES
 ('Electronics','electronics',1),('Mobiles','mobiles',2),('Fashion','fashion',3),('Jerseys & Sports','sports',4),('Shoes','shoes',5),('Beauty','beauty',6),('Home & Living','home',7),('Grocery','grocery',8),('Kids','kids',9),('Computer','computer',10),('Accessories','accessories',11)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.shops (name, slug, city, description, rating, status) VALUES
 ('Shrestha Electronics','shrestha-electronics','Kathmandu','Phones, audio and gadgets with warranty.',4.8,'approved'),
 ('Gurung Sports House','gurung-sports','Pokhara','Jerseys, shoes and sportswear.',4.6,'approved'),
 ('Maharjan Fashion Hub','maharjan-fashion','Lalitpur','Kurtas, denim and everyday fashion.',4.7,'approved'),
 ('Rai Beauty Corner','rai-beauty','Dharan','Skincare and beauty essentials.',4.5,'approved'),
 ('Thapa Kitchen Mart','thapa-kitchen','Butwal','Cookware and home goods.',4.4,'approved'),
 ('Adhikari Kirana Pasal','adhikari-kirana','Chitwan','Rice, pulses and daily grocery.',4.6,'approved'),
 ('Tamang Toys & Kids','tamang-kids','Bhaktapur','Toys and kids essentials.',4.5,'approved'),
 ('Karki Computer Zone','karki-computer','Biratnagar','Laptops and accessories.',4.7,'approved');

INSERT INTO public.products (name, slug, price, sale_price, stock, unit, images, featured, is_active, is_bestseller, category_id, shop_id, description)
SELECT v.name, v.slug, v.price, v.sale, v.stock, 'pc', ARRAY['/products/'||v.img||'.jpg'], v.feat, true, v.feat,
  (SELECT id FROM public.categories WHERE slug=v.cat), (SELECT id FROM public.shops WHERE slug=v.shop), v.descr
FROM (VALUES
 ('Pro Max Smartphone 256GB','pro-max-smartphone','iphone-pro',189999,174999,12,true,'mobiles','shrestha-electronics','Triple camera flagship smartphone, 256GB storage, official warranty.'),
 ('Wireless Noise-Cancelling Headphones','anc-headphones','headphones',12999,8999,30,true,'electronics','shrestha-electronics','Over-ear ANC headphones with 40-hour battery.'),
 ('Smartwatch Series 9','smartwatch-9','smartwatch',24999,19999,20,false,'accessories','shrestha-electronics','Fitness tracking, heart-rate and notifications.'),
 ('Ultrabook Laptop 14"','ultrabook-14','laptop',149999,139999,8,true,'computer','karki-computer','Lightweight 14-inch laptop, 16GB RAM, 512GB SSD.'),
 ('Portable Bluetooth Speaker','bt-speaker','speaker',5499,3999,40,false,'electronics','shrestha-electronics','Waterproof speaker with deep bass.'),
 ('20000mAh Power Bank','powerbank-20000','powerbank',3499,2499,60,false,'accessories','karki-computer','Fast-charge power bank with USB-C.'),
 ('True Wireless Earbuds','tws-earbuds','earbuds',6999,4499,50,true,'electronics','shrestha-electronics','Compact earbuds with charging case.'),
 ('RGB Gaming Mouse','rgb-gaming-mouse','gaming-mouse',2999,NULL,35,false,'computer','karki-computer','Wireless gaming mouse with RGB lighting.'),
 ('25W USB-C Fast Charger','usbc-charger-25w','charger',1499,999,80,false,'accessories','karki-computer','Compact fast charger.'),
 ('Everyday Running Sneakers','running-sneakers','sneakers',5999,4299,25,true,'shoes','gurung-sports','Breathable mesh running shoes.'),
 ('Nepal Fan Football Jersey','football-jersey','jersey',1999,1499,45,true,'sports','gurung-sports','Lightweight red football jersey.'),
 ('Embroidered Cotton Kurta','embroidered-kurta','kurta',3499,2799,30,true,'fashion','maharjan-fashion','Soft cotton kurta with hand embroidery — perfect for Dashain.'),
 ('Classic Denim Jacket','denim-jacket','denim-jacket',4999,NULL,18,false,'fashion','maharjan-fashion','Timeless blue denim jacket.'),
 ('Leather Tote Handbag','leather-handbag','handbag',6499,4999,15,false,'fashion','maharjan-fashion','Brown leather tote with gold hardware.'),
 ('Glow Face Serum Set','face-serum-set','serum',2999,2199,40,false,'beauty','rai-beauty','Set of three nourishing face serums.'),
 ('Non-Stick Cookware Set','cookware-set','cookware',7999,5999,20,true,'home','thapa-kitchen','3-piece non-stick cookware with lid.'),
 ('Premium Basmati Rice 5kg','basmati-5kg','basmati-rice',1350,1199,100,false,'grocery','adhikari-kirana','Long-grain aromatic basmati rice.'),
 ('Kids Friction Toy Car','kids-toy-car','toy-car',1299,899,50,false,'kids','tamang-kids','Durable colourful toy car for toddlers.')
) AS v(name,slug,img,price,sale,stock,feat,cat,shop,descr)
ON CONFLICT DO NOTHING;