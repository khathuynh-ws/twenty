import { useCallback } from 'react';

import { ActionHookWithObjectMetadataItem } from '@/action-menu/actions/types/ActionHook';
import { contextStoreCurrentViewIdComponentState } from '@/context-store/states/contextStoreCurrentViewIdComponentState';
import { useCheckIsSoftDeleteFilter } from '@/object-record/record-filter/hooks/useCheckIsSoftDeleteFilter';
import { useRemoveRecordFilter } from '@/object-record/record-filter/hooks/useRemoveRecordFilter';
import { currentRecordFiltersComponentState } from '@/object-record/record-filter/states/currentRecordFiltersComponentState';
import { useHandleToggleTrashColumnFilter } from '@/object-record/record-index/hooks/useHandleToggleTrashColumnFilter';
import { getRecordIndexIdFromObjectNamePluralAndViewId } from '@/object-record/utils/getRecordIndexIdFromObjectNamePluralAndViewId';
import { useRecoilComponentValueV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValueV2';
import { isDefined } from 'twenty-shared/utils';

export const useHideDeletedRecordsNoSelectionRecordAction: ActionHookWithObjectMetadataItem =
  ({ objectMetadataItem }) => {
    const currentViewId = useRecoilComponentValueV2(
      contextStoreCurrentViewIdComponentState,
    );

    if (!currentViewId) {
      throw new Error('Current view ID is not defined');
    }

    const recordIndexId = getRecordIndexIdFromObjectNamePluralAndViewId(
      objectMetadataItem.namePlural,
      currentViewId,
    );

    const { toggleSoftDeleteFilterState } = useHandleToggleTrashColumnFilter({
      objectNameSingular: objectMetadataItem.nameSingular,
      viewBarId: recordIndexId,
    });

    const { checkIsSoftDeleteFilter } = useCheckIsSoftDeleteFilter();

    const currentRecordFilters = useRecoilComponentValueV2(
      currentRecordFiltersComponentState,
      recordIndexId,
    );

    const deletedFilter = currentRecordFilters.find(checkIsSoftDeleteFilter);

    const { removeRecordFilter } = useRemoveRecordFilter();

    const onClick = useCallback(() => {
      if (!isDefined(deletedFilter)) {
        return;
      }

      removeRecordFilter({ recordFilterId: deletedFilter.id });

      toggleSoftDeleteFilterState(false);
    }, [deletedFilter, removeRecordFilter, toggleSoftDeleteFilterState]);

    return {
      shouldBeRegistered: isDefined(deletedFilter),
      onClick,
    };
  };
