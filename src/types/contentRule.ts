export type ContentRuleMode = 'allowlist' | 'blocklist';

export interface ContentRules {
  id: string;
  parentId: string;
  mode: ContentRuleMode;
  topics: string[];
  keywords: string[];
  updatedAt: string;
}

export interface UpdateContentRulesData {
  mode: ContentRuleMode;
  topics: string[];
  keywords: string[];
}
