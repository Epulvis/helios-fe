import { z } from 'zod';

export const doctorReviewSchema = z.object({
  review_note: z
    .string()
    .min(1, { message: 'Catatan review wajib diisi' }),
  final_category: z
    .string()
    .min(1, { message: 'Kategori final wajib dipilih' }),
  final_urgency_level: z
    .string()
    .min(1, { message: 'Tingkat urgensi wajib dipilih' }),
  recommendation: z
    .string()
    .min(1, { message: 'Rekomendasi penanganan wajib diisi' }),
});

export type DoctorReviewFormData = z.infer<typeof doctorReviewSchema>;
