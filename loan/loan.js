/* =============================================
   LOAN PAGE JavaScript (loan.html)
   ============================================= */

// Handle Apply, Update, Cancel loan actions
function handleLoanAction(action) {
    var ssnId = document.getElementById('loanSsn').value.trim();

    if (!ssnId) {
        showToast('Please enter at least the Customer SSN ID.', true);
        return;
    }

    if (action === 'apply') {
        showToast('Loan request submitted successfully.', false);
    } else if (action === 'update') {
        showToast('Loan updated successfully.', false);
    } else if (action === 'cancel') {
        showToast('Loan cancelled successfully.', false);
    }
}
