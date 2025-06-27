-- Add image_url field to performance_entries table
ALTER TABLE performance_entries ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add image_url field to completed_clients table (if it exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'completed_clients') THEN
        ALTER TABLE completed_clients ADD COLUMN IF NOT EXISTS image_url TEXT;
        -- Update existing records to have empty image_url
        UPDATE completed_clients SET image_url = '' WHERE image_url IS NULL;
    END IF;
END $$;

-- Update existing records to have empty image_url
UPDATE performance_entries SET image_url = '' WHERE image_url IS NULL;
