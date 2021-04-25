import React, { useState, FC } from 'react';
import { Filter } from '@/components';

const ColProps = {
  xs: 24,
  sm: 24,
  md: 24,
  xl: 11,
  xxl: 8,
};

interface FilterProps {

}

const FilterPage: FC<FilterProps> = (props: any) => {
  const { filterCondition } = props;
  const filterPageProps = {
    ...props,
    ColProps,
    queryCondition: filterCondition,
    formInitialValues: {
      status: '',
    },
  }

  return (
    <>
      <div className="filterWrapper">
        <Filter {...filterPageProps} />
      </div>
    </>
  );
};

export default FilterPage;