import React, { useState } from 'react';

interface Template {
  id: number;
  name: string;
  data: any;
}

export default function TemplateManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newName, setNewName] = useState('');

  function saveTemplate() {
    setTemplates([...templates, { id: Date.now(), name: newName, data: {} }]);
    setNewName('');
  }

  function loadTemplate(id: number) {
    // TODO: Load template data into designer
    alert('Loaded template: ' + templates.find(t => t.id === id)?.name);
  }

  return (
    <div className="p-4 border rounded bg-white">
      <h2 className="text-lg font-bold mb-2">Template Manager</h2>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Template name"
          className="border px-2 py-1 rounded"
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={saveTemplate}
          disabled={!newName}
        >Save Template</button>
      </div>
      <ul>
        {templates.map(template => (
          <li key={template.id} className="flex items-center gap-2 mb-2">
            <span className="text-gray-700">{template.name}</span>
            <button className="bg-green-200 text-green-700 px-2 py-1 rounded" onClick={() => loadTemplate(template.id)}>
              Load
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
