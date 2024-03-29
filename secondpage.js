
document.addEventListener('DOMContentLoaded', function() {
    // Retrieve stored values from localStorage
    const maxCompoundStored = localStorage.getItem('maxCompound');
    const minCompoundStored = localStorage.getItem('minCompound');
    const startingBalanceStored = localStorage.getItem('startingBalance');



    // Auto-fill the form if values are present in localStorage
    if (maxCompoundStored !== null && minCompoundStored !== null && startingBalanceStored !== null) {
        document.getElementById('max-compound').value = maxCompoundStored;
        document.getElementById('min-compound').value = minCompoundStored;
        document.getElementById('starting-balance').value = startingBalanceStored;
    } else {
        // If values are not present, prompt the user to fill them on the first page
        alert('Please provide the required inputs on the first page.');
        window.location.href = 'index.html'; // Redirect to the 1st page
    }

    document.getElementById('input-form').addEventListener('submit', function(e) {
        e.preventDefault();

        // Read user inputs
        const maxCompound = parseFloat(document.getElementById('max-compound').value);
        const minCompound = parseFloat(document.getElementById('min-compound').value);
        const startingBalance = parseFloat(document.getElementById('starting-balance').value);
        const supplementAmount = parseFloat(document.getElementById('supplement-amount').value);

        // Show the duration selection buttons
        document.getElementById('duration-selection').classList.remove('hidden');

        // Setup duration buttons with proper calculation and display logic
        setupDurationButtons(minCompound, maxCompound, startingBalance, supplementAmount);
    });



    function setupDurationButtons(minCompound, maxCompound, startingBalance, supplementAmount) {
        ['12m', '24m'].forEach(term => {
            const btn = document.getElementById(`btn-${term}`);
            btn.onclick = () => {
                hideAllResultTables();
                calculateAndDisplayResults(parseInt(term), minCompound, maxCompound, startingBalance, supplementAmount);
                // Show the supplement question section
                document.getElementById('supplement-question').classList.remove('hidden');

            };
        });

        // 36 Month button setup
        document.getElementById('btn-36m').addEventListener('click', function() {
            // Retrieve the necessary variables
            const minCompound = parseFloat(document.getElementById('min-compound').value);
            const maxCompound = parseFloat(document.getElementById('max-compound').value);
            const startingBalance = parseFloat(document.getElementById('starting-balance').value);
            const supplementAmount = parseFloat(document.getElementById('supplement-amount').value);

            // Set the title for the 36-month results
            document.getElementById('results-36m').querySelector('h3').innerText = 'Results for 36 Months';

            // Hide all result tables first
            hideAllResultTables();

            // Calculate and show the results for 36 months
            calculateAndDisplayResults(36, minCompound, maxCompound, startingBalance, supplementAmount);
        });


            // Setup the new "LMillion" button
          document.getElementById('btn-lmillion').addEventListener('click', function() {
              // Retrieve the necessary variables first
              const minCompound = parseFloat(document.getElementById('min-compound').value);
              const maxCompound = parseFloat(document.getElementById('max-compound').value);
              const startingBalance = parseFloat(document.getElementById('starting-balance').value);
              const supplementAmount = parseFloat(document.getElementById('supplement-amount').value);

              // Change the title of the results section
              document.getElementById('results-36m').querySelector('h3').innerText = 'Lead to Million Result';

              // Hide all result tables first
              hideAllResultTables();

              // Calculate and show the results until reaching a million
              calculateAndDisplayResultsUntilMillion(minCompound, maxCompound, startingBalance, supplementAmount);
          });



    }

    function calculateAndDisplayResults(months, minCompound, maxCompound, startingBalance, supplementAmount) {
        const table = document.getElementById(`table-${months}m`);
        table.innerHTML = ''; // Clear previous content

        // Create table headers
        let headerRow = table.insertRow(0);
        ['Month', 'Starting Balance', 'Compound Percentage', 'Interest', 'Supplement Amount', 'Ending Balance'].forEach(header => {
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

            let displayedSupplementAmount = month > 1 ? supplementAmount : 0;  // 0 for the first month, actual amount for subsequent months
            currentBalance += displayedSupplementAmount;  // Add supplement amount to the current balance

            let row = table.insertRow(-1);
            row.insertCell(0).innerText = month;
            row.insertCell(1).innerText = startingBalanceForMonth.toFixed(2);
            row.insertCell(2).innerText = compoundPercentage.toFixed(2);
            row.insertCell(3).innerText = interest.toFixed(2);
            row.insertCell(4).innerText = displayedSupplementAmount.toFixed(2);  // Display supplement amount in the new column
            row.insertCell(5).innerText = currentBalance.toFixed(2);
        }

        // Add a row for the final ending balance
        let endingBalanceRow = table.insertRow(-1);
        endingBalanceRow.insertCell(0).innerText = 'Final Ending Balance';
        endingBalanceRow.insertCell(1).innerText = '';
        endingBalanceRow.insertCell(2).innerText = '';
        endingBalanceRow.insertCell(3).innerText = '';
        endingBalanceRow.insertCell(4).innerText = '';
        endingBalanceRow.insertCell(5).innerText = currentBalance.toFixed(2);

        let totalRow = table.insertRow(-1);
        totalRow.insertCell(0).innerText = 'Total Interest';
        totalRow.insertCell(1).innerText = '';
        totalRow.insertCell(2).innerText = '';
        totalRow.insertCell(3).innerText = '';
        totalRow.insertCell(4).innerText = '';
        totalRow.insertCell(5).innerText = totalInterest.toFixed(2);

        // Ensure the result section for the selected term is visible
        document.getElementById(`results-${months}m`).classList.remove('hidden');
    }

    function hideAllResultTables() {
        ['12m', '24m', '36m'].forEach(term => {
            document.getElementById(`results-${term}`).classList.add('hidden');
        });
    }


//Calculate Million
    function calculateAndDisplayResultsUntilMillion(minCompound, maxCompound, startingBalance, supplementAmount) {
      const table = document.getElementById('table-36m');
          table.innerHTML = ''; // Clear previous content

          // Change the title of the results section
          const resultsContainer = document.getElementById('results-36m');
          resultsContainer.querySelector('h3').innerText = 'Lead to Million Result';

        // Create table headers
        let headerRow = table.insertRow(0);
        ['Month', 'Starting Balance', 'Compound Percentage', 'Interest', 'Supplement Amount', 'Ending Balance'].forEach(header => {
            let th = document.createElement('th');
            th.innerText = header;
            headerRow.appendChild(th);
        });

        let currentBalance = startingBalance;
        let totalInterest = 0;
        let month = 1;

        while (currentBalance < 1000000) {
            let startingBalanceForMonth = currentBalance;
            let compoundPercentage = (month === 1 ? minCompound : Math.random() * (maxCompound - minCompound) + minCompound);
            let interest = currentBalance * (compoundPercentage / 100);
            currentBalance += interest;
            totalInterest += interest;

            let displayedSupplementAmount = month > 1 ? supplementAmount : 0;  // 0 for the first month, actual amount for subsequent months
            currentBalance += displayedSupplementAmount;  // Add supplement amount to the current balance

            let row = table.insertRow(-1);
            row.insertCell(0).innerText = month;
            row.insertCell(1).innerText = startingBalanceForMonth.toFixed(2);
            row.insertCell(2).innerText = compoundPercentage.toFixed(2);
            row.insertCell(3).innerText = interest.toFixed(2);
            row.insertCell(4).innerText = displayedSupplementAmount.toFixed(2);  // Display supplement amount in the new column
            row.insertCell(5).innerText = currentBalance.toFixed(2);

            month++;
        }

        // Add a row for the final ending balance
        let endingBalanceRow = table.insertRow(-1);
        endingBalanceRow.insertCell(0).innerText = 'Final Ending Balance';
        endingBalanceRow.insertCell(1).innerText = '';
        endingBalanceRow.insertCell(2).innerText = '';
        endingBalanceRow.insertCell(3).innerText = '';
        endingBalanceRow.insertCell(4).innerText = '';
        endingBalanceRow.insertCell(5).innerText = currentBalance.toFixed(2);

        let totalRow = table.insertRow(-1);
        totalRow.insertCell(0).innerText = 'Total Interest';
        totalRow.insertCell(1).innerText = '';
        totalRow.insertCell(2).innerText = '';
        totalRow.insertCell(3).innerText = '';
        totalRow.insertCell(4).innerText = '';
        totalRow.insertCell(5).innerText = totalInterest.toFixed(2);

        let totalMonths = month; // Total months calculated from the loop
            let yearsToMillionaire = Math.floor(totalMonths / 12); // Calculate the years
            let remainingMonths = totalMonths % 12; // Calculate the remaining months

            // Check if additional text is already added, if not, add it
            let additionalText = document.getElementById('results-36m').querySelector('.millionaire-text');
            if (!additionalText) {
                additionalText = document.createElement('p');
                additionalText.className = 'millionaire-text';
                document.getElementById('results-36m').appendChild(additionalText);
            }
            document.getElementById('millionaire-text').innerText = `Millionaire by ${yearsToMillionaire} years, ${remainingMonths} months`;

            additionalText.textContent = `Become millionaire before ${yearsToMillionaire} years, ${remainingMonths} months`;

            // Ensure the result section is visible
            document.getElementById('results-36m').classList.remove('hidden');
        }


    // Handle the supplement question responses
    document.getElementById('supplement-yes').onclick = () => {
        // Logic to handle the 'Yes' response
        console.log('User chose to add a supplement.');
        // You can add logic here to ask for the supplement amount and recalculate the results
    };

    document.getElementById('supplement-no').onclick = () => {
        // Logic to handle the 'No' response
        console.log('User chose not to add a supplement.');
        // You can add logic here to simply continue showing the current results
    };
});
