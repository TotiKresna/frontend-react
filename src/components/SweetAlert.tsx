import Swal from 'sweetalert2';

interface WarningAlertProps {
  title?: string;
  text: string;
  confirmButtonText?: string;
}

interface DeleteConfirmationAlertProps {
  onConfirm: () => void;
  itemName: string;
}

interface LogoutConfirmationAlertProps {
  onConfirm: () => void;
}

// Custom SweetAlert configuration
const customSwalConfig = {
  customClass: {
    container: 'my-swal-container',  // Add custom class for z-index control
  }
};

// Add global styles for SweetAlert
const style = document.createElement('style');
style.innerHTML = `
  .my-swal-container {
    z-index: 9999 !important;
  }
`;
document.head.appendChild(style);

export const WarningAlert = ({ 
  title = 'Warning', 
  text, 
  confirmButtonText = 'OK' 
}: WarningAlertProps) => {
  Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    confirmButtonColor: '#3085d6',
    confirmButtonText: confirmButtonText,
    ...customSwalConfig
  });
};

export const DeleteConfirmationAlert = ({ onConfirm, itemName }: DeleteConfirmationAlertProps) => {
  Swal.fire({
    title: 'Are you sure?',
    text: `You are about to delete ${itemName}. This action cannot be undone!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'green',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    ...customSwalConfig
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      Swal.fire({
        title: 'Deleted!',
        text: `${itemName} has been deleted.`,
        icon: 'success',
        ...customSwalConfig
      });
    }
  });
};

export const LogoutConfirmationAlert = ({ onConfirm }: LogoutConfirmationAlertProps) => {
  Swal.fire({
    title: 'Logout Confirmation',
    text: 'Are you sure you want to logout?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, logout',
    ...customSwalConfig
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
};