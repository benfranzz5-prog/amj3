import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author" varchar NOT NULL,
  	"quote" varchar NOT NULL,
  	"stars" numeric DEFAULT 5 NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"testimonials_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "meta" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'AMJ Produce | Premium Wholesale Fresh Produce – South Australia' NOT NULL,
  	"description" varchar DEFAULT 'Premium wholesale fresh produce supplier based in South Australia. Supplying chefs, restaurants, and caterers with the finest local and specialty produce.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"wholesale_label" varchar DEFAULT 'Wholesale',
  	"about_label" varchar DEFAULT 'About AMJ',
  	"products_label" varchar DEFAULT 'Products',
  	"media_label" varchar DEFAULT 'Media',
  	"environment_label" varchar DEFAULT 'Environment',
  	"contact_label" varchar DEFAULT 'Contact',
  	"market_report_label" varchar DEFAULT 'Market Report',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "hero" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'South Australia''s Premium Wholesaler',
  	"title_line1" varchar DEFAULT 'Premium Wholesale',
  	"title_line2" varchar DEFAULT 'Fresh Produce',
  	"sub_paragraph" varchar DEFAULT 'Delivering the finest local and specialty produce to chefs, restaurants, caterers, and corporate kitchens across South Australia.',
  	"cta_primary_label" varchar DEFAULT 'View Our Produce',
  	"cta_outline_label" varchar DEFAULT 'Enquire Now',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_label" varchar DEFAULT 'About Us',
  	"heading" varchar DEFAULT 'South Australia''s Trusted Fresh Produce Partner',
  	"lead_paragraph" varchar DEFAULT 'AMJ Produce Co, led by Chris and Margy Abbot, is a premium wholesale fresh produce supplier based in Pooraka, South Australia. We''re dedicated to delivering the freshest, highest-quality produce to the region''s finest kitchens.',
  	"body1" varchar DEFAULT 'AMJ Produce is an Award winning, well-established wholesale produce vendor and a strong supporter of South Australian Agriculture. Fresh fruits and vegetables are at the heart of healthy eating.',
  	"body2" varchar DEFAULT 'The driving force behind AMJ Produce is a proactive commitment to deliver fresh produce to the doorstep of our customers when they need them.',
  	"body3" varchar DEFAULT 'Our strong relationships with local growers and trusted importers mean we can consistently source what chefs and caterers need — from everyday staples to rare, hard-to-find specialty ingredients and exquisite edible flowers.',
  	"cta_label" varchar DEFAULT 'Get in Touch',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "fresho" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_label" varchar DEFAULT 'Online Ordering',
  	"heading" varchar DEFAULT 'Order Fresh Produce Through Fresho',
  	"body" varchar DEFAULT 'AMJ Produce is fully integrated with Fresho — the leading fresh produce ordering platform trusted by chefs and hospitality businesses across Australia. Browse our current stock, place orders, track deliveries and manage invoices all in one place.',
  	"button_label" varchar DEFAULT 'Order on Fresho',
  	"button_url" varchar DEFAULT 'https://www.fresho.com/au',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "delivery_bullet_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "delivery" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_label" varchar DEFAULT 'Logistics',
  	"heading" varchar DEFAULT 'From Our Hands to Your Kitchen',
  	"lead_paragraph" varchar DEFAULT 'We understand that timing is everything in a professional kitchen. AMJ Produce is committed to reliable, early-morning delivery so your team has what they need before service begins.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "mission_mission_list_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "mission_guiding_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "mission" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"mission_heading" varchar DEFAULT 'What We Do Every Day',
  	"mission_intro" varchar DEFAULT 'AMJ Produce is committed to delivering the highest quality wholesale fresh produce to our customers. We achieve this through:',
  	"vision_heading" varchar DEFAULT 'Where We''re Headed',
  	"vision_body" varchar DEFAULT 'To be South Australia''s most trusted and preferred wholesale fresh produce supplier, renowned for uncompromising quality, reliability, and our deep commitment to supporting local growers and sustainable practices.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "environment_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "environment_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "environment_policy_docs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "environment" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_label" varchar DEFAULT 'Sustainability Matters',
  	"heading" varchar DEFAULT 'Our Environmental Commitment',
  	"intro_paragraph" varchar DEFAULT 'We''re committed to minimising our ecological footprint while supporting the local produce industry. Our warehouse incorporates sustainable practices from energy efficiency to waste management.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "commitment_value_pills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "commitment" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Our Commitment to You',
  	"body1" varchar DEFAULT 'We understand that in a professional kitchen, quality and consistency aren''t optional — they''re everything. That''s why every order from AMJ Produce comes with our personal commitment to freshness, accuracy, and service excellence.',
  	"body2" varchar DEFAULT 'Whether you''re a head chef at a fine-dining restaurant, a catering manager for a major event, or a corporate kitchen buyer, we treat every customer with the same dedication and care.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_label" varchar DEFAULT 'Get in Touch',
  	"heading" varchar DEFAULT 'Start Your Order Today',
  	"sub_paragraph" varchar DEFAULT 'Ready to experience premium wholesale produce? Reach out to the AMJ Produce team and we''ll take care of the rest.',
  	"contact_persons" varchar DEFAULT 'Chris & Margy Abbot',
  	"address_street" varchar DEFAULT '13 Burma Road, Pooraka SA 5095',
  	"address_city" varchar DEFAULT 'Pooraka, South Australia',
  	"address_g_p_o" varchar DEFAULT 'GPO Box 310, Adelaide SA 5000',
  	"phone" varchar DEFAULT '(08) 8349 5222',
  	"fax" varchar DEFAULT '(08) 8349 4390',
  	"email" varchar DEFAULT 'admin@amjproduce.com.au',
  	"form_note" varchar DEFAULT 'We typically respond within one business day.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_cert_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar DEFAULT 'AMJ Produce Co.',
  	"company_subtitle" varchar DEFAULT 'Fruit & Vegetable Wholesalers',
  	"address_street" varchar DEFAULT '13 Burma Road, Pooraka SA 5095',
  	"phone" varchar DEFAULT '(08) 8349 5222',
  	"fax" varchar DEFAULT '(08) 8349 4390',
  	"email" varchar DEFAULT 'admin@amjproduce.com.au',
  	"commitment_paragraph" varchar DEFAULT 'AMJ Produce Co. aim to be South Australia''s wholesale distributor of choice for fresh fruits and vegetables. Driven by the Guiding Principles: ''Quality Products, Fast Service and Fair Pricing.'' and in all our business relationships by the basic values of integrity, honesty, trustworthiness and excellence in customer service.',
  	"designer_label" varchar DEFAULT 'Website by Shift Web Designs',
  	"designer_url" varchar DEFAULT 'https://shiftwebdesigns.com.au',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_awards" ADD CONSTRAINT "about_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_pillars" ADD CONSTRAINT "about_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "delivery_bullet_points" ADD CONSTRAINT "delivery_bullet_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."delivery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "mission_mission_list_items" ADD CONSTRAINT "mission_mission_list_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."mission"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "mission_guiding_principles" ADD CONSTRAINT "mission_guiding_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."mission"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "environment_cards" ADD CONSTRAINT "environment_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."environment"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "environment_stats" ADD CONSTRAINT "environment_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."environment"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "environment_policy_docs" ADD CONSTRAINT "environment_policy_docs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."environment"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "commitment_value_pills" ADD CONSTRAINT "commitment_value_pills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."commitment"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_cert_items" ADD CONSTRAINT "footer_cert_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "about_awards_order_idx" ON "about_awards" USING btree ("_order");
  CREATE INDEX "about_awards_parent_id_idx" ON "about_awards" USING btree ("_parent_id");
  CREATE INDEX "about_pillars_order_idx" ON "about_pillars" USING btree ("_order");
  CREATE INDEX "about_pillars_parent_id_idx" ON "about_pillars" USING btree ("_parent_id");
  CREATE INDEX "delivery_bullet_points_order_idx" ON "delivery_bullet_points" USING btree ("_order");
  CREATE INDEX "delivery_bullet_points_parent_id_idx" ON "delivery_bullet_points" USING btree ("_parent_id");
  CREATE INDEX "mission_mission_list_items_order_idx" ON "mission_mission_list_items" USING btree ("_order");
  CREATE INDEX "mission_mission_list_items_parent_id_idx" ON "mission_mission_list_items" USING btree ("_parent_id");
  CREATE INDEX "mission_guiding_principles_order_idx" ON "mission_guiding_principles" USING btree ("_order");
  CREATE INDEX "mission_guiding_principles_parent_id_idx" ON "mission_guiding_principles" USING btree ("_parent_id");
  CREATE INDEX "environment_cards_order_idx" ON "environment_cards" USING btree ("_order");
  CREATE INDEX "environment_cards_parent_id_idx" ON "environment_cards" USING btree ("_parent_id");
  CREATE INDEX "environment_stats_order_idx" ON "environment_stats" USING btree ("_order");
  CREATE INDEX "environment_stats_parent_id_idx" ON "environment_stats" USING btree ("_parent_id");
  CREATE INDEX "environment_policy_docs_order_idx" ON "environment_policy_docs" USING btree ("_order");
  CREATE INDEX "environment_policy_docs_parent_id_idx" ON "environment_policy_docs" USING btree ("_parent_id");
  CREATE INDEX "commitment_value_pills_order_idx" ON "commitment_value_pills" USING btree ("_order");
  CREATE INDEX "commitment_value_pills_parent_id_idx" ON "commitment_value_pills" USING btree ("_parent_id");
  CREATE INDEX "footer_cert_items_order_idx" ON "footer_cert_items" USING btree ("_order");
  CREATE INDEX "footer_cert_items_parent_id_idx" ON "footer_cert_items" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "testimonials" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "meta" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "hero" CASCADE;
  DROP TABLE "about_awards" CASCADE;
  DROP TABLE "about_pillars" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "fresho" CASCADE;
  DROP TABLE "delivery_bullet_points" CASCADE;
  DROP TABLE "delivery" CASCADE;
  DROP TABLE "mission_mission_list_items" CASCADE;
  DROP TABLE "mission_guiding_principles" CASCADE;
  DROP TABLE "mission" CASCADE;
  DROP TABLE "environment_cards" CASCADE;
  DROP TABLE "environment_stats" CASCADE;
  DROP TABLE "environment_policy_docs" CASCADE;
  DROP TABLE "environment" CASCADE;
  DROP TABLE "commitment_value_pills" CASCADE;
  DROP TABLE "commitment" CASCADE;
  DROP TABLE "contact" CASCADE;
  DROP TABLE "footer_cert_items" CASCADE;
  DROP TABLE "footer" CASCADE;`)
}
