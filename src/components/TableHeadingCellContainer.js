import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import getContext from 'recompose/getContext';

import { sortPropertyByIdSelector, iconsForComponentSelector, classNamesForComponentSelector, stylesForComponentSelector, customHeadingComponentSelector, cellPropertiesSelector } from '../selectors/dataSelectors';
import { valueOrResult } from '../utils/valueUtils';

const DefaultTableHeadingCellContent = ({title, icon}) => (
  <span>
    { title }
    { icon && <span>{icon}</span> }
  </span>
)

function getIcon({sortProperty, sortAscendingIcon, sortDescendingIcon}) {
  if (sortProperty) {
    return sortProperty.sortAscending ? sortAscendingIcon : sortDescendingIcon;
  }

  // return null so we don't render anything if no sortProperty
  return null;
}

const EnhancedHeadingCell = OriginalComponent => compose(
  getContext({
    selectors: PropTypes.object,
  }),
  connect(
    (state, props) => ({
      sortProperty: sortPropertyByIdSelector(state, props),
      customHeadingComponent: customHeadingComponentSelector(state, props),
      cellProperties: cellPropertiesSelector(state, props),
      className: classNamesForComponentSelector(state, 'TableHeadingCell'),
      style: stylesForComponentSelector(state, 'TableHeadingCell'),
      ...iconsForComponentSelector(state, 'TableHeadingCell'),
    })
  ),
  mapProps(props => {
    const icon = getIcon(props);
    const title = props.customHeadingComponent ?
      <props.customHeadingComponent {...props} icon={icon} /> :
      <DefaultTableHeadingCellContent title={props.title} icon={icon} />;
    const className = valueOrResult(props.cellProperties.headerCssClassName, props) || props.className;

    return {
      ...props,
      icon,
      title,
      className
    };
  })
)((props) => {
  return (
    <OriginalComponent {...props} />
  );
});

export default EnhancedHeadingCell;
