'use client';

import { FormEvent, useMemo, useState } from "react";
import {
  AttendanceStatus,
  AttendanceState,
  Participant,
  Session,
} from "@/types";
import { AttendanceProvider, useAttendanceContext } from "@/context/AttendanceContext";

const attendanceLabels: Record<AttendanceStatus, string> = {
  present: "Present",
  absent: "Absent",
  excused: "Excused",
};

function ParticipantForm({
  editing,
  onSubmit,
  onCancel,
}: {
  editing: Participant | null;
  onSubmit: (participant: Omit<Participant, "id">, id?: string) => void;
  onCancel: () => void;
}) {
  const createEmptyParticipant = () => ({
    name: "",
    email: "",
    phone: "",
    notes: "",
    role: "",
    active: true,
  });

  const [form, setForm] = useState<Omit<Participant, "id">>(
    editing ?? createEmptyParticipant(),
  );

  const reset = () => {
    setForm(createEmptyParticipant());
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    onSubmit({ ...form, name: form.name.trim() }, editing?.id);
    reset();
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{editing ? "Edit Participant" : "Add Participant"}</h3>
        {editing && (
          <button type="button" className="text-button" onClick={() => {
            reset();
            onCancel();
          }}>
            Cancel edit
          </button>
        )}
      </div>
      <div className="grid two-columns">
        <label>
          <span>Name *</span>
          <input
            required
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Jane Doe"
          />
        </label>
        <label>
          <span>Role / Team</span>
          <input
            value={form.role ?? ""}
            onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
            placeholder="Volunteer"
          />
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            value={form.email ?? ""}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="volunteer@example.org"
          />
        </label>
        <label>
          <span>Phone</span>
          <input
            value={form.phone ?? ""}
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            placeholder="+1 555 123 4567"
          />
        </label>
      </div>
      <label>
        <span>Notes</span>
        <textarea
          value={form.notes ?? ""}
          rows={3}
          onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
          placeholder="Availability, preferences, or any other info"
        />
      </label>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))}
        />
        <span>Active member</span>
      </label>
      <button type="submit" className="primary">
        {editing ? "Save changes" : "Add participant"}
      </button>
    </form>
  );
}

function SessionForm({
  editing,
  onSubmit,
  onCancel,
}: {
  editing: Session | null;
  onSubmit: (session: Omit<Session, "id">, id?: string) => void;
  onCancel: () => void;
}) {
  const createEmptySession = () => ({
    title: "",
    date: new Date().toISOString().slice(0, 10),
    startTime: "",
    endTime: "",
    location: "",
    facilitator: "",
    focusArea: "",
    notes: "",
  });

  const [form, setForm] = useState<Omit<Session, "id">>(
    editing ?? createEmptySession(),
  );

  const reset = () => {
    setForm(createEmptySession());
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(
      {
        ...form,
        title: form.title.trim(),
      },
      editing?.id,
    );
    reset();
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{editing ? "Edit Session" : "Plan a Session"}</h3>
        {editing && (
          <button type="button" className="text-button" onClick={() => {
            reset();
            onCancel();
          }}>
            Cancel edit
          </button>
        )}
      </div>
      <div className="grid two-columns">
        <label>
          <span>Session title *</span>
          <input
            required
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Community Workshop"
          />
        </label>
        <label>
          <span>Date *</span>
          <input
            type="date"
            required
            value={form.date}
            onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
          />
        </label>
        <label>
          <span>Start time</span>
          <input
            type="time"
            value={form.startTime ?? ""}
            onChange={(event) => setForm((current) => ({ ...current, startTime: event.target.value }))}
          />
        </label>
        <label>
          <span>End time</span>
          <input
            type="time"
            value={form.endTime ?? ""}
            onChange={(event) => setForm((current) => ({ ...current, endTime: event.target.value }))}
          />
        </label>
        <label>
          <span>Location</span>
          <input
            value={form.location ?? ""}
            onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
            placeholder="Community center"
          />
        </label>
        <label>
          <span>Facilitator</span>
          <input
            value={form.facilitator ?? ""}
            onChange={(event) => setForm((current) => ({ ...current, facilitator: event.target.value }))}
            placeholder="Program lead"
          />
        </label>
      </div>
      <label>
        <span>Focus area</span>
        <input
          value={form.focusArea ?? ""}
          onChange={(event) => setForm((current) => ({ ...current, focusArea: event.target.value }))}
          placeholder="Health awareness, fundraising, etc."
        />
      </label>
      <label>
        <span>Agenda / Notes</span>
        <textarea
          value={form.notes ?? ""}
          rows={3}
          onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
          placeholder="Agenda, materials, or context for the session."
        />
      </label>
      <button type="submit" className="primary">
        {editing ? "Save changes" : "Add session"}
      </button>
    </form>
  );
}

