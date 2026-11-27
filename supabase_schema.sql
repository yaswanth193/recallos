-- =========================================================================
-- RecallOS: Complete Supabase PostgreSQL Database Schema
-- Includes Database Tables, Indexes, and Authentication RLS Policies
-- =========================================================================

-- 1. Create Resources Table (Learning Tracker & Knowledge Vault)
CREATE TABLE IF NOT EXISTS public.resources (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    platform TEXT NOT NULL,
    domain TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    time_spent_mins INTEGER DEFAULT 30,
    summary TEXT,
    extracted_concepts TEXT[] DEFAULT '{}',
    mastery_score INTEGER DEFAULT 60,
    status TEXT DEFAULT 'Reviewing',
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    review_due_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '3 days'),
    review_interval_days INTEGER DEFAULT 3,
    notes TEXT
);

-- 2. Create Concepts Table (Interactive Knowledge Graph & Mastery)
CREATE TABLE IF NOT EXISTS public.concepts (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    domain TEXT NOT NULL,
    category TEXT,
    mastery_score INTEGER DEFAULT 50,
    importance TEXT DEFAULT 'High',
    description TEXT,
    resource_count INTEGER DEFAULT 1,
    last_tested DATE DEFAULT CURRENT_DATE,
    color TEXT DEFAULT '#6366f1'
);

-- 3. Create Quiz Questions Table (Adaptive Active Recall)
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id TEXT PRIMARY KEY,
    concept_id TEXT REFERENCES public.concepts(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer_index INTEGER NOT NULL,
    explanation TEXT,
    difficulty TEXT DEFAULT 'Intermediate'
);

-- 4. Create User Learning Telemetry Table
CREATE TABLE IF NOT EXISTS public.user_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    streak_days INTEGER DEFAULT 14,
    total_minutes_learned INTEGER DEFAULT 385,
    today_minutes INTEGER DEFAULT 45,
    concepts_mastered INTEGER DEFAULT 18,
    active_gaps INTEGER DEFAULT 3,
    level TEXT DEFAULT 'Advanced Scholar',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies: Allow Authenticated Users to Read & Write Their Own Data,
-- and allow public access for unauthenticated demo sessions
CREATE POLICY "Users can view their resources" ON public.resources 
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their resources" ON public.resources 
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their resources" ON public.resources 
    FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their resources" ON public.resources 
    FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Public Read Concepts" ON public.concepts FOR SELECT USING (true);
CREATE POLICY "Public Manage Concepts" ON public.concepts FOR ALL USING (true);

CREATE POLICY "Public Read Quizzes" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Public Manage Quizzes" ON public.quiz_questions FOR ALL USING (true);

CREATE POLICY "Users can view stats" ON public.user_stats FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);
