export interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  image: any;
}

export const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'Welcome to GoGoTalk',
    description:
      'Connect with friends and family through instant messaging, voice, and video calls.',
    image: require('../../assets/onboarding1.png'),
  },
  {
    id: '2',
    title: 'Secure Messaging',
    description:
      "Your conversations are important. That's why we provide a secure platform for all your communication needs.",
    image: require('../../assets/onboarding2.png'),
  },
  {
    id: '3',
    title: 'Group Chats',
    description: 'Create groups, share photos and videos, and keep everyone in the loop.',
    image: require('../../assets/onboarding3.png'),
  },
];
