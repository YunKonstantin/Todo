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

  &:hover:not(:disabled) {
    background-color: ${({ $active, $themeMode }) =>
      $active
        ? $themeMode === "light"
          ? "#1976d2"
          : "#64b5f6"
        : $themeMode === "light"
        ? "#f5f5f5"
        : "#444"};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const PageInfo = styled.span<{ $themeMode: "light" | "dark" }>`
  color: ${({ $themeMode }) => ($themeMode === "light" ? "#000" : "#fff")};
  font-size: 14px;
`;

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  theme = "light",
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const showPages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
  let endPage = Math.min(totalPages, startPage + showPages - 1);

  if (endPage - startPage + 1 < showPages) {
    startPage = Math.max(1, endPage - showPages + 1);
  }

  // Кнопка "Назад"
  pages.push(
    <PageButton
      key="prev"
      $themeMode={theme}
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      ←
    </PageButton>
  );

  // Первая страница
  if (startPage > 1) {
    pages.push(
      <PageButton key={1} $themeMode={theme} onClick={() => onPageChange(1)}>
        1
      </PageButton>
    );
    if (startPage > 2) {
      pages.push(<span key="start-ellipsis">...</span>);
    }
  }

  // Основные страницы
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <PageButton
        key={i}
        $themeMode={theme}
        $active={i === currentPage}
        onClick={() => onPageChange(i)}
      >
        {i}
      </PageButton>
    );
  }

  // Последняя страница
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push(<span key="end-ellipsis">...</span>);
    }
    pages.push(
      <PageButton
        key={totalPages}
        $themeMode={theme}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </PageButton>
    );
  }

  // Кнопка "Вперед"
  pages.push(
    <PageButton
      key="next"
      $themeMode={theme}
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      →
    </PageButton>
  );

  return (
    <PaginationContainer>
      <PageInfo $themeMode={theme}>
        Страница {currentPage} из {totalPages}
      </PageInfo>
      {pages}
    </PaginationContainer>
  );
};

export default Pagination;