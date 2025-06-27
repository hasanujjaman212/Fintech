-- Add image_url field to performance table
ALTER TABLE performance ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add image_url field to completed_clients table
ALTER TABLE completed_clients ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update existing records to have empty image_url
UPDATE performance SET image_url = '' WHERE image_url IS NULL;
UPDATE completed_clients SET image_url = '' WHERE image_url IS NULL;
