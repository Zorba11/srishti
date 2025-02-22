'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { ActorCard } from './ActorCard';
import { MovieStore } from '@/stores/MovieStore';
import { toast } from 'sonner';

interface ActorsStepProps {
  movieStore: MovieStore;
}

export const ActorsStep = observer(({ movieStore }: ActorsStepProps) => {
  const actors = movieStore.actors;
  const [pendingActorId, setPendingActorId] = useState<null | number>(null);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  // Toggle the pending state on actor card click
  const handleSelectActorClick = (actorId: number) => {
    // If we're in the middle of confirming, don't allow toggling
    if (isConfirming) return;
    setPendingActorId((prev) => (prev === actorId ? null : actorId));
  };

  // When the confirm button is clicked, select the actor via the store API
  const handleConfirmSelection = async (actorId: number) => {
    if (isConfirming) return; // Prevent double submission

    setIsConfirming(true);
    try {
      // First attempt to select the actor
      const success = await movieStore.selectActor(actorId);

      // Only if the selection was successful, proceed to the next step
      if (success) {
        setPendingActorId(null);
        // Add a small delay before transitioning to give user visual feedback
        await new Promise((resolve) => setTimeout(resolve, 500));
        movieStore.handleIdeaClick();
        toast.success('Actor selected successfully!');
      }
    } catch (error) {
      console.error('Error confirming actor selection:', error);
      toast.error('Failed to select actor. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="text-center mb-2 space-y-2">
        <motion.h2
          className="text-4xl font-light pt-6 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-white/70"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Meet Your Story's Stars
        </motion.h2>
        <motion.p
          className="text-neutral-400 text-lg font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Select characters to bring your story to life
        </motion.p>
      </div>

      <div className="flex-1 pb-10 w-full flex items-center justify-center px-4">
        {actors.length === 1 ? (
          <div className="w-full max-w-sm mx-auto">
            <ActorCard
              actor={actors[0]}
              isPending={pendingActorId === actors[0].id}
              isConfirming={isConfirming}
              isSelected={movieStore.isActorSelectedById(actors[0].id)}
              onSelect={() => handleSelectActorClick(actors[0].id)}
              onConfirm={() => handleConfirmSelection(actors[0].id)}
              aspectClass="aspect-[1.6]"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 w-full">
            {actors.map((actor) => (
              <ActorCard
                key={actor.id}
                actor={actor}
                isPending={pendingActorId === actor.id}
                isConfirming={isConfirming}
                isSelected={movieStore.isActorSelectedById(actor.id)}
                onSelect={() => handleSelectActorClick(actor.id)}
                onConfirm={() => handleConfirmSelection(actor.id)}
                aspectClass="aspect-[4/5]"
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
});
