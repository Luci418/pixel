import { useLocalStorage } from './useLocalStorage';
import type { Subscriber } from '@/types';
import { mockSubscribers } from '@/data/mockData';

export function useSubscribers() {
  const [subscribers, setSubscribers] = useLocalStorage<Subscriber[]>(
    'cable-tv-subscribers',
    mockSubscribers
  );

  const addSubscriber = (subscriber: Omit<Subscriber, 'id'>) => {
    const newSubscriber: Subscriber = {
      ...subscriber,
      id: `sub-${Date.now()}`,
    };
    setSubscribers([...subscribers, newSubscriber]);
    return newSubscriber;
  };

  const updateSubscriber = (id: string, updates: Partial<Subscriber>) => {
    setSubscribers(
      subscribers.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub))
    );
  };

  const deleteSubscriber = (id: string) => {
    setSubscribers(subscribers.filter((sub) => sub.id !== id));
  };

  const getSubscriberById = (id: string) => {
    return subscribers.find((sub) => sub.id === id);
  };

  return {
    subscribers,
    addSubscriber,
    updateSubscriber,
    deleteSubscriber,
    getSubscriberById,
  };
}
