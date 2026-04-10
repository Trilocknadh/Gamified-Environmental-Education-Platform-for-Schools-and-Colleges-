export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Student' | 'Teacher' | 'Admin';
  xp: number;
  level: number;
  streak?: number;
  badges?: string[];
  avatar?: string;
  schoolName?: string;
  interests?: string[];
  aboutMe?: string;
  collegeName?: string;
  industry?: string;
  professionalSkills?: string[];
  skillsOfInterest?: string[];
  assignedClass?: string;
  ecoXp?: number;
  eduXp?: number;
  createdAt?: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  _id: string;
  subject: 'Mathematics' | 'Physics' | 'Chemistry' | 'Environmental Studies';
  title: string;
  questions: Question[];
  rewardXP: number;
  gradeLevel?: string;
  createdBy: string;
  createdAt: string;
}

export interface Mission {
  _id: string;
  title: string;
  description: string;
  points: number;
  gradeLevel: '6' | '7' | '8' | '9' | '10' | '11' | '12' | 'BTech' | 'Degree';
  createdBy: string;
  createdAt: string;
}

export interface Material {
  _id: string;
  title: string;
  description: string;
  type: 'PDF' | 'Video' | 'Link';
  category: 'academic' | 'eco';
  url: string;
  thumbnail?: string;
  gradeLevel?: string;
  createdBy: string;
  createdAt: string;
}

export interface Submission {
  _id: string;
  userId: User | any;
  missionId: Mission | any;
  image: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  feedback?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalQuizzesCompleted: number;
  totalMissionsSubmitted: number;
}

export interface ActivityFeed {
  submissions: Submission[];
}
