import React, { useState } from 'react';

interface Event {
  id: number;
  name: string;
  template: string;
}

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([
    { id: 1, name: 'Tech Conference 2025', template: 'Classic' },
    { id: 2, name: 'AI Summit', template: 'Modern' },
  ]);

  return (
    <div className="p-4 border rounded bg-white">
      <h2 className="text-lg font-bold mb-2">Events & Templates Dashboard</h2>
      <table className="w-full text-left border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Event Name</th>
            <th className="border px-2 py-1">Template</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id}>
              <td className="border px-2 py-1">{event.name}</td>
              <td className="border px-2 py-1">{event.template}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
