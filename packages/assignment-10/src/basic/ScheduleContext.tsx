import React, { createContext, memo, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { Schedule } from './types.ts';
import dummyScheduleMap from './dummyScheduleMap.ts';

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
  setSchedulesMap: React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>>;
}
interface ScheduleIdType {
  tableIds: string[];
  setTableIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);
const ScheduleIdContext = createContext<ScheduleIdType | undefined>(undefined);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider = memo(function ScheduleProvider({ children }: PropsWithChildren) {
  const [schedulesMap, setSchedulesMap] = useState<Record<string, Schedule[]>>(dummyScheduleMap);

  const value = useMemo(
    () => ({ schedulesMap, setSchedulesMap }),
    [setSchedulesMap, schedulesMap]
  );

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  )
});

export const useScheduleIdContext = () => {
  const context = useContext(ScheduleIdContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleIdProvider');
  }
  return context;
};

// ScheduleTables에서 변경되기 쉬운 schedulesMap 대신 schedules의 key값을 이용해 map해서 리렌더링 줄여보기
export const ScheduleIdProvider = memo(function ScheduleIdProvider({children}: PropsWithChildren) {
  const [tableIds, setTableIds] = useState<string[]>(Object.keys(dummyScheduleMap));

  const value = useMemo(
    () => ({ tableIds, setTableIds }),
    [tableIds, setTableIds]
  );

  return (
    <ScheduleIdContext.Provider value={value}>
      {children}
    </ScheduleIdContext.Provider>
  )
})
