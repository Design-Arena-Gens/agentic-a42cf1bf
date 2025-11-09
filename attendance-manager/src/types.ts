export type AttendanceStatus = "present" | "absent" | "excused";

export interface Participant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  notes?: string;
  active: boolean;
}

export interface Session {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  facilitator?: string;
  focusArea?: string;
  notes?: string;
}

export type SessionAttendance = Record<string, AttendanceStatus>;

export interface AttendanceState {
  participants: Participant[];
  sessions: Session[];
  attendance: Record<string, SessionAttendance>;
  lastUpdated: string | null;
}
