"use client"

import {ListData, useListData} from 'react-stately';
import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';

import {SortBy, SortDirection} from '@/hooks';
import {TagListItem} from '@/types';

type QueryState = {
  page: number;
  perPage: number;
  sortBy: SortBy;
  sortDirection: SortDirection;
  filter: string;
  anyTags: string[];
  allTags: string[];
};

type UpdateQuery = <T extends keyof QueryState>(key: T, value: QueryState[T]) => void;
const QueryStateContext = createContext<QueryState | undefined>(undefined);
const SetQueryContext = createContext<UpdateQuery | undefined>(undefined);

export function QueryProvider({ children }: { children: React.ReactNode }) {
   function useListDataFromArray(initialItems: string[]): ListData<TagListItem> {
    return useListData({
      initialItems: initialItems.map(value => ({id: value, name: value} as TagListItem)),
      getKey: (item: TagListItem) => item.name,
    });
  }
  const router = useRouter();

  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<SortBy>('created');
  const [sortDirection, setSortDirection] = useState<SortDirection>('DESC');
  const [filter, setFilter] = useState<string>('');
  const [anyTags, setAnyTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])

  const query: QueryState = {
    page,
    perPage,
    sortBy,
    sortDirection,
    filter,
    anyTags,
    allTags,
  };

  // 🛠 Updates only the field that changed, preventing unnecessary re-renders
  const updateQuery = useCallback<UpdateQuery>((key, value) => {
    const params = new URLSearchParams(window.location.search);

    if( key === "allTags" || key === "anyTags"){
      params.delete(key);
      (value as string[]).map(t=>params.append(key, t))
    }
    else{
      params.set(key, value.toString());
    }
    
    

    router.push(`/bookmarks?${params.toString()}`);

    // Update only the relevant state
    switch (key) {
      case 'page': setPage(value as number); break;
      case 'perPage': setPerPage(value as number); break;
      case 'sortBy': setSortBy(value as SortBy); break;
      case 'sortDirection': setSortDirection(value as SortDirection); break;
      case 'filter': setFilter(value as string); break;
      case 'anyTags': setAnyTags(value as string[]); break;
      case 'allTags': setAllTags(value as string[]); break;
      
    }
  }, [router]);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setPage(Number(params.get('page')) || 1);
    setPerPage(Number(params.get('perPage')) || 10);
    setSortBy(params.get('sortBy') as SortBy || 'created');
    setSortDirection(params.get('sortDirection') as SortDirection || 'DESC');
    setFilter(params.get('filter') || '');
    setAnyTags(params.getAll("anyTags"));
    setAllTags(params.getAll("allTags"));

    params.getAll('anyTags').map(tag =>{
      if( !anyTags.includes(tag) ) anyTags.push(tag)
    });
    params.getAll('allTags').map(tag =>{
      console.log("ALL TAG USE EFFECT", tag);
      if( !allTags.includes(tag) ) allTags.push(tag)
    }  );

   
  }, []);



  return (
    <QueryStateContext.Provider value={query}>
      <SetQueryContext.Provider value={updateQuery}>
        {children}
      </SetQueryContext.Provider>
    </QueryStateContext.Provider>
  );
}

// Hook to access the full query (triggers re-render on any change)
export function useQueryState() {
  const context = useContext(QueryStateContext);
  if (!context) throw new Error('useQueryState must be used within QueryProvider');
  return context;
}

// Hook to update query fields
export function useUpdateQuery() {
  const context = useContext(SetQueryContext);
  if (!context) throw new Error('useUpdateQuery must be used within QueryProvider');
  return context;
}

// 🛠 NEW: Optimized Per-Field Selector Hook
export function useQuerySelector<T extends keyof QueryState>(key: T): QueryState[T] {
  const query = useQueryState();
  return query[key];
}
