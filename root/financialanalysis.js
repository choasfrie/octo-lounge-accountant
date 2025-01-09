import { authManager } from './auth.js';

const apiUrl = await fetch(`http://localhost:5116/api/Accounts/getAllAccountsAndRecords/${authManager.currentUser.id}`);

// Example function to fetch data from your API
async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const apiData = await response.json();

    // Transform the API data into an array of { x: date, y: number }
    // Adjust this part according to the structure of your API response.
    //
    // Example shape:
    // [
    //   {
    //     accountId: 1,
    //     records: [
    //       { date: '2024-01-01', value: 10 },
    //       { date: '2024-01-15', value: 15 }
    //     ]
    //   },
    //   ...
    // ]
    //
    const transformedData = [];
    apiData.forEach(account => {
      (account.records || []).forEach(record => {
        transformedData.push({
          x: record.date,  // e.g., '2024-01-01'
          y: record.value  // e.g., 10
        });
      });
    });

    return transformedData;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

// Initialize and render the Vis.js Graph2d
async function initGraph() {
  const container = document.getElementById('visualization');

  // 1. Fetch data from the API
  const graphData = await fetchData();

  // 2. Create a Vis DataSet
  const data = new vis.DataSet(graphData);

  // 3. Define the Graph2d configuration
  const options = {
    start: '2024-01-01',
    end: '2024-12-31',
    drawPoints: true,
    dataAxis: {
      left: {
        title: {
          text: 'Values (Y Axis)'
        }
      }
    },
    timeAxis: {
      title: {
        text: 'Dates (X Axis)'
      }
    },
    width: '100%',
    height: '100%'
  };

  // 4. Create the Graph2d
  new vis.Graph2d(container, data, options);

  // 5. Handle window resizing
  window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
  });
}

// Run the graph initialization when the page is loaded
window.addEventListener('DOMContentLoaded', initGraph);
