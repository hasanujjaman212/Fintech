-- Add image_url column to performance_entries table if it doesn't exist
DO $$ 
BEGIN
    -- Check if performance_entries table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'performance_entries') THEN
        -- Add image_url column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'performance_entries' AND column_name = 'image_url') THEN
            ALTER TABLE performance_entries ADD COLUMN image_url TEXT DEFAULT '';
            UPDATE performance_entries SET image_url = '' WHERE image_url IS NULL;
        END IF;
    END IF;
    
    -- Check if completed_clients table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'completed_clients') THEN
        -- Add image_url column if it doesn't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'completed_clients' AND column_name = 'image_url') THEN
            ALTER TABLE completed_clients ADD COLUMN image_url TEXT DEFAULT '';
            UPDATE completed_clients SET image_url = '' WHERE image_url IS NULL;
        END IF;
    END IF;
END $$;
