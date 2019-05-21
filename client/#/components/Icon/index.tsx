import cx from 'classnames';
import * as React from 'react';

type IProps = JSX.IntrinsicElements['div'];

interface Props extends IProps {}

const Icon: React.SFC<Props> = props => {
  const { className, ...rest } = props;

  return <i className={cx(className, 'material-icons')} {...rest} />;
};

export default Icon;
