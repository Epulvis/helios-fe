import { z } from 'zod';

export const doctorReviewSchema = z.object({
  review_note: z
    .string()
    .trim()
    .min(1, { message: 'Catatan review wajib diisi' })
    .max(5000, { message: 'Catatan review maksimal 5000 karakter' }),
  final_category: z
    .string()
    .trim()
    .max(255, { message: 'Kategori final maksimal 255 karakter' }),
  final_urgency_level: z.union([
    z.enum(['normal', 'priority', 'urgent']),
    z.literal(''),
  ]),
  recommendation: z
    .string()
    .trim()
    .max(5000, { message: 'Rekomendasi maksimal 5000 karakter' }),
});

export type DoctorReviewFormData = z.infer<typeof doctorReviewSchema>;
