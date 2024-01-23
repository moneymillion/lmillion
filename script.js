document.getElementById('input-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Read user inputs
    const maxCompound = parseFloat(document.getElementById('max-compound').value);
    const minCompound = parseFloat(document.getElementById('min-compound').value);
    const startingBalance = parseFloat(document.getElementById('starting-balance').value);
    
    // Show the duration selection buttons
    document.getElementById('duration-selection').classList.remove('hidden');
    
    // Setup duration buttons with proper calculation and display logic
    setupDurationButtons(minCompound, maxCompound, startingBalance);
});

function setupDurationButtons(minCompound, maxCompound, startingBalance) {
    ['12m', '24m', '36m'].forEach(term => {
        document.getElementById(`btn-${term}`).onclick = () => {
            hideAllResultTables(); 
            calculateAndDisplayResults(parseInt(term), minCompound, maxCompound, startingBalance);
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

    let currentBalance = startingBalance;
    let totalInterest = 0;
    
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
    }

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

    // Ensure the result section for the selected term is visible
    document.getElementById(`results-${months}m`).classList.remove('hidden');
}

function hideAllResultTables() {
    ['12m', '24m', '36m'].forEach(term => {
        document.getElementById(`results-${term}`).classList.add('hidden');
    });
}