function RosterManager() {
  const {
    participants,
    addParticipant,
    editParticipant,
    toggleParticipantActive,
    removeParticipant,
  } = useAttendanceContext();
  const [editing, setEditing] = useState<Participant | null>(null);
  const activeCount = participants.filter((participant) => participant.active).length;

  const handleSubmit = (payload: Omit<Participant, "id">, id?: string) => {
    if (id) {
      editParticipant({ id, ...payload });
      setEditing(null);
      return;
    }
    addParticipant(payload);
  };

  return (
    <section>
      <div className="section-header">
        <div>
          <h2>Member Roster</h2>
          <p>Manage who is part of your NGO team and track their availability.</p>
        </div>
        <span className="badge">
          {activeCount}/{participants.length || 0} active
        </span>
      </div>
      <ParticipantForm
        key={editing?.id ?? "new"}
        editing={editing}
        onSubmit={handleSubmit}
        onCancel={() => setEditing(null)}
      />
      <div className="card list">
        <header>
          <h3>Participants ({participants.length})</h3>
        </header>
        {participants.length === 0 ? (
          <p className="muted">No participants yet. Add your first team member above.</p>
        ) : (
          <ul>
            {participants.map((participant) => (
              <li key={participant.id}>
                <div>
                  <strong>{participant.name}</strong>
                  <div className="meta-line">
                    {participant.role && <span>{participant.role}</span>}
                    {participant.email && <span>{participant.email}</span>}
                    {participant.phone && <span>{participant.phone}</span>}
                  </div>
                  {participant.notes && (
                    <p className="muted small">{participant.notes}</p>
                  )}
                </div>
                <div className="actions">
                  <button
                    type="button"
                    className={`chip ${participant.active ? "success" : "warning"}`}
                    onClick={() => toggleParticipantActive(participant.id)}
                  >
                    {participant.active ? "Active" : "Inactive"}
                  </button>
                  <button type="button" onClick={() => setEditing(participant)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => {
                      if (confirm(`Remove ${participant.name}?`)) {
                        removeParticipant(participant.id);
                      }
                    }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function SessionManager() {
  const { sessions, addSession, editSession, removeSession } = useAttendanceContext();
  const [editing, setEditing] = useState<Session | null>(null);

  const handleSubmit = (payload: Omit<Session, "id">, id?: string) => {
    if (id) {
      editSession({ id, ...payload });
      setEditing(null);
      return;
    }
    addSession(payload);
  };

  const sortedSessions = useMemo(
    () => [...sessions].sort((a, b) => b.date.localeCompare(a.date)),
    [sessions],
  );

  return (
    <section>
      <div className="section-header">
        <div>
          <h2>Sessions</h2>
          <p>Plan your upcoming sessions and keep record of past events.</p>
        </div>
        <span className="badge">{sessions.length} total</span>
      </div>
      <SessionForm
        key={editing?.id ?? "new-session"}
        editing={editing}
        onSubmit={handleSubmit}
        onCancel={() => setEditing(null)}
      />
      <div className="card list">
        <header>
          <h3>Session timeline</h3>
        </header>
        {sortedSessions.length === 0 ? (
          <p className="muted">No sessions scheduled yet. Add one above.</p>
        ) : (
          <ul>
            {sortedSessions.map((session) => (
              <li key={session.id}>
                <div>
                  <strong>{session.title}</strong>
                  <div className="meta-line">
                    <span>
                      {new Date(session.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {session.startTime && (
                      <span>
                        {session.startTime}
                        {session.endTime ? ` - ${session.endTime}` : ""}
                      </span>
                    )}
                    {session.location && <span>{session.location}</span>}
                    {session.facilitator && <span>Facilitator: {session.facilitator}</span>}
                  </div>
                  {(session.focusArea || session.notes) && (
                    <p className="muted small">
                      {[session.focusArea, session.notes].filter(Boolean).join(" • ")}
                    </p>
                  )}
                </div>
                <div className="actions">
                  <button type="button" onClick={() => setEditing(session)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => {
                      if (confirm(`Remove ${session.title}?`)) {
                        removeSession(session.id);
                      }
                    }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function AttendanceControls({
  sessionName,
  onBulk,
}: {
  sessionName: string;
  onBulk: (status: AttendanceStatus) => void;
}) {
  const statuses: AttendanceStatus[] = ["present", "absent", "excused"];
  return (
    <div className="attendance-controls">
      <div className="bulk">
        <span>Quick mark:</span>
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onBulk(status)}
            className={`chip ${status}`}
          >
            {attendanceLabels[status]}
          </button>
        ))}
      </div>
      <p className="muted small">
        Attendance is saved automatically for session <strong>{sessionName}</strong>.
      </p>
    </div>
  );
}

function AttendanceBoard() {
  const {
    participants,
    sessions,
    attendance,
    setAttendance,
    bulkAttendance,
  } = useAttendanceContext();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    sessions[0]?.id ?? null,
  );
  const [showInactive, setShowInactive] = useState(false);

  const activeSessionId = useMemo(() => {
    if (sessions.length === 0) return null;
    if (!selectedSessionId) return sessions[0]?.id ?? null;
    return sessions.some((session) => session.id === selectedSessionId)
      ? selectedSessionId
      : sessions[0]?.id ?? null;
  }, [selectedSessionId, sessions]);

  const activeSessions = sessions.length > 0;
  const selectedSession = activeSessionId
    ? sessions.find((session) => session.id === activeSessionId) ?? null
    : null;
  const sessionAttendance = activeSessionId ? attendance[activeSessionId] ?? {} : {};
  const filteredParticipants = participants.filter(
    (participant) => showInactive || participant.active,
  );

  return (
    <section>
      <div className="section-header">
        <div>
          <h2>Session Attendance</h2>
          <p>Select a session and mark each participant&apos;s status.</p>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(event) => setShowInactive(event.target.checked)}
          />
          <span>Show inactive</span>
        </label>
      </div>
      <div className="card attendance-card">
        <header className="attendance-header">
          <label>
            <span>Session</span>
            <select
              value={activeSessionId ?? ""}
              onChange={(event) => setSelectedSessionId(event.target.value || null)}
            >
              <option value="">Select a session</option>
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.title} • {session.date}
                </option>
              ))}
            </select>
          </label>
          {!activeSessions && (
            <span className="muted small">Create a session to start tracking attendance.</span>
          )}
          {selectedSession && (
            <div className="session-summary">
              <h3>{selectedSession.title}</h3>
              <div className="meta-line">
                <span>{selectedSession.date}</span>
                {selectedSession.location && <span>{selectedSession.location}</span>}
                {selectedSession.facilitator && <span>Lead: {selectedSession.facilitator}</span>}
              </div>
            </div>
          )}
        </header>
        {selectedSession ? (
          <>
            <AttendanceControls
              sessionName={selectedSession.title}
              onBulk={(status) => bulkAttendance(selectedSession.id, status)}
            />
            <ul className="attendance-list">
              {filteredParticipants.length === 0 ? (
                <li className="muted">No participants to display.</li>
              ) : (
                filteredParticipants.map((participant) => {
                  const status = sessionAttendance[participant.id] ?? "absent";
                  return (
                    <li key={participant.id}>
                      <div>
                        <strong>{participant.name}</strong>
                        <div className="meta-line">
                          <span>{participant.role ?? "Member"}</span>
                          {!participant.active && <span className="chip warning">Inactive</span>}
                        </div>
                      </div>
                      <div className="status-buttons">
                        {(["present", "absent", "excused"] as AttendanceStatus[]).map((option) => (
                          <button
                            key={option}
                            type="button"
                            className={`chip status ${option} ${option === status ? "active" : ""}`}
                            onClick={() =>
                              setAttendance(selectedSession.id, participant.id, option)
                            }
                          >
                            {attendanceLabels[option]}
                          </button>
                        ))}
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </>
        ) : (
          <p className="muted">Select a session to start taking attendance.</p>
        )}
      </div>
    </section>
  );
}

function computeParticipantStats(
  participants: Participant[],
  sessions: Session[],
  attendance: AttendanceState["attendance"],
) {
  return participants.map((participant) => {
    const stats = { present: 0, absent: 0, excused: 0, total: 0 };
    sessions.forEach((session) => {
      const status = attendance[session.id]?.[participant.id];
      if (status) {
        stats[status] += 1;
        stats.total += 1;
      }
    });
    return {
      participant,
      ...stats,
      rate: stats.total === 0 ? 0 : Math.round((stats.present / stats.total) * 100),
    };
  });
}

function computeSessionStats(
  participants: Participant[],
  sessions: Session[],
  attendance: AttendanceState["attendance"],
) {
  return sessions.map((session) => {
    const records = attendance[session.id] ?? {};
    const present = Object.values(records).filter((status) => status === "present").length;
    const excused = Object.values(records).filter((status) => status === "excused").length;
    const total = participants.length || 1;
    return {
      session,
      present,
      excused,
      recorded: Object.keys(records).length,
      coverage: Math.round((Object.keys(records).length / total) * 100),
    };
  });
}

function Snapshot() {
  const { participants, sessions, attendance, lastUpdated, reset } = useAttendanceContext();
  const participantStats = useMemo(
    () => computeParticipantStats(participants, sessions, attendance),
    [participants, sessions, attendance],
  );
  const sessionStats = useMemo(
    () => computeSessionStats(participants, sessions, attendance),
    [participants, sessions, attendance],
  );

  const totalAttendance = participantStats.reduce((sum, stat) => sum + stat.present, 0);
  const totalSessions = sessions.length || 1;
  const overallEngagement =
    participants.length === 0
      ? 0
      : Math.round((totalAttendance / (participants.length * totalSessions)) * 100);

  const exportData = () => {
    const rows = [["Session", "Date", "Participant", "Status"]];
    sessions.forEach((session) => {
      participants.forEach((participant) => {
        const status = attendance[session.id]?.[participant.id];
        if (status) {
          rows.push([session.title, session.date, participant.name, status]);
        }
      });
    });
    const csvContent = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "attendance-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section>
      <div className="section-header">
        <div>
          <h2>Insights</h2>
          <p>Review attendance trends and download records for reporting.</p>
        </div>
        <div className="section-actions">
          <button type="button" className="secondary" onClick={exportData}>
            Export CSV
          </button>
          <button
            type="button"
            className="danger"
            onClick={() => {
              if (confirm("Reset all data? This cannot be undone.")) reset();
            }}
          >
            Reset data
          </button>
        </div>
      </div>
      <div className="grid three-columns">
        <div className="card metric">
          <h3>Total sessions</h3>
          <strong>{sessions.length}</strong>
          <p className="muted small">Unique sessions tracked so far.</p>
        </div>
        <div className="card metric">
          <h3>Active members</h3>
          <strong>{participants.filter((participant) => participant.active).length}</strong>
          <p className="muted small">Currently involved collaborators.</p>
        </div>
        <div className="card metric">
          <h3>Overall engagement</h3>
          <strong>{isFinite(overallEngagement) ? `${overallEngagement}%` : "0%"}</strong>
          <p className="muted small">Presence vs possible attendance.</p>
        </div>
      </div>
      <div className="grid two-columns">
        <div className="card table">
          <header>
            <h3>Attendance by participant</h3>
          </header>
          {participantStats.length === 0 ? (
            <p className="muted">Add members to see individual stats.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Excused</th>
                  <th>Attendance rate</th>
                </tr>
              </thead>
              <tbody>
                {participantStats.map((entry) => (
                  <tr key={entry.participant.id}>
                    <td>
                      <div>
                        <strong>{entry.participant.name}</strong>
                        {!entry.participant.active && (
                          <span className="chip warning">Inactive</span>
                        )}
                      </div>
                    </td>
                    <td>{entry.present}</td>
                    <td>{entry.absent}</td>
                    <td>{entry.excused}</td>
                    <td>{entry.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="card table">
          <header>
            <h3>Attendance by session</h3>
          </header>
          {sessionStats.length === 0 ? (
            <p className="muted">Once sessions are tracked, they will appear here.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Date</th>
                  <th>Present</th>
                  <th>Excused</th>
                  <th>Records</th>
                </tr>
              </thead>
              <tbody>
                {sessionStats.map((entry) => (
                  <tr key={entry.session.id}>
                    <td>{entry.session.title}</td>
                    <td>{entry.session.date}</td>
                    <td>{entry.present}</td>
                    <td>{entry.excused}</td>
                    <td>{entry.coverage}% coverage</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <p className="muted small">
        Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : "never"}
      </p>
    </section>
  );
}

function InnerAttendancePage() {
  const { participants, sessions } = useAttendanceContext();
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Session Attendance Manager</h1>
          <p className="muted">
            Track who participates in each program session, manage your volunteer roster, and
            download attendance records for reporting.
          </p>
        </div>
        <div className="header-stats">
          <div>
            <strong>{participants.length}</strong>
            <span>Members</span>
          </div>
          <div>
            <strong>{sessions.length}</strong>
            <span>Sessions</span>
          </div>
        </div>
      </header>
      <RosterManager />
      <SessionManager />
      <AttendanceBoard />
      <Snapshot />
      <footer className="page-footer">
        <p className="muted small">
          Tip: data is stored in your browser. Share the link with teammates and export CSV for
          backups.
        </p>
      </footer>
    </div>
  );
}

export function AttendancePage() {
  return (
    <AttendanceProvider>
      <InnerAttendancePage />
    </AttendanceProvider>
  );
}

