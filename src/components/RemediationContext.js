import {createContext} from 'react';

export const RemediationContext = createContext({
  remediation: null,
  setRemediation: (value) => value,
  setDefaultRemediation: () => null,
})
