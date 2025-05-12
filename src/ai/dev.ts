import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-symptoms.ts';
import '@/ai/flows/find-pharmacies-flow.ts';
import '@/ai/flows/find-doctors-flow.ts';
import '@/ai/flows/find-pathology-labs-flow.ts';
import '@/ai/flows/find-hospitals-flow.ts';
