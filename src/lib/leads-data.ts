export type Lead = {
    _id: string;
    searchKeyword: string;
    description: string;
    status: string;
    createdAt: string;
    userLocation: {
        city: string;
        address?: string;
    };
    user: {
      name: string;
    };
    totalVendorsNotified: number;
    totalAccepted: number;
};
export const leadsData = [
    {
        id: 1,
        name: 'Arun',
        location: 'Nagpur',
        timestamp: '09 Oct 2025, 11:30 am',
    },
    {
        id: 2,
        name: 'Pradhnya Ramteke',
        location: 'Nagpur',
        timestamp: '08 Oct 2025, 08:21 am',
    },
    {
        id: 3,
        name: 'Ranchi Nikose',
        location: 'Nagpur, Beltaroadi Road-Manewada',
        timestamp: '07 Oct 2025, 11:47 am',
    },
    {
        id: 4,
        name: 'Amrit Singh',
        location: 'Nagpur, Parsodi',
        timestamp: '02 Oct 2025, 01:26 pm',
    },
    {
        id: 5,
        name: 'Tanushree Awachat',
        location: 'Nagpur, Shivaji Nagar',
        timestamp: '26 Sep 2025, 01:46 pm',
    },
    {
        id: 6,
        name: 'John Doe',
        location: 'New York',
        timestamp: '25 Sep 2025, 10:00 am',
    },
    {
        id: 7,
        name: 'Jane Smith',
        location: 'London',
        timestamp: '24 Sep 2025, 03:15 pm',
    },
    {
        id: 8,
        name: 'Carlos Gomez',
        location: 'Madrid',
        timestamp: '23 Sep 2025, 09:05 am',
    },
    {
        id: 9,
        name: 'Mei Lin',
        location: 'Beijing',
        timestamp: '22 Sep 2025, 05:50 pm',
    },
    {
        id: 10,
        name: 'Yuki Tanaka',
        location: 'Tokyo',
        timestamp: '21 Sep 2025, 11:11 am',
    },
    {
        id: 11,
        name: 'Fatima Al-Fassi',
        location: 'Dubai',
        timestamp: '20 Sep 2025, 08:30 am',
    },
];
