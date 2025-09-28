import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface TextField {
  id: number;
  x: number;
  y: number;
  text: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  recipientOverrides?: { [recipientId: number]: { x?: number; y?: number; fontSize?: number } };
}

export interface ImageField {
  id: number;
  x: number;
  y: number;
  url: string;
  width?: number;
  height?: number;
}

export interface DesignSettings {
  backgroundImage?: string;
  textFields: TextField[];
  imageFields: ImageField[];
  canvasWidth: number;
  canvasHeight: number;
}

interface DesignContextType {
  designSettings: DesignSettings;
  updateDesignSettings: (settings: Partial<DesignSettings>) => void;
  addTextField: (field: Omit<TextField, 'id'>) => void;
  updateTextField: (id: number, updates: Partial<TextField>) => void;
  removeTextField: (id: number) => void;
  addImageField: (field: Omit<ImageField, 'id'>) => void;
  updateImageField: (id: number, updates: Partial<ImageField>) => void;
  removeImageField: (id: number) => void;
  setBackgroundImage: (url: string) => void;
  updateTextFieldForRecipient: (textFieldId: number, recipientId: number, overrides: { x?: number; y?: number; fontSize?: number }) => void;
  getTextFieldForRecipient: (textFieldId: number, recipientId: number) => TextField;
  syncRecipientsWithTextFields: (recipients: Array<{ id: number; name: string; email?: string }>) => void;
  updateTemplateField: (textFieldId: number, updates: { x?: number; y?: number; fontSize?: number }) => void;
  clearRecipientOverrides: (textFieldId: number, recipientId?: number) => void;
  hasRecipientOverride: (textFieldId: number, recipientId: number) => boolean;
}

const DesignContext = createContext<DesignContextType | undefined>(undefined);

const defaultDesignSettings: DesignSettings = {
  backgroundImage: undefined,
  textFields: [],
  imageFields: [],
  canvasWidth: 842, // A4 landscape width in pixels (297mm)
  canvasHeight: 595, // A4 landscape height in pixels (210mm)
};

export function DesignProvider({ children }: { children: ReactNode }) {
  const [designSettings, setDesignSettings] = useState<DesignSettings>(defaultDesignSettings);

  const updateDesignSettings = (updates: Partial<DesignSettings>) => {
    setDesignSettings(prev => ({ ...prev, ...updates }));
  };

  const addTextField = (field: Omit<TextField, 'id'>) => {
    const newField: TextField = {
      id: Date.now(),
      ...field,
    };
    setDesignSettings(prev => ({
      ...prev,
      textFields: [...prev.textFields, newField],
    }));
  };

  const updateTextField = (id: number, updates: Partial<TextField>) => {
    setDesignSettings(prev => ({
      ...prev,
      textFields: prev.textFields.map(field =>
        field.id === id ? { ...field, ...updates } : field
      ),
    }));
  };

  const removeTextField = (id: number) => {
    setDesignSettings(prev => ({
      ...prev,
      textFields: prev.textFields.filter(field => field.id !== id),
    }));
  };

  const addImageField = (field: Omit<ImageField, 'id'>) => {
    const newField: ImageField = {
      id: Date.now(),
      ...field,
    };
    setDesignSettings(prev => ({
      ...prev,
      imageFields: [...prev.imageFields, newField],
    }));
  };

  const updateImageField = (id: number, updates: Partial<ImageField>) => {
    setDesignSettings(prev => ({
      ...prev,
      imageFields: prev.imageFields.map(field =>
        field.id === id ? { ...field, ...updates } : field
      ),
    }));
  };

  const removeImageField = (id: number) => {
    setDesignSettings(prev => ({
      ...prev,
      imageFields: prev.imageFields.filter(field => field.id !== id),
    }));
  };

  const setBackgroundImage = (url: string) => {
    setDesignSettings(prev => ({
      ...prev,
      backgroundImage: url,
    }));
  };

  const updateTextFieldForRecipient = (textFieldId: number, recipientId: number, overrides: { x?: number; y?: number; fontSize?: number }) => {
    setDesignSettings(prev => ({
      ...prev,
      textFields: prev.textFields.map(field => {
        if (field.id === textFieldId) {
          return {
            ...field,
            recipientOverrides: {
              ...field.recipientOverrides,
              [recipientId]: {
                ...field.recipientOverrides?.[recipientId],
                ...overrides,
              },
            },
          };
        }
        return field;
      }),
    }));
  };

  const getTextFieldForRecipient = (textFieldId: number, recipientId: number): TextField => {
    const field = designSettings.textFields.find(f => f.id === textFieldId);
    if (!field) throw new Error(`TextField with id ${textFieldId} not found`);
    
    const overrides = field.recipientOverrides?.[recipientId];
    if (!overrides) return field;
    
    return {
      ...field,
      x: overrides.x ?? field.x,
      y: overrides.y ?? field.y,
      fontSize: overrides.fontSize ?? field.fontSize,
    };
  };

  const syncRecipientsWithTextFields = (recipients: Array<{ id: number; name: string; email?: string }>) => {
    // Find existing name field (one that contains {name} placeholder)
    const existingNameField = designSettings.textFields.find(field => field.text.includes('{name}'));
    
    if (!existingNameField && recipients.length > 0) {
      // Create a default name field if none exists
      addTextField({
        x: designSettings.canvasWidth / 2 - 100, // Center horizontally
        y: designSettings.canvasHeight / 2, // Center vertically
        text: '{name}',
        fontSize: 32,
        color: '#000000',
        fontFamily: 'Arial, sans-serif'
      });
    }
  };

  const updateTemplateField = (textFieldId: number, updates: { x?: number; y?: number; fontSize?: number }) => {
    // Update the base field (template) and clear all recipient overrides
    updateTextField(textFieldId, updates);
    
    // Clear all recipient overrides for this field
    setDesignSettings(prev => ({
      ...prev,
      textFields: prev.textFields.map(field => {
        if (field.id === textFieldId) {
          return {
            ...field,
            recipientOverrides: {}
          };
        }
        return field;
      }),
    }));
  };

  const clearRecipientOverrides = (textFieldId: number, recipientId?: number) => {
    setDesignSettings(prev => ({
      ...prev,
      textFields: prev.textFields.map(field => {
        if (field.id === textFieldId) {
          if (recipientId) {
            // Clear override for specific recipient
            const newOverrides = { ...field.recipientOverrides };
            delete newOverrides[recipientId];
            return {
              ...field,
              recipientOverrides: newOverrides
            };
          } else {
            // Clear all overrides for this field
            return {
              ...field,
              recipientOverrides: {}
            };
          }
        }
        return field;
      }),
    }));
  };

  const hasRecipientOverride = (textFieldId: number, recipientId: number): boolean => {
    const field = designSettings.textFields.find(f => f.id === textFieldId);
    return field?.recipientOverrides?.[recipientId] !== undefined;
  };

  return (
    <DesignContext.Provider
      value={{
        designSettings,
        updateDesignSettings,
        addTextField,
        updateTextField,
        removeTextField,
        addImageField,
        updateImageField,
        removeImageField,
        setBackgroundImage,
        updateTextFieldForRecipient,
        getTextFieldForRecipient,
        syncRecipientsWithTextFields,
        updateTemplateField,
        clearRecipientOverrides,
        hasRecipientOverride,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  const context = useContext(DesignContext);
  if (context === undefined) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
}
