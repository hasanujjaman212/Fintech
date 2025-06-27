-- Add image_url column to performance_entries table if it doesn't exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'performance_entries') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'performance_entries' AND column_name = 'image_url') THEN
            ALTER TABLE performance_entries ADD COLUMN image_url TEXT DEFAULT '';
        END IF;
    END IF;
END $$;

-- Add image_url column to completed_clients table if it doesn't exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'completed_clients') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'completed_clients' AND column_name = 'image_url') THEN
            ALTER TABLE completed_clients ADD COLUMN image_url TEXT DEFAULT '';
        END IF;
    END IF;
END $$;
