export type Activity = {
    id: string;
    name: string;
    user_id: string;
};

export type CreateActivityRequest = {
    name: string;
}

export type UpdateActivityRequest = {
    id: string;
    name: string;
};

export enum Mood {
    Awful = 0,
    Bad = 1,
    Meh = 2,
    Good = 3,
    Rad = 4,
}

export type MoodEntry = {
    id: string;
    user_id: string;
    mood: Mood;
    activities: string | null;
    note: string | null;
    created_at: string;
};

export type CreateMoodEntryRequest = {
    mood: Mood;
    activities: string[] | null;
    note: string | null;
}

export type UpdateMoodEntryRequest = {
    id: string;
    mood: Mood;
    activities: string[] | null;
    note: string | null;
};

export type MoodTrend = {
    date: string;
    trend: 'positive' | 'negative' | 'neutral';
    moodCounts: {
        [key: string]: number;
    }
}

export type GetMoodTrendRequest = {
    startDate: string | null;
    endDate: string | null;
}