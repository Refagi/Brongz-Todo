import { Snackbar, Alert, type SnackbarOrigin } from '@mui/material';

interface NotificationProps extends SnackbarOrigin {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  autoHideDuration?: number;
}

const Notification = ({
  open,
  message,
  severity,
  onClose,
  vertical = 'bottom',
  horizontal = 'center',
  autoHideDuration = 6000,
}: NotificationProps) => {

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      key={vertical + horizontal}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: '100%',
          bgcolor: 'var(--primary-color)',
          color: severity === 'success' ? '#e8e9ed' : severity === 'error' ? '#e8e9ed' : undefined,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;