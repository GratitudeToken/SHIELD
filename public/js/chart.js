import { $, $$ } from '/js/selectors.js';
import { colors } from '/js/colors.js';

export let makeChart = (votes) => {
    const ctx = $$('.myChart');

    ctx.forEach((element, index) => {
        let voteLabels = [];
        votes[index].votes.length > 2 ? voteLabels = [...Array(votes[index].votes.length + 1).keys()].slice(1) : voteLabels = ['Yes', 'No'];

        // Change the legend text to array numbers !!!!!!!!!!!!!!!!!!!
        new Chart(element, {
            type: 'doughnut',
            data: {
                labels: voteLabels,
                datasets: [{
                    data: votes[index].votes,
                    borderWidth: 0,
                    backgroundColor: colors
                }]
            },
            options: {
                aspectRatio: 1,
                cutout: 90,
                responsive: true,
                width: 230,
                height: 230,
                scales: {
                    y: {
                        display: false,
                    },
                    x: {
                        display: false,
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                    }
                }
            }
        });
    });
}