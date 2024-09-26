import { HistoricalEvent } from "./Components/MapsApp"; // Adjust the path as necessary

const categories = ["History", "Culture", "Science", "Politics", "Art"];
const titles = [
  "The Great Fire",
  "Invention of the Wheel",
  "First Moon Landing",
  "Fall of the Berlin Wall",
  "Discovery of Penicillin",
  // Add more titles as needed
];

const generateRandomEvent = (id: number): HistoricalEvent => {
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  const randomDescription = `Description for ${randomTitle}`;

  // Random latitude and longitude within certain bounds
  const randomLatitude = (Math.random() * 180 - 90).toFixed(6);
  const randomLongitude = (Math.random() * 360 - 180).toFixed(6);

  return {
    id,
    title: randomTitle,
    description: randomDescription,
    position: [parseFloat(randomLatitude), parseFloat(randomLongitude)],
    category: randomCategory,
  };
};

const eventsData: HistoricalEvent[] = Array.from({ length: 100000 }, (_, index) => generateRandomEvent(index + 1));

export default eventsData;
