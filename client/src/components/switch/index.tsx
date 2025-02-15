import { FC } from 'react';

import Switch, { ReactSwitchProps } from 'react-switch';

const ReactSwitch: FC<ReactSwitchProps> = ({ ...props }) => {
  return <Switch {...props} />;
};

export default ReactSwitch;
