// Sample Data
const data = new vis.DataSet([
    { x: '2024-01-01', y: 10 },
    { x: '2024-01-15', y: 15 },
    { x: '2024-02-01', y: 25 },
    { x: '2024-02-15', y: 20 },
]);

// Graph config
const options = {
    start: '2024-01-01',
    end: '2024-04-15',
    drawPoints: true,
    dataAxis: {
        left: { title: { text: 'Values (Y Axis)' } },
    },
    timeAxis: { title: { text: 'Dates (X Axis)' } },
    width: '100%',
    height: '100%',
};

const container = document.getElementById('visualization');
new vis.Graph2d(container, data, options);

window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
});
