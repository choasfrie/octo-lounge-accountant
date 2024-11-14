document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').slice(1);
                const targetElement = document.getElementById(targetId);
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const data = new vis.DataSet([
        {x: '2024-01-01', y: 10},
        {x: '2024-01-15', y: 15},
        {x: '2024-02-01', y: 25},
        {x: '2024-02-15', y: 20},
        {x: '2024-03-01', y: 30},
        {x: '2024-03-15', y: 35},
        {x: '2024-04-01', y: 40},
     ]);
     
     const options = {
        start: '2024-01-01',
        end: '2024-04-15',
        drawPoints: true,
        dataAxis: {
           left: {title: {text: 'Values (Y Axis)'}},
        },
        timeAxis: {title: {text: 'Dates (X Axis)'}},
     };
  
     window.onload = function() {
        new vis.Graph2d(document.getElementById('visualization'), data, options);
     };
});