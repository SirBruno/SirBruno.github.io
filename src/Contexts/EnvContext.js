import React from 'react';

const EnvContext = React.createContext();

export const EnvProvider = EnvContext.Provider;

export default EnvContext;