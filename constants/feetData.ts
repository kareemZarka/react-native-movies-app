export type FootEntry = {
    id: string;
    username: string;
    avatar: string;
    score: number;
    caption: string;
    image: string;
    date?: string;
    rank?: number;
    bestLabel?: string;
};

export const footHighlights: FootEntry[] = [
    {
        id: "1",
        username: "ToeKing",
        avatar: "🦶🔥",
        score: 9.4,
        caption: "Certified toe-model energy",
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
        rank: 1,
        bestLabel: "Greek God Feet 😭",
    },
    {
        id: "2",
        username: "Moisturized",
        avatar: "💅",
        score: 8.7,
        caption: "Elite toe symmetry",
        image: "https://images.unsplash.com/photo-1467703834117-04386e3dadd8?auto=format&fit=crop&w=900&q=80",
        rank: 2,
        bestLabel: "Elite toe symmetry",
    },
    {
        id: "3",
        username: "SocklessHero",
        avatar: "✨",
        score: 8.2,
        caption: "Moisturized & blessed 🔥",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80",
        rank: 3,
        bestLabel: "These toes pay rent",
    },
];

export const recentRatings: FootEntry[] = [
    {
        id: "4",
        username: "ArchAngel",
        avatar: "😇",
        score: 7.9,
        caption: "These toes pay rent",
        image: "https://images.unsplash.com/photo-1495366691023-cc4eadcc2d83?auto=format&fit=crop&w=900&q=80",
        date: "Today",
    },
    {
        id: "5",
        username: "Blaze",
        avatar: "🔥",
        score: 7.4,
        caption: "Moisturization crisis 😭",
        image: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6b1?auto=format&fit=crop&w=900&q=80",
        date: "2h ago",
    },
    {
        id: "6",
        username: "MythicFeet",
        avatar: "🏺",
        score: 8.1,
        caption: "Elite toe symmetry",
        image: "https://images.unsplash.com/photo-1508387024700-9fe5c0b37de2?auto=format&fit=crop&w=900&q=80",
        date: "3h ago",
    },
    {
        id: "7",
        username: "BareSoul",
        avatar: "🌙",
        score: 6.9,
        caption: "These toes saw war 💀",
        image: "https://images.unsplash.com/photo-1469535309241-52a5ea71c155?auto=format&fit=crop&w=900&q=80",
        date: "5h ago",
    },
];

export const profileHistory: FootEntry[] = [
    {
        id: "8",
        username: "You",
        avatar: "👣",
        score: 7.4,
        caption: "Certified toe-model energy",
        image: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=900&q=80",
        date: "Today",
    },
    {
        id: "9",
        username: "You",
        avatar: "👣",
        score: 6.8,
        caption: "Moisturization crisis 😭",
        image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80",
        date: "Yesterday",
    },
    {
        id: "10",
        username: "You",
        avatar: "👣",
        score: 7.9,
        caption: "Elite toe symmetry",
        image: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=900&q=80",
        date: "2 days ago",
    },
];
