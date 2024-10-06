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
    confirmButtonText: confirmButtonText
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
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      Swal.fire(
        'Deleted!',
        `${itemName} has been deleted.`,
        'success'
      );
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
    confirmButtonText: 'Yes, logout'
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
};