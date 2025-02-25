import { BookPlus, Plus } from 'lucide-react';
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
  const [showNewDeckDialog, setShowNewDeckDialog] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');

  // Fetch decks on component mount
  useEffect(() => {
    fetchDecks();
  }, []);

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
    } catch (error) {
      toast({
        title: 'Error loading decks',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
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
      setNewDeckName(newDeck.name);
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
    console.log('Creating new flashcard for token', token);

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
      console.log('Performed fetch');

      toast({
        title: 'Success',
        description: 'Flashcard created successfully',
        variant: 'destructive',
        duration: 5000,
      });
    } catch (error) {
      console.error(error);
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
      // Don't update selectedDeck yet - wait until new deck is created
    } else {
      setSelectedDeck(deckName);
    }
  };

  return (
    <div className='space-y-4'>
      {authenticated && (
        <div className='flex items-center gap-2'>
          <Select
            value={selectedDeck}
            onValueChange={handleDeckChange}
            disabled={isLoading}
          >
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder='Select a deck' />
            </SelectTrigger>
            <SelectContent>
              {decks.map((deck: Deck) => (
                <SelectItem key={deck.id} value={deck.id.toString()}>
                  {deck.name}
                </SelectItem>
              ))}
              <SelectItem value='new' className='text-blue-600'>
                <div className='flex items-center gap-2'>
                  <Plus className='h-4 w-4' />
                  Create new deck
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={createFlashcard}
            disabled={!selectedDeck || selectedDeck === 'new' || isLoading}
          >
            <BookPlus className='h-4 w-4 mr-2' />
            Create Flashcard
          </Button>
        </div>
      )}

      {!authenticated && (
        <p className='text-sm text-gray-500'>
          Please sign in to save flashcards.
        </p>
      )}

      <Toaster />

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
