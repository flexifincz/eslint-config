export type RuleSeverity = 'off' | 'warn' | 'error';
export type RuleOptions = string | Record<string, any>;
export type RuleConfig = RuleSeverity | [RuleSeverity, RuleOptions];
export type Rules = {
  [ruleName: string]: RuleConfig;
};
