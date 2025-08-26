import React, { useState } from 'react';

interface Recipient {
  id: number;
  name: string;
}

export default function RecipientEntry() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [newName, setNewName] = useState('');

  function addRecipient() {
    setRecipients([...recipients, { id: Date.now(), name: newName }]);
    setNewName('');
  }

  function editRecipient(id: number, name: string) {
    setRecipients(recipients.map(r => r.id === id ? { ...r, name } : r));
  }

  function deleteRecipient(id: number) {
    setRecipients(recipients.filter(r => r.id !== id));
  }

  return (
    <div className="p-4 border rounded bg-white">
      <h2 className="text-lg font-bold mb-2">Manual Recipient Entry</h2>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Recipient name"
          className="border px-2 py-1 rounded"
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={addRecipient}
          disabled={!newName}
        >Add Recipient</button>
      </div>
      <ul>
        {recipients.map(recipient => (
          <li key={recipient.id} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={recipient.name}
              onChange={e => editRecipient(recipient.id, e.target.value)}
              className="border px-2 py-1 rounded w-48"
            />
            <button className="bg-red-200 text-red-700 px-2 py-1 rounded" onClick={() => deleteRecipient(recipient.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
