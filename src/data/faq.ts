export interface FaqItem {
  question: string
  answer: string
}

export interface FaqCategory {
  id: string
  title: string
  summary: string
  items: FaqItem[]
}

export const FAQ: readonly FaqCategory[] = [
  {
    id: 'bookings',
    title: 'Booking and reservations',
    summary: 'Making, changing, and cancelling a booking.',
    items: [
      {
        question: 'How do I change my flight dates?',
        answer:
          'Open My Trips, pick your booking, and tap "Change flight". Most fares allow a change with a fee and the fare difference. Flex fares are free to change up to 24 hours before departure.',
      },
      {
        question: 'Can I cancel for a refund?',
        answer:
          'Most fares are partially refundable within 24 hours of booking. After that, refund eligibility depends on the fare rules shown at checkout.',
      },
      {
        question: 'Do I need to print my boarding pass?',
        answer: 'No — all our mobile boarding passes are accepted at the airport. Check in online 24 hours before departure.',
      },
    ],
  },
  {
    id: 'payment',
    title: 'Payment and billing',
    summary: 'Cards, currencies, receipts, and security.',
    items: [
      {
        question: 'Which cards do you accept?',
        answer:
          'All major credit and debit cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, and PayPal at checkout.',
      },
      {
        question: 'Why was I charged in a different currency?',
        answer:
          "We price everything in GBP by default. If your card's currency differs, your bank may convert the amount and add a small fee.",
      },
      {
        question: 'Where can I find my receipt?',
        answer:
          'In My Trips, open the booking and tap "Download receipt". We also email one immediately after payment.',
      },
    ],
  },
  {
    id: 'baggage',
    title: 'Baggage',
    summary: 'Carry-on, checked bags, and special items.',
    items: [
      {
        question: 'What is the carry-on allowance?',
        answer:
          "Most economy fares include one small bag that fits under the seat. Standard and Flex fares add a cabin bag to the overhead bin.",
      },
      {
        question: 'How much does a checked bag cost?',
        answer:
          'From £30 each way if you add it during booking — cheaper than adding at the airport.',
      },
      {
        question: 'Can I bring a bike or ski?',
        answer:
          'Yes, with advance notice. Use the "Add sports equipment" option in Extras during booking.',
      },
    ],
  },
  {
    id: 'account',
    title: 'Account and loyalty',
    summary: 'Your Tripma account, rewards, and saved travellers.',
    items: [
      {
        question: 'How do I reset my password?',
        answer:
          'Go to Sign in and tap "Forgot password". We\'ll email a secure reset link to the address on file.',
      },
      {
        question: 'Do you have a loyalty programme?',
        answer:
          'Tripma Rewards: earn 1 point per £1 spent on flights and stays. Points can be redeemed on future bookings.',
      },
      {
        question: 'Can I save frequent travellers?',
        answer:
          'Yes — in Account, add passport and passenger details for anyone you regularly travel with to speed up checkout.',
      },
    ],
  },
]
