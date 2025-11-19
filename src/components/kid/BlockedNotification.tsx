import { AlertTriangle } from 'lucide-react';
import styles from './BlockedNotification.module.css';

interface BlockedNotificationProps {
  allowedTopics?: string[];
}

const BlockedNotification = ({ allowedTopics = [] }: BlockedNotificationProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.avatar}>
          <AlertTriangle className={styles.icon} />
        </div>
        <div className={styles.messageBody}>
          <div className={styles.warningBox}>
            <h3 className={styles.title}>Content Blocked</h3>
            <p className={styles.description}>
              This topic has been restricted. Try asking about something else.
            </p>

            {allowedTopics.length > 0 && (
              <div className={styles.suggestions}>
                <p className={styles.suggestionsTitle}>Suggested topics:</p>
                <div className={styles.tags}>
                  {allowedTopics.map((topic) => (
                    <span
                      key={topic}
                      className={styles.tag}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockedNotification;
