import React from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setFilter, setSortOrder, setItemsPerPage } from "../store/slices/todoSlices";
import type { FilterStatus, SortOrder } from "../types/types";

const Container = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const Select = styled.select<{ $themeMode: "light" | "dark" }>`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid ${({ $themeMode }) => ($themeMode === "light" ? "#ccc" : "#555")};
  background-color: ${({ $themeMode }) => ($themeMode === "light" ? "#fff" : "#333")};
  color: ${({ $themeMode }) => ($themeMode === "light" ? "#000" : "#fff")};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

const Label = styled.label<{ $themeMode: "light" | "dark" }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: ${({ $themeMode }) => ($themeMode === "light" ? "#000" : "#fff")};
  font-size: 14px;
`;

const Filters: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filters, pagination } = useAppSelector((state) => state.todos);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilter(event.target.value as FilterStatus));
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortOrder(event.target.value as SortOrder));
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setItemsPerPage(Number(event.target.value)));
  };

  return (
    <Container>
      <Label $themeMode="light">
        Filter:
        <Select 
          $themeMode="light" 
          value={filters.status} 
          onChange={handleFilterChange}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </Select>
      </Label>

      <Label $themeMode="light">
        Sort:
        <Select 
          $themeMode="light" 
          value={filters.sortOrder} 
          onChange={handleSortChange}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </Select>
      </Label>

      <Label $themeMode="light">
        Items per page:
        <Select 
          $themeMode="light" 
          value={pagination.itemsPerPage} 
          onChange={handleItemsPerPageChange}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </Select>
      </Label>
    </Container>
  );
};

export default Filters;