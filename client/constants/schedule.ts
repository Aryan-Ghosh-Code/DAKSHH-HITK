export interface FestEvent {
  id: string;
  eventName: string;
  description: string;
  time: string;
  venue: string;
}

export interface FestDay {
  dayTitle: string;
  date: string;
  events: FestEvent[];
}

export const FEST_SCHEDULE: FestDay[] = [
  {
    dayTitle: "Day 1: Launch Sequence",
    date: "April 10, 2026",
    events: [
      {
        id: "d1-1",
        eventName: "DAKSHH Inauguration",
        description: "The grand kickoff ceremony for the tech fest.",
        time: "10:00 AM - 11:30 AM",
        venue: "Main Auditorium",
      },
      {
        id: "d1-2",
        eventName: "SPAWN Gaming Tournament",
        description: "Group stages for Valorant and BGMI kick-off.",
        time: "12:00 PM - 5:00 PM",
        venue: "Computer Labs 1-4",
      },
      {
        id: "d1-3",
        eventName: "Hack Heritage: The Sequel",
        description: "24-hour hackathon officially begins. Start building!",
        time: "6:00 PM onwards",
        venue: "HIT Library",
      },
    ],
  },
  {
    dayTitle: "Day 2: Final Orbit",
    date: "April 11, 2026",
    events: [
      {
        id: "d2-1",
        eventName: "Web3 & Blockchain Panel",
        description: "Exploring decentralized tech and smart contracts.",
        time: "11:00 AM - 1:00 PM",
        venue: "Seminar Hall B",
      },
      {
        id: "d2-2",
        eventName: "SPAWN Finals",
        description: "The ultimate showdown for the gaming championship.",
        time: "2:00 PM - 5:00 PM",
        venue: "Computer Labs 1-4",
      },
      {
        id: "d2-3",
        eventName: "Prize Distribution",
        description: "Crowning the champions and distributing the prize pools.",
        time: "5:30 PM - 7:00 PM",
        venue: "Main Auditorium",
      },
    ],
  },
];