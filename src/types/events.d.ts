// types/events.d.ts
import { ChangeEvent } from 'react';

export type InputChangeEvent = ChangeEvent<
  HTMLInputElement | 
  HTMLTextAreaElement | 
  HTMLSelectElement
>;