interface UseLoadingStatesProps {
  loading: boolean;
  localLoading?: boolean;
}

export const useLoadingStates = ({
  loading,
  localLoading = false,
}: UseLoadingStatesProps) => {
  const isLoading = loading || localLoading;
  const isFilterSortDisabled = loading;

  return { isLoading, isFilterSortDisabled };
};
