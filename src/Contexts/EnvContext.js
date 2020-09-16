import React from 'react';

const name = 'LULZ CONTEXT TEST HEHEHEHEHE';

const EnvContext = React.createContext(name);

export const EnvProvider = EnvContext.Provider;

export default EnvContext;