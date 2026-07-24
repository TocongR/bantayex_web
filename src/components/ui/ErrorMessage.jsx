import styles from './ErrorMessage.module.css';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return <div className={styles.box}>{message}</div>;
};

export default ErrorMessage;