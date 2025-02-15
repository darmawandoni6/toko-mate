import { forwardRef } from 'react';

import Select, { Props, SelectInstance } from 'react-select';

import { Option } from '../../global-types';

const SelectOption = forwardRef<SelectInstance<Option>, Props<Option>>(({ onChange, value, options }, ref) => {
  return (
    <Select
      ref={ref}
      value={value}
      onChange={onChange}
      className="flex-auto text-sm h-8"
      isClearable
      styles={{
        option(base) {
          base.textTransform = 'capitalize';
          return base;
        },
        control: baseStyles => {
          baseStyles.boxShadow = 'none';
          baseStyles.borderColor = 'inherit';
          baseStyles['&:hover'] = {
            borderColor: 'inherit',
          };
          baseStyles.textTransform = 'capitalize';
          baseStyles.fontWeight = 500;
          return baseStyles;
        },
        singleValue(base) {
          base.color = 'inherit';
          return base;
        },

        clearIndicator(base) {
          base.padding = 4;
          return base;
        },
        dropdownIndicator(base) {
          base.padding = 4;
          return base;
        },
      }}
      theme={theme => {
        return {
          ...theme,
          colors: {
            ...theme.colors,
            primary: 'var(--primary)',
            primary25: 'var(--primary-100)',
          },
          spacing: {
            ...theme.spacing,
            controlHeight: 32,
          },
        };
      }}
      components={{
        IndicatorSeparator: () => null,
      }}
      options={options}
    />
  );
});
export default SelectOption;
