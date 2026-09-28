export interface ActivityItem {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  featured?: boolean;
}

export const activitiesData: ActivityItem[] = [];
