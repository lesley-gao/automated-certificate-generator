import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  FileText, 
  Upload, 
  CheckCircle,
  UserPlus,
  FileUp
} from 'lucide-react';
import ErrorFeedback from '../ErrorFeedback';
import { useRecipients } from '../../context/RecipientsContext';
import { useDesign } from '../../context/DesignContext';

interface Recipient {
  id: number;
  name: string;
  email?: string;
}

// Simple CSV parser (replace with papaparse/xlsx for production)
function parseCSV(text: string): { name: string }[] {
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(name => ({ name }));
}

export default function Recipients() {
  const [activeTab, setActiveTab] = useState<'manual' | 'import'>('manual');
  
  // Manual entry state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  
  // Import state
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ name: string }[]>([]);
  const [importStep, setImportStep] = useState<'select' | 'preview'>('select');
  const fileInput = useRef<HTMLInputElement>(null);
  
  const { recipients, setRecipients } = useRecipients();
  const { syncRecipientsWithTextFields } = useDesign();

  // Manual entry functions
  function addRecipient() {
    if (!newName.trim()) return;
    const newRecipient = { 
      id: Date.now(), 
      name: newName.trim(),
      email: newEmail.trim() || undefined
    };
    const updatedRecipients = [...recipients, newRecipient];
    setRecipients(updatedRecipients);
    syncRecipientsWithTextFields(updatedRecipients);
    setNewName('');
    setNewEmail('');
  }

  function deleteRecipient(id: number) {
    setRecipients(recipients.filter(r => r.id !== id));
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

  // Import functions
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file. (Excel support coming soon)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          setError('No valid data found in the CSV file.');
          return;
        }
        setPreview(parsed);
        setImportStep('preview');
      } catch (err) {
        setError('Failed to parse CSV file. Please check the format.');
      }
    };
    reader.readAsText(file);
  }

  function handleImport() {
    const newRecipients = preview.map(item => ({
      id: Date.now() + Math.random(),
      name: item.name,
      email: undefined
    }));
    const updatedRecipients = [...recipients, ...newRecipients];
    setRecipients(updatedRecipients);
    syncRecipientsWithTextFields(updatedRecipients);
    setPreview([]);
    setImportStep('select');
    setActiveTab('manual'); // Switch to manual tab to show imported recipients
  }

  function handleImportCancel() {
    setPreview([]);
    setImportStep('select');
    setError(null);
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Recipients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeTab === 'manual' ? 'default' : 'outline'}
              onClick={() => setActiveTab('manual')}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Manual Entry
            </Button>
            <Button
              variant={activeTab === 'import' ? 'default' : 'outline'}
              onClick={() => setActiveTab('import')}
              className="flex items-center gap-2"
            >
              <FileUp className="h-4 w-4" />
              Import CSV
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Total recipients: <span className="font-semibold text-foreground">{recipients.length}</span>
          </div>
        </CardContent>
      </Card>

      {/* Manual Entry Tab */}
      {activeTab === 'manual' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add Recipients Manually
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add new recipient form */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Recipient name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addRecipient()}
                className="flex-1"
              />
              <Input
                type="email"
                placeholder="Email (optional)"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addRecipient()}
                className="flex-1"
              />
              <Button onClick={addRecipient} disabled={!newName.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            {/* Recipients list */}
            {recipients.length > 0 ? (
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground">Current Recipients:</h3>
                {recipients.map(recipient => (
                  <div key={recipient.id} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    {editingId === recipient.id ? (
                      <>
                        <Input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          type="email"
                          value={editEmail}
                          onChange={e => setEditEmail(e.target.value)}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={saveEdit}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1">
                          <div className="font-medium">{recipient.name}</div>
                          {recipient.email && (
                            <div className="text-sm text-muted-foreground">{recipient.email}</div>
                          )}
                        </div>
                        <Button size="sm" variant="outline" onClick={() => startEdit(recipient)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteRecipient(recipient.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No recipients added yet</p>
                <p className="text-sm">Add recipients manually or import from CSV</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Import Tab */}
      {activeTab === 'import' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Import Recipients from CSV
            </CardTitle>
          </CardHeader>
          <CardContent>
            {importStep === 'select' ? (
              <div className="space-y-4">
                <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Upload CSV File</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload a CSV file with recipient names. Each name should be on a separate line.
                  </p>
                  <Button onClick={() => fileInput.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose CSV File
                  </Button>
                  <input
                    type="file"
                    accept=".csv"
                    ref={fileInput}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                
                {error && <ErrorFeedback message={error} />}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">CSV file loaded successfully!</span>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Preview ({preview.length} recipients):</h3>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {preview.map((item, index) => (
                      <div key={index} className="text-sm py-1 px-2 bg-background rounded">
                        {item.name}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleImport} className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Import {preview.length} Recipients
                  </Button>
                  <Button variant="outline" onClick={handleImportCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
