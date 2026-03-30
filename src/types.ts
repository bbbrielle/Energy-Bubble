export type Urgency = 'low' | 'medium' | 'high';
export type EnergyCost = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  name: string;
  urgency: Urgency;
  energyCost: EnergyCost;
  createdAt: number;
}
