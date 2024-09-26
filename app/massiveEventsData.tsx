// Simulating 1 million historical events with random coordinates
const massiveEventsData = Array.from({ length: 1000000 }, (_, i) => ({
    id: i + 1,
    title: `Historical Event ${i + 1}`,
    description: `Description for event ${i + 1}`,
    position: [
      (Math.random() * 360) - 180, // Random longitude between -180 and 180
      (Math.random() * 180) - 90   // Random latitude between -90 and 90
    ],
    category: `Category ${Math.floor(Math.random() * 5) + 1}` // Random category between 1-5
  }));
  
  export default massiveEventsData;
  