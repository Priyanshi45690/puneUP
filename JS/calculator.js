/**
 * PuneUP Real Estate Portal - Loan & EMI Calculator Module
 * Financial computation for Mortgage EMIs, Interest Breakdown, and Loan Eligibility
 */

function calculateEMI() {
    const sliderAmount = document.getElementById('sliderAmount');
    const sliderRate = document.getElementById('sliderRate');
    const sliderTenure = document.getElementById('sliderTenure');

    if (!sliderAmount || !sliderRate || !sliderTenure) return;

    const P = parseFloat(sliderAmount.value);
    const rAnnual = parseFloat(sliderRate.value);
    const tenureYears = parseFloat(sliderTenure.value);

    // Update Text Labels
    const displayLoanAmount = document.getElementById('displayLoanAmount');
    if (displayLoanAmount) {
        displayLoanAmount.innerText = '₹' + P.toLocaleString('en-IN');
    }

    const displayRate = document.getElementById('displayRate');
    if (displayRate) {
        displayRate.innerText = rAnnual.toFixed(2) + ' %';
    }

    const displayTenure = document.getElementById('displayTenure');
    if (displayTenure) {
        displayTenure.innerText = `${tenureYears} Years (${tenureYears * 12} Mos)`;
    }

    // Monthly interest and count of installments
    const r = (rAnnual / 12) / 100;
    const n = tenureYears * 12;

    // Standard EMI formula: [P * r * (1 + r)^n] / [(1 + r)^n - 1]
    const emi = Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;

    const displayEMI = document.getElementById('displayEMI');
    if (displayEMI) {
        displayEMI.innerText = '₹' + emi.toLocaleString('en-IN');
    }

    const summaryPrincipal = document.getElementById('summaryPrincipal');
    if (summaryPrincipal) {
        summaryPrincipal.innerText = '₹' + P.toLocaleString('en-IN');
    }

    const summaryInterest = document.getElementById('summaryInterest');
    if (summaryInterest) {
        summaryInterest.innerText = '₹' + totalInterest.toLocaleString('en-IN');
    }

    const summaryTotal = document.getElementById('summaryTotal');
    if (summaryTotal) {
        summaryTotal.innerText = '₹' + totalAmount.toLocaleString('en-IN');
    }

    // Visual breakdown percentage bars (if present on full calculator page)
    const principalPct = Math.round((P / totalAmount) * 100);
    const interestPct = 100 - principalPct;

    const labelPrincipalPct = document.getElementById('labelPrincipalPct');
    if (labelPrincipalPct) labelPrincipalPct.innerText = `${principalPct}%`;

    const labelInterestPct = document.getElementById('labelInterestPct');
    if (labelInterestPct) labelInterestPct.innerText = `${interestPct}%`;

    const barPrincipal = document.getElementById('barPrincipal');
    if (barPrincipal) barPrincipal.style.width = `${principalPct}%`;

    const barInterest = document.getElementById('barInterest');
    if (barInterest) barInterest.style.width = `${interestPct}%`;
}

// Eligibility Form Handler
function setupEligibilityForm() {
    const form = document.getElementById('eligibilityForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const income = parseFloat(document.getElementById('monthlyIncome').value) || 0;
        const obligations = parseFloat(document.getElementById('monthlyObligations').value) || 0;

        // FOIR: Banks typically cap total debt at 50% of monthly income
        const maxAffordableEmi = Math.max(0, (income * 0.50) - obligations);

        // Approximate loan eligibility based on 8.5% interest over 20 years (~₹868 EMI per Lakh loan)
        const emiPerLakh = 868;
        const eligibleLakhs = Math.round(maxAffordableEmi / emiPerLakh);
        const eligibleAmount = eligibleLakhs * 100000;

        const resultContainer = document.getElementById('eligibilityResult');
        const displayAmount = document.getElementById('eligibleAmountDisplay');
        const displayEmi = document.getElementById('eligibleEmiDisplay');

        if (displayAmount) {
            displayAmount.innerText = '₹' + eligibleAmount.toLocaleString('en-IN');
        }
        if (displayEmi) {
            displayEmi.innerText = '₹' + Math.round(maxAffordableEmi).toLocaleString('en-IN') + ' /mo';
        }
        if (resultContainer) {
            resultContainer.classList.remove('hidden');
        }

        if (typeof showToast === 'function') {
            showToast('Home loan eligibility calculated successfully!', 'success');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const sliderAmount = document.getElementById('sliderAmount');
    const sliderRate = document.getElementById('sliderRate');
    const sliderTenure = document.getElementById('sliderTenure');

    if (sliderAmount && sliderRate && sliderTenure) {
        sliderAmount.addEventListener('input', calculateEMI);
        sliderRate.addEventListener('input', calculateEMI);
        sliderTenure.addEventListener('input', calculateEMI);
        calculateEMI();
    }

    setupEligibilityForm();
});
