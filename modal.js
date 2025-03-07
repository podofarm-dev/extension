export function showConfirmModal(message, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    const modalMessage = document.getElementById('modal-message');
    const yesButton = document.getElementById('confirm-yes');
    const noButton = document.getElementById('confirm-no');
  
    modalMessage.innerText = message;
    modal.style.display = 'block';
  
    yesButton.onclick = async () => {
      modal.style.display = 'none';
      await onConfirm();
    };
  
    noButton.onclick = () => {
      modal.style.display = 'none';
      stopLoader();
    };
  }
  
  export function closeModal() {
    document.getElementById('confirm-modal').style.display = 'none';
  }
  