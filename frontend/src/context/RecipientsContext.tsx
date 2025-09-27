import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Recipient {
  name: string;
  [key: string]: any;
}

interface RecipientsContextType {
  recipients: Recipient[];
  setRecipients: (recipients: Recipient[]) => void;
}

const RecipientsContext = createContext<RecipientsContextType | undefined>(undefined);

export function RecipientsProvider({ children }: { children: ReactNode }) {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  return (
    <RecipientsContext.Provider value={{ recipients, setRecipients }}>
      {children}
    </RecipientsContext.Provider>
  );
}

export function useRecipients() {
  const context = useContext(RecipientsContext);
  if (!context) throw new Error('useRecipients must be used within a RecipientsProvider');
  return context;
}
