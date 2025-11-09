'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { storage } from "@/lib/storage";
import {
  AttendanceState,
  AttendanceStatus,
  Participant,
  Session,
  SessionAttendance,
} from "@/types";
import { nanoid } from "nanoid";

type AttendanceAction =
  | { type: "hydrate"; payload: AttendanceState }
  | { type: "addParticipant"; payload: Omit<Participant, "id"> }
  | { type: "editParticipant"; payload: Participant }
  | { type: "toggleParticipantActive"; payload: { id: string } }
  | { type: "removeParticipant"; payload: { id: string } }
  | { type: "addSession"; payload: Omit<Session, "id"> }
  | { type: "editSession"; payload: Session }
  | { type: "removeSession"; payload: { id: string } }
  | {
      type: "setAttendance";
      payload: {
        sessionId: string;
        participantId: string;
        status: AttendanceStatus;
      };
    }
  | { type: "bulkAttendance"; payload: { sessionId: string; status: AttendanceStatus } }
  | { type: "reset" };

const defaultState: AttendanceState = {
  participants: [],
  sessions: [],
  attendance: {},
  lastUpdated: null,
};

function withTimestamp(state: AttendanceState): AttendanceState {
  return { ...state, lastUpdated: new Date().toISOString() };
}

function attendanceReducer(
  state: AttendanceState,
  action: AttendanceAction,
): AttendanceState {
  switch (action.type) {
    case "hydrate":
      return { ...state, ...action.payload };
    case "reset":
      return withTimestamp({ ...defaultState });
    case "addParticipant": {
      const participant: Participant = { id: nanoid(), ...action.payload };
      return withTimestamp({
        ...state,
        participants: [...state.participants, participant],
      });
    }
    case "editParticipant": {
      const participants = state.participants.map((p) =>
        p.id === action.payload.id ? action.payload : p,
      );
      return withTimestamp({ ...state, participants });
    }
    case "toggleParticipantActive": {
      const participants = state.participants.map((p) =>
        p.id === action.payload.id ? { ...p, active: !p.active } : p,
      );
      return withTimestamp({ ...state, participants });
    }
    case "removeParticipant": {
      const participants = state.participants.filter(
        (p) => p.id !== action.payload.id,
      );
      const attendanceEntries = Object.entries(state.attendance).reduce<
        AttendanceState["attendance"]
      >((acc, [sessionId, records]) => {
        const nextRecords = { ...records };
        delete nextRecords[action.payload.id];
        acc[sessionId] = nextRecords;
        return acc;
      }, {});
      return withTimestamp({
        ...state,
        participants,
        attendance: attendanceEntries,
      });
    }
    case "addSession": {
      const session: Session = { id: nanoid(), ...action.payload };
      return withTimestamp({
        ...state,
        sessions: [...state.sessions, session],
      });
    }
    case "editSession": {
      const sessions = state.sessions.map((s) =>
        s.id === action.payload.id ? action.payload : s,
      );
      return withTimestamp({ ...state, sessions });
    }
    case "removeSession": {
      const sessions = state.sessions.filter((s) => s.id !== action.payload.id);
      const attendance = { ...state.attendance };
      delete attendance[action.payload.id];
      return withTimestamp({
        ...state,
        sessions,
        attendance,
      });
    }
    case "setAttendance": {
      const existingForSession: SessionAttendance =
        state.attendance[action.payload.sessionId] ?? {};
      const attendance = {
        ...state.attendance,
        [action.payload.sessionId]: {
          ...existingForSession,
          [action.payload.participantId]: action.payload.status,
        },
      };
      return withTimestamp({ ...state, attendance });
    }
    case "bulkAttendance": {
      const base: SessionAttendance =
        state.attendance[action.payload.sessionId] ?? {};
      const updated: SessionAttendance = { ...base };
      state.participants.forEach((participant) => {
        updated[participant.id] = action.payload.status;
      });
      return withTimestamp({
        ...state,
        attendance: { ...state.attendance, [action.payload.sessionId]: updated },
      });
    }
    default:
      return state;
  }
}

interface AttendanceContextValue extends AttendanceState {
  addParticipant(participant: Omit<Participant, "id">): void;
  editParticipant(participant: Participant): void;
  toggleParticipantActive(id: string): void;
  removeParticipant(id: string): void;
  addSession(session: Omit<Session, "id">): void;
  editSession(session: Session): void;
  removeSession(id: string): void;
  setAttendance(
    sessionId: string,
    participantId: string,
    status: AttendanceStatus,
  ): void;
  bulkAttendance(sessionId: string, status: AttendanceStatus): void;
  reset(): void;
}

const AttendanceContext = createContext<AttendanceContextValue | null>(null);

export function AttendanceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(attendanceReducer, defaultState);

  useEffect(() => {
    const persisted = storage.load(defaultState);
    dispatch({ type: "hydrate", payload: persisted });
  }, []);

  useEffect(() => {
    if (state === defaultState) return;
    storage.save(state);
  }, [state]);

  const addParticipant = useCallback(
    (participant: Omit<Participant, "id">) =>
      dispatch({ type: "addParticipant", payload: participant }),
    [],
  );
  const editParticipant = useCallback(
    (participant: Participant) =>
      dispatch({ type: "editParticipant", payload: participant }),
    [],
  );
  const toggleParticipantActive = useCallback(
    (id: string) =>
      dispatch({ type: "toggleParticipantActive", payload: { id } }),
    [],
  );
  const removeParticipant = useCallback(
    (id: string) => dispatch({ type: "removeParticipant", payload: { id } }),
    [],
  );
  const addSession = useCallback(
    (session: Omit<Session, "id">) =>
      dispatch({ type: "addSession", payload: session }),
    [],
  );
  const editSession = useCallback(
    (session: Session) =>
      dispatch({ type: "editSession", payload: session }),
    [],
  );
  const removeSession = useCallback(
    (id: string) => dispatch({ type: "removeSession", payload: { id } }),
    [],
  );
  const setAttendance = useCallback(
    (sessionId: string, participantId: string, status: AttendanceStatus) =>
      dispatch({
        type: "setAttendance",
        payload: { sessionId, participantId, status },
      }),
    [],
  );
  const bulkAttendance = useCallback(
    (sessionId: string, status: AttendanceStatus) =>
      dispatch({ type: "bulkAttendance", payload: { sessionId, status } }),
    [],
  );
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  const value = useMemo<AttendanceContextValue>(
    () => ({
      ...state,
      addParticipant,
      editParticipant,
      toggleParticipantActive,
      removeParticipant,
      addSession,
      editSession,
      removeSession,
      setAttendance,
      bulkAttendance,
      reset,
    }),
    [
      state,
      addParticipant,
      editParticipant,
      toggleParticipantActive,
      removeParticipant,
      addSession,
      editSession,
      removeSession,
      setAttendance,
      bulkAttendance,
      reset,
    ],
  );

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendanceContext() {
  const ctx = useContext(AttendanceContext);
  if (!ctx) {
    throw new Error("useAttendanceContext must be used within AttendanceProvider");
  }
  return ctx;
}

