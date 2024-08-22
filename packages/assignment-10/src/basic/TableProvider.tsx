import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import { useScheduleContext } from "./ScheduleContext.tsx";
import { Schedule } from "./types.ts";

interface ContextType {
  schedules: Schedule[];
  update: (tableId: string, newData: Schedule[] | null) => void;
}

interface ContextProviderType {
  tableId: string;
  children: ReactNode;
}

const TableContext = createContext<ContextType | undefined>(undefined);

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context;
};

const TableProvider = ({ children, tableId }: ContextProviderType) => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();

  const update = useCallback((tableId: string, newData: Schedule[] | null) => {
    if(newData) { // 변경하려는 데이터가 있으면 update
      setSchedulesMap((prev) => { return {...prev, [tableId]: [...newData]} })
    } else { // 변경하려는 데이터가 없으면 delete
      setSchedulesMap((prev) => {
        delete prev[tableId];
        return {...prev};
      })
    }
  }, [setSchedulesMap])
  
  // 각 tableId에 해당하는 schedules가 바뀌지 않으면 리렌더링 X
  return useMemo(() => (
    <TableContext.Provider value={{schedules: schedulesMap[tableId], update}}>
      {children}
    </TableContext.Provider>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [children, schedulesMap[tableId]]) 
}
export default TableProvider;
