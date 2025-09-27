import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, Plus, Trash2, Edit3, Check, X } from 'lucide-react';

interface Recipient {
  id: number;
  name: string;
  email?: string;
}

export default function RecipientEntry() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  function addRecipient() {
    if (!newName.trim()) return;
    setRecipients([...recipients, { 
      id: Date.now(), 
      name: newName.trim(),
      email: newEmail.trim() || undefined
    }]);
    setNewName('');
    setNewEmail('');
  }

  function startEdit(recipient: Recipient) {
    setEditingId(recipient.id);
    setEditName(recipient.name);
    setEditEmail(recipient.email || '');
  }

  function saveEdit() {
    if (!editName.trim()) return;
    setRecipients(recipients.map(r => 
      r.id === editingId 
        ? { ...r, name: editName.trim(), email: editEmail.trim() || undefined }
        : r
    ));
    setEditingId(null);
    setEditName('');
    setEditEmail('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName('');
    setEditEmail('');
  }

  function deleteRecipient(id: number) {
    setRecipients(recipients.filter(r => r.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Add Recipient Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Add Recipients
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Recipient Name *</label>
              <Input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Enter recipient name"
                onKeyPress={e => e.key === 'Enter' && addRecipient()}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email (Optional)</label>
              <Input
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="Enter email address"
                onKeyPress={e => e.key === 'Enter' && addRecipient()}
              />
            </div>
          </div>
          <Button
            onClick={addRecipient}
            disabled={!newName.trim()}
            className="w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Recipient
          </Button>
        </CardContent>
      </Card>

      {/* Recipients List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recipients ({recipients.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recipients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recipients added yet</p>
              <p className="text-sm">Add recipients above to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recipients.map(recipient => (
                <div key={recipient.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  {editingId === recipient.id ? (
                    <>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Input
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          placeholder="Name"
                          onKeyPress={e => e.key === 'Enter' && saveEdit()}
                        />
                        <Input
                          value={editEmail}
                          onChange={e => setEditEmail(e.target.value)}
                          placeholder="Email"
                          onKeyPress={e => e.key === 'Enter' && saveEdit()}
                        />
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" onClick={saveEdit} disabled={!editName.trim()}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="font-medium">{recipient.name}</div>
                        {recipient.email && (
                          <div className="text-sm text-muted-foreground">{recipient.email}</div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => startEdit(recipient)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteRecipient(recipient.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
