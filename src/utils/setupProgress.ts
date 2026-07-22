/**
 * What a SetupProgress record actually means for navigation: whether
 * every Phase 2 step is done, and — if not — which onboarding screen to
 * resume at. Kept separate from storage.ts so the pure AsyncStorage
 * read/write stays free of route-string knowledge.
 */
import { Href } from 'expo-router';

import { ALL_SETUP_STEPS, SetupProgress, SetupStep } from '@/utils/storage';

const SETUP_STEP_ROUTES: Record<SetupStep, Href> = {
  contacts: '/onboarding-contacts',
  activation: '/onboarding-activation',
  shortcuts: '/onboarding-shortcuts',
  decoy: '/onboarding-decoy',
};

export function isSetupComplete(progress: SetupProgress): boolean {
  return ALL_SETUP_STEPS.every((step) => progress.completedSteps.includes(step));
}

/** The first not-yet-completed step's route, or null if everything's done. */
export function getNextIncompleteSetupRoute(progress: SetupProgress): Href | null {
  const nextStep = ALL_SETUP_STEPS.find((step) => !progress.completedSteps.includes(step));
  return nextStep ? SETUP_STEP_ROUTES[nextStep] : null;
}

/**
 * Whether the Home "finish setting up" reminder has been dismissed for this
 * app session. Deliberately an in-memory module variable, not AsyncStorage —
 * "Not now" should hide the reminder until the next app launch, but keep
 * hiding it across in-session navigation (e.g. visiting Settings and coming
 * back to Home), which a plain useState on HomeScreen wouldn't survive since
 * the screen unmounts when it's off the stack.
 */
let reminderDismissedThisSession = false;

export function dismissSetupReminderForSession(): void {
  reminderDismissedThisSession = true;
}

export function isSetupReminderDismissedForSession(): boolean {
  return reminderDismissedThisSession;
}
