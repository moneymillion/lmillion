
document.addEventListener('DOMContentLoaded', function() {
  // ... existing code within the DOMContentLoaded block ...

  document.getElementById('annualProfit').addEventListener('input', function() {
      const annualAPR = parseFloat(this.value);

      // Check if annualAPR is a number and greater than 0
      if (!isNaN(annualAPR) && annualAPR > 0) {
          const monthlyRate = (Math.pow(1 + annualAPR / 100, 1/12) - 1) * 100;

          // Populate the min and max compound fields with the calculated monthly rate
          document.getElementById('min-compound').value = monthlyRate.toFixed(2);
          document.getElementById('max-compound').value = monthlyRate.toFixed(2);
      } else {
          // Clear the fields if annualAPR is not valid
          document.getElementById('min-compound').value = '';
          document.getElementById('max-compound').value = '';
      }
  });
  // ... remaining code within the DOMContentLoaded block ...

  // Chart initialization
  const ctx = document.getElementById('myChart').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], // Empty labels array
      datasets: [{
        label: 'Ending Balance',
        data: [], // Empty data array
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      responsive: true,
      tooltips: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(tooltipItem, data) {
            console.log("Tooltip Item:", tooltipItem, "Data:", data);
            let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            return `$${value}`;
          }
        }
      },
      title: {
        display: true,
        text: '' // Placeholder, to be dynamically updated
      }
    }
  });


    // Restoring button states from sessionStorage
    ['12m', '24m', '36m'].forEach(term => {
        if (sessionStorage.getItem(`btn-${term}-clicked`) === 'true') {
            const btn = document.getElementById(`btn-${term}`);
            btn.classList.add('greyed-out');
            // Show the table result even for greyed-out buttons
            showTableResult(parseInt(term));
        }
    });

    document.getElementById('input-form').addEventListener('submit', function(e) {
        e.preventDefault();

        // Read user inputs
        const maxCompound = parseFloat(document.getElementById('max-compound').value);
        const minCompound = parseFloat(document.getElementById('min-compound').value);
        const startingBalance = parseFloat(document.getElementById('starting-balance').value);

        // Store inputs in localStorage
        localStorage.setItem('maxCompound', maxCompound);
        localStorage.setItem('minCompound', minCompound);
        localStorage.setItem('startingBalance', startingBalance);

        // Check if inputs have changed
        const inputsChanged = checkInputsChanged(maxCompound, minCompound, startingBalance);

        // Show the duration selection buttons
        document.getElementById('duration-selection').classList.remove('hidden');

        // Setup duration buttons with proper calculation and display logic
        setupDurationButtons(minCompound, maxCompound, startingBalance);

        // Refresh the table and ungrey all buttons if inputs changed
        if (inputsChanged) {
            hideAllResultTables();
            refreshGreyedOutButtons();
        }
    });

    function setupDurationButtons(minCompound, maxCompound, startingBalance) {
        ['12m', '24m', '36m'].forEach(term => {
            const btn = document.getElementById(`btn-${term}`);
            btn.onclick = () => {
                hideAllResultTables();

                if (!btn.classList.contains('greyed-out')) {
                    // Calculate and display results for the first time
                    calculateAndDisplayResults(parseInt(term), minCompound, maxCompound, startingBalance);
                    // Grey out the button and save the state
                    btn.classList.add('greyed-out');
                    sessionStorage.setItem(`btn-${term}-clicked`, 'true');
                } else {
                    // For greyed-out button, recalculate and display results (this will update the graph and table)
                    calculateAndDisplayResults(parseInt(term), minCompound, maxCompound, startingBalance);
                }
            };
        });
    }



    function calculateAndDisplayResults(months, minCompound, maxCompound, startingBalance) {
           const table = document.getElementById(`table-${months}m`);
           table.innerHTML = ''; // Clear previous content


        // Create table headers
        let headerRow = table.insertRow(0);
        ['Month', 'Starting Balance', 'Compound Percentage', 'Interest', 'Ending Balance'].forEach(header => {
            let th = document.createElement('th');
            th.innerText = header;
            headerRow.appendChild(th);
        });

        // Show the chart section first
        document.getElementById('graph-section').classList.remove('hidden');


        let currentBalance = startingBalance;
        let totalInterest = 0;
        let chartLabels = [];
        let chartData = [];

        for (let month = 1; month <= months; month++) {
            let startingBalanceForMonth = currentBalance;
            let compoundPercentage = (month === 1 ? minCompound : Math.random() * (maxCompound - minCompound) + minCompound);
            let interest = currentBalance * (compoundPercentage / 100);
            currentBalance += interest;
            totalInterest += interest;

            let row = table.insertRow(-1);
            row.insertCell(0).innerText = month;
            row.insertCell(1).innerText = startingBalanceForMonth.toFixed(2);
            row.insertCell(2).innerText = compoundPercentage.toFixed(2);
            row.insertCell(3).innerText = interest.toFixed(2);
            row.insertCell(4).innerText = currentBalance.toFixed(2);

            // Add month and current balance to chart data
            chartLabels.push(`Month ${month}`);
            chartData.push(currentBalance.toFixed(2));
        }

        // Update the chart label with the final ending balance
        let finalEndingBalance = currentBalance.toFixed(2);


            // Update the chart
            myChart.data.labels = chartLabels;
            myChart.data.datasets[0].data = chartData;
            myChart.data.datasets[0].label = `Ending Balance = $${finalEndingBalance}`;
            myChart.update();


        // Add a row for the final ending balance
        let endingBalanceRow = table.insertRow(-1);
        endingBalanceRow.insertCell(0).innerText = 'Final Ending Balance';
        endingBalanceRow.insertCell(1).innerText = '';
        endingBalanceRow.insertCell(2).innerText = '';
        endingBalanceRow.insertCell(3).innerText = '';
        endingBalanceRow.insertCell(4).innerText = currentBalance.toFixed(2);

        let totalRow = table.insertRow(-1);
        totalRow.insertCell(0).innerText = 'Total Interest';
        totalRow.insertCell(1).innerText = '';
        totalRow.insertCell(2).innerText = '';
        totalRow.insertCell(3).innerText = '';
        totalRow.insertCell(4).innerText = totalInterest.toFixed(2);

        document.getElementById('supplement-question').classList.remove('hidden');

        // Finally, show the table with results
        document.getElementById(`results-${months}m`).classList.remove('hidden');
    }

    function hideAllResultTables() {
    document.getElementById('graph-section').classList.add('hidden');
    document.getElementById('supplement-question').classList.add('hidden');
    ['12m', '24m', '36m'].forEach(term => {
        document.getElementById(`results-${term}`).classList.add('hidden');
    });
}

    function showTableResult(months) {
        // Show the result section for the selected term
        document.getElementById(`results-${months}m`).classList.remove('hidden');
    }

    function checkInputsChanged(maxCompound, minCompound, startingBalance) {
        // Read the previous inputs from sessionStorage
        const prevMaxCompound = parseFloat(sessionStorage.getItem('prev-max-compound'));
        const prevMinCompound = parseFloat(sessionStorage.getItem('prev-min-compound'));
        const prevStartingBalance = parseFloat(sessionStorage.getItem('prev-starting-balance'));

        // Compare current inputs with previous inputs
        const maxChanged = maxCompound !== prevMaxCompound;
        const minChanged = minCompound !== prevMinCompound;
        const balanceChanged = startingBalance !== prevStartingBalance;

        // Save current inputs to sessionStorage
        sessionStorage.setItem('prev-max-compound', maxCompound.toString());
        sessionStorage.setItem('prev-min-compound', minCompound.toString());
        sessionStorage.setItem('prev-starting-balance', startingBalance.toString());

        return maxChanged || minChanged || balanceChanged;
    }

    function refreshGreyedOutButtons() {
        ['12m', '24m', '36m'].forEach(term => {
            const btn = document.getElementById(`btn-${term}`);
            if (btn.classList.contains('greyed-out')) {
                // Ungrey the button and enable it
                btn.classList.remove('greyed-out');
                btn.disabled = false;
                // Clear the sessionStorage state
                sessionStorage.removeItem(`btn-${term}-clicked`);
            }
        });
    }

    // Handle the supplement question responses
    document.getElementById('supplement-yes').onclick = () => {
        // Open a new window with secondpage.html
        window.open('secondpage.html', '_blank');
    };

    document.getElementById('supplement-no').onclick = () => {
        // Logic to handle the 'No' response
        console.log('User chose not to add a supplement.');
        // You can add logic here to simply continue showing the current results
    };
});
