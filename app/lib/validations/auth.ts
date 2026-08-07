import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: 'Email atau Nomor HP wajib diisi' }),
  password: z
    .string()
    .min(1, { message: 'Password wajib diisi' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Nama lengkap wajib diisi' }),
  email: z
    .string()
    .min(1, { message: 'Email wajib diisi' })
    .email({ message: 'Format email tidak valid' }),
  phone: z
    .string()
    .min(1, { message: 'Nomor HP wajib diisi' })
    .regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, {
      message: 'Format nomor HP tidak valid (contoh: 08123456789)',
    }),
  gender: z.enum(['male', 'female'], {
    message: 'Pilih jenis kelamin',
  }),
  birth_date: z
    .string()
    .min(1, { message: 'Tanggal lahir wajib diisi' }),
  password: z
    .string()
    .min(8, { message: 'Password minimal 8 karakter' }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
