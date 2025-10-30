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

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        start = 1;
        end = 5;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 4;
        end = totalPages;
      }

      for (let i = start; i <= end; i++) {
        visiblePages.push(i);
      }
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  const showLeftEllipsis = visiblePages[0] > 2;
  const showRightEllipsis =
    visiblePages[visiblePages.length - 1] < totalPages - 1;

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

      <PageButton
        $themeMode={theme}
        onClick={() => onPageChange(1)}
        $active={currentPage === 1}
      >
        1
      </PageButton>

      {showLeftEllipsis && <Ellipsis $themeMode={theme}>...</Ellipsis>}

      {visiblePages.map((page) => {
        if (page === 1 || page === totalPages) return null;
        return (
          <PageButton
            key={page}
            $themeMode={theme}
            $active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </PageButton>
        );
      })}

      {showRightEllipsis && <Ellipsis $themeMode={theme}>...</Ellipsis>}

      {totalPages > 1 && (
        <PageButton
          $themeMode={theme}
          onClick={() => onPageChange(totalPages)}
          $active={currentPage === totalPages}
        >
          {totalPages}
        </PageButton>
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
