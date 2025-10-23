import styled from "styled-components";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  theme?: "light" | "dark";
}

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const PageButton = styled.button<{
  $active?: boolean;
  $themeMode: "light" | "dark";
}>`
  padding: 8px 12px;
  border: 1px solid
    ${({ $themeMode }) => ($themeMode === "light" ? "#ccc" : "#555")};
  background-color: ${({ $active, $themeMode }) =>
    $active
      ? $themeMode === "light"
        ? "#2196f3"
        : "#90caf9"
      : $themeMode === "light"
      ? "#fff"
      : "#333"};
  color: ${({ $active, $themeMode }) =>
    $active ? "#fff" : $themeMode === "light" ? "#000" : "#fff"};
  border-radius: 4px;
  cursor: pointer;
  min-width: 40px;
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${({ $active, $themeMode }) =>
      $active
        ? $themeMode === "light"
          ? "#1976d2"
          : "#64b5f6"
        : $themeMode === "light"
        ? "#f5f5f5"
        : "#444"};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    transform: none;
    box-shadow: none;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const PageInfo = styled.span<{ $themeMode: "light" | "dark" }>`
  color: ${({ $themeMode }) => ($themeMode === "light" ? "#000" : "#fff")};
  font-size: 14px;
  margin-right: 16px;
  font-weight: 500;
`;

const Ellipsis = styled.span<{ $themeMode: "light" | "dark" }>`
  color: ${({ $themeMode }) => ($themeMode === "light" ? "#666" : "#999")};
  padding: 0 4px;
  user-select: none;
`;

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  theme = "light",
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const visiblePages = [];
    const showPages = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }
   
    return visiblePages;
  };

  const visiblePages = getVisiblePages();
 console.log(visiblePages);
  return (
    <PaginationContainer>
      <PageInfo $themeMode={theme}>
        Страница {currentPage} из {totalPages}
      </PageInfo>

      <PageButton
        $themeMode={theme}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Предыдущая страница"
      >
        ←
      </PageButton>

      {visiblePages[0] > 1 && (
        <>
          <PageButton $themeMode={theme} onClick={() => onPageChange(1)}>
            1
          </PageButton>
          {visiblePages[0] > 2 && <Ellipsis $themeMode={theme}>...</Ellipsis>}
        </>
      )}

      {visiblePages.map((page) => (
        <PageButton
          key={page}
          $themeMode={theme}
          $active={page === currentPage}
          onClick={() => onPageChange(page)}
          aria-label={`Страница ${page}`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </PageButton>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <Ellipsis $themeMode={theme}>...</Ellipsis>
          )}
          <PageButton
            $themeMode={theme}
            onClick={() => onPageChange(totalPages)}
            aria-label={`Последняя страница ${totalPages}`}
          >
            {totalPages}
          </PageButton>
        </>
      )}

      <PageButton
        $themeMode={theme}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Следующая страница"
      >
        →
      </PageButton>
    </PaginationContainer>
  );
};
