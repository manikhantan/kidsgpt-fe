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
    return <LoadingSpinner size="lg" text="Loading content rules..." className="py-12" />;
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Control</h2>
          {rules?.updatedAt && (
            <p className="text-sm text-gray-500 mt-1">
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
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          Content rules saved successfully!
        </div>
      )}

      <Card padding="lg">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Filter Mode
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="allowlist"
                  checked={mode === 'allowlist'}
                  onChange={() => handleModeChange('allowlist')}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-900">Allowlist</span>
                <span className="text-sm text-gray-500">
                  (Only allow specified topics)
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="blocklist"
                  checked={mode === 'blocklist'}
                  onChange={() => handleModeChange('blocklist')}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-900">Blocklist</span>
                <span className="text-sm text-gray-500">
                  (Block specified topics)
                </span>
              </label>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-800 font-medium">
                  {mode === 'allowlist' ? 'Allowlist Mode' : 'Blocklist Mode'}
                </p>
                <p className="text-blue-700 text-sm mt-1">
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
