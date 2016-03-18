import React from 'react';

import favorite from 'react-icons/lib/md/favorite';
import favorite_border from 'react-icons/lib/md/favorite-border';
import _public from 'react-icons/lib/md/public';
import star from 'react-icons/lib/md/star';

const icons = {
  favorite,
  favorite_border,
  public: _public,
  star
};

export default ({
  color,
  outline,
  icon,
  size,
  className,
  ...props
}) => {
  let Icon = icons[icon];
  let classnameIcon = ['icon'];
  let classnameIconPic = ['micon'];

  className && classnameIcon.push(className);
  outline && classnameIcon.push('icon-outline');

  color && classnameIconPic.push(`color-${color}`);

  if (!Icon) {
    return <div>{`Please import '${icon}' from react-icons/lib/md`}</div>;
  }

  if (size) {
    classnameIcon.push(`icon-${size}`);
    classnameIconPic.push(`micon-${size}`);
  }

  return (
    <div {...props} className={classnameIcon.join(' ')}>
      <Icon className={classnameIconPic.join(' ')} />
    </div>
  );
}