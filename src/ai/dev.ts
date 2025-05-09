import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-symptoms.ts';
import '@/ai/flows/find-pharmacies-flow.ts';
import '@/ai/flows/find-doctors-flow.ts';