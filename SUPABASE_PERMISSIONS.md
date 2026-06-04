# Supabase Permissions and Table Access

These statements help enable anonymous `SELECT` access for Supabase client-side reads.

## 1. Enable RLS and grant SELECT on tables used by `produc detail`

```sql
ALTER TABLE public.product_details ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.product_details TO anon;
CREATE POLICY "Allow anon select product_details" ON public.product_details FOR SELECT USING (auth.role() = 'anon');

ALTER TABLE public.product_top_facilities ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.product_top_facilities TO anon;
CREATE POLICY "Allow anon select product_top_facilities" ON public.product_top_facilities FOR SELECT USING (auth.role() = 'anon');

ALTER TABLE public.product_explore_area ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.product_explore_area TO anon;
CREATE POLICY "Allow anon select product_explore_area" ON public.product_explore_area FOR SELECT USING (auth.role() = 'anon');

ALTER TABLE public.product_availability ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.product_availability TO anon;
CREATE POLICY "Allow anon select product_availability" ON public.product_availability FOR SELECT USING (auth.role() = 'anon');

ALTER TABLE public.product_promo_cards ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.product_promo_cards TO anon;
CREATE POLICY "Allow anon select product_promo_cards" ON public.product_promo_cards FOR SELECT USING (auth.role() = 'anon');

ALTER TABLE public.product_rooms ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.product_rooms TO anon;
CREATE POLICY "Allow anon select product_rooms" ON public.product_rooms FOR SELECT USING (auth.role() = 'anon');
```

## 2. Enable RLS and grant SELECT on tables used by `cheakout`

```sql
ALTER TABLE public.checkout_summaries ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.checkout_summaries TO anon;
CREATE POLICY "Allow anon select checkout_summaries" ON public.checkout_summaries FOR SELECT USING (auth.role() = 'anon');

ALTER TABLE public.checkout_rooms ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.checkout_rooms TO anon;
CREATE POLICY "Allow anon select checkout_rooms" ON public.checkout_rooms FOR SELECT USING (auth.role() = 'anon');

ALTER TABLE public.checkout_policy_items ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.checkout_policy_items TO anon;
CREATE POLICY "Allow anon select checkout_policy_items" ON public.checkout_policy_items FOR SELECT USING (auth.role() = 'anon');

ALTER TABLE public.checkout_price_items ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.checkout_price_items TO anon;
CREATE POLICY "Allow anon select checkout_price_items" ON public.checkout_price_items FOR SELECT USING (auth.role() = 'anon');

ALTER TABLE public.checkout_price_totals ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.checkout_price_totals TO anon;
CREATE POLICY "Allow anon select checkout_price_totals" ON public.checkout_price_totals FOR SELECT USING (auth.role() = 'anon');

ALTER TABLE public.searches ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.searches TO anon;
CREATE POLICY "Allow anon select searches" ON public.searches FOR SELECT USING (auth.role() = 'anon');
```

## Notes

- Supabase does not support `CREATE POLICY IF NOT EXISTS`.
- If a policy already exists with the same name, delete it first or rename the new policy.
- If you do not want RLS, you can leave RLS disabled and only use `GRANT SELECT ... TO anon;`.
- After applying policies, verify the tables return data in the browser without `401 Unauthorized`.
