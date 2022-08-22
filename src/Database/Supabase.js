import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://xyzcompany.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptamxwbHJoanlyaHJ5cnd1Y2pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjA3NDAwODUsImV4cCI6MTk3NjMxNjA4NX0.7YRupS59US18Xy7wQ0Zwxedu0nUQIvd48kAx7BRrJ8M"
);
