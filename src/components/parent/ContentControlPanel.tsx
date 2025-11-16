import { useEffect, useState } from 'react';
import { Save, Shield } from 'lucide-react';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import TopicManager from './TopicManager';
import {
  useGetContentRulesQuery,
  useUpdateContentRulesMutation,
} from '@/store/api/apiSlice';
import { ContentRuleMode } from '@/types';
import { formatRelativeTime } from '@/utils/formatters';
import styles from './ContentControlPanel.module.css';

const ContentControlPanel = () => {
  const [mode, setMode] = useState<ContentRuleMode>('blocklist');
  const [topics, setTopics] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    data: rules,
    isLoading,
    error,
    refetch,
  } = useGetContentRulesQuery();

  const [updateRules, { isLoading: isSaving }] = useUpdateContentRulesMutation();

  useEffect(() => {
    if (rules) {
      setMode(rules.mode);
      setTopics(rules.topics);
      setKeywords(rules.keywords);
      setHasChanges(false);
    }
  }, [rules]);

  const handleModeChange = (newMode: ContentRuleMode) => {
    setMode(newMode);
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handleAddTopic = (topic: string) => {
    setTopics((prev) => [...prev, topic]);
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handleRemoveTopic = (topic: string) => {
    setTopics((prev) => prev.filter((t) => t !== topic));
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handleAddKeyword = (keyword: string) => {
    setKeywords((prev) => [...prev, keyword]);
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords((prev) => prev.filter((k) => k !== keyword));
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    try {
      await updateRules({ mode, topics, keywords }).unwrap();
      setHasChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save rules:', err);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading content rules..." className={styles.loadingContainer} />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load content rules. Please try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Content Control</h2>
          {rules?.updatedAt && (
            <p className={styles.lastUpdated}>
              Last updated {formatRelativeTime(rules.updatedAt)}
            </p>
          )}
        </div>
        <Button
          onClick={handleSave}
          isLoading={isSaving}
          disabled={!hasChanges || isSaving}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save Changes
        </Button>
      </div>

      {saveSuccess && (
        <div className={styles.successMessage}>
          Content rules saved successfully!
        </div>
      )}

      <Card padding="lg">
        <div className={styles.cardContent}>
          <div>
            <label className={styles.sectionLabel}>
              Filter Mode
            </label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="mode"
                  value="allowlist"
                  checked={mode === 'allowlist'}
                  onChange={() => handleModeChange('allowlist')}
                  className={styles.radioInput}
                />
                <span className={styles.radioText}>Allowlist</span>
                <span className={styles.radioSubtext}>
                  (Only allow specified topics)
                </span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="mode"
                  value="blocklist"
                  checked={mode === 'blocklist'}
                  onChange={() => handleModeChange('blocklist')}
                  className={styles.radioInput}
                />
                <span className={styles.radioText}>Blocklist</span>
                <span className={styles.radioSubtext}>
                  (Block specified topics)
                </span>
              </label>
            </div>
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoContent}>
              <Shield className={styles.infoIcon} />
              <div>
                <p className={styles.infoTitle}>
                  {mode === 'allowlist' ? 'Allowlist Mode' : 'Blocklist Mode'}
                </p>
                <p className={styles.infoDescription}>
                  {mode === 'allowlist'
                    ? 'Only topics and keywords in the lists below will be allowed. Everything else will be blocked.'
                    : 'Topics and keywords in the lists below will be blocked. Everything else will be allowed.'}
                </p>
              </div>
            </div>
          </div>

          <TopicManager
            label="Topics"
            items={topics}
            onAdd={handleAddTopic}
            onRemove={handleRemoveTopic}
            placeholder="Add a topic (e.g., Science, Math, History)"
          />

          <TopicManager
            label="Keywords"
            items={keywords}
            onAdd={handleAddKeyword}
            onRemove={handleRemoveKeyword}
            placeholder="Add a keyword to filter"
          />
        </div>
      </Card>
    </div>
  );
};

export default ContentControlPanel;
