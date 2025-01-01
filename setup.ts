import dotenv from 'dotenv';
import atob from 'atob';
import { vi } from 'vitest';

dotenv.config();

// Menambahkan atob ke dalam cakupan global
(global as any).atob = atob;

// Mocking modul prisma
vi.mock('./prisma/mock/index.ts');
