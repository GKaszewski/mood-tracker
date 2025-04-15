import { z } from 'zod';
import { Mood } from '../lib/api/types';

export const moodSchema = z.object({
    id: z.string().optional(),
    mood: z.nativeEnum(Mood),
    activities: z.array(z.string()).nullable(),
    note: z.string().nullable(),
});

export type MoodFormData = z.infer<typeof moodSchema>;