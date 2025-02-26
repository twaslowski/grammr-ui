import { BookPlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { toast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Toaster } from '@/components/ui/toaster';

import Deck from '@/types/deck';
import Token from '@/types/token';

interface FlashcardExportProps {
  token: Token;
}

const FlashcardExport: React.FC<FlashcardExportProps> = ({ token }) => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeckDialog, setShowDeckDialog] = useState(false);
  const [showNewDeckDialog, setShowNewDeckDialog] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');

  // Check authentication on component mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const response = await fetch('/api/v1/user', {
        credentials: 'same-origin',
      });
      setAuthenticated(response.status === 200);
    } catch (error) {
      setAuthenticated(false);
    }
  };

  const fetchDecks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/v1/anki/decks', {
        credentials: 'same-origin',
      });
      if (response.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = await response.json();
      setDecks(data);
      setIsLoading(false);
      setShowDeckDialog(true);
    } catch (error) {
      toast({
        title: 'Error loading decks',
        description: 'Please try again later',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const createNewDeck = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/v1/anki/deck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newDeckName }),
        credentials: 'same-origin',
      });
      const newDeck = await response.json();
      setDecks([...decks, newDeck]);
      setSelectedDeck(newDeck.name);
      setShowNewDeckDialog(false);
      setNewDeckName('');
    } catch (error) {
      toast({
        title: 'Error creating deck',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createFlashcard = async () => {
    if (!selectedDeck) return;

    try {
      setIsLoading(true);
      await fetch('/api/v1/anki/flashcard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deckId: selectedDeck,
          question: token.text,
          answer: token.translation.translation,
        }),
      });

      toast({
        title: 'Success',
        description: 'Flashcard created successfully',
      });

      // Reset and close dialog
      setShowDeckDialog(false);
      setSelectedDeck('');
    } catch (error) {
      toast({
        title: 'Error creating flashcard',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeckChange = (deckName: string) => {
    if (deckName === 'new') {
      setShowNewDeckDialog(true);
    } else {
      setSelectedDeck(deckName);
    }
  };

  const handleAddFlashcard = () => {
    if (!authenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to save flashcards',
        variant: 'destructive',
      });
      return;
    }

    // Load decks and show deck selection dialog
    fetchDecks();
  };

  return (
    <div className='space-y-4'>
      <Button onClick={handleAddFlashcard} disabled={isLoading}>
        <BookPlus className='h-4 w-4 mr-2' />
        Export to flashcard
      </Button>

      <Toaster />

      {/* Deck Selection Dialog */}
      <Dialog open={showDeckDialog} onOpenChange={setShowDeckDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Deck</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <Select
              value={selectedDeck}
              onValueChange={handleDeckChange}
              disabled={isLoading}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select a deck' />
              </SelectTrigger>
              <SelectContent>
                {decks.map((deck: Deck) => (
                  <SelectItem key={deck.id} value={deck.id.toString()}>
                    {deck.name}
                  </SelectItem>
                ))}
                <SelectItem value='new' className='text-blue-600'>
                  <div className='flex items-center gap-2'>Create new deck</div>
                </SelectItem>
              </SelectContent>
            </Select>
            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => setShowDeckDialog(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={createFlashcard}
                disabled={!selectedDeck || selectedDeck === 'new' || isLoading}
              >
                Create Flashcard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Deck Dialog */}
      <Dialog open={showNewDeckDialog} onOpenChange={setShowNewDeckDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Deck</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <Input
              placeholder='Deck name'
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
            />
            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => setShowNewDeckDialog(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={createNewDeck}
                disabled={!newDeckName || isLoading}
              >
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FlashcardExport;
