import type { Rules, RuleOptions } from './types';

export const overrideRuleOptions = (
  rules: Rules,
  targetRuleName: string,
  transformOptions: (options: any) => RuleOptions
) => {
  const ruleDeclaration = rules[targetRuleName];

  if (!ruleDeclaration) {
    console.warn(`Rule '${targetRuleName}' was not found.`);
    return;
  }

  const isRuleOptionsArray = Array.isArray(ruleDeclaration);

  const [ruleSeverity, ruleOptions] = isRuleOptionsArray ? ruleDeclaration : [ruleDeclaration];

  if (!isRuleOptionsArray) {
    return { [targetRuleName]: ruleSeverity };
  }

  return {
    [targetRuleName]: [
      ruleSeverity,
      typeof ruleOptions === 'string'
        ? transformOptions(ruleOptions)
        : { ...ruleOptions, ...(transformOptions(ruleOptions) as Record<string, any>) },
    ],
  };
};
