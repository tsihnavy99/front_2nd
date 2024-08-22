import { Flex, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleIdContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { useMemo, useState } from "react";
import ScheduleTableHeader from "./ScheduleTableHeader.tsx";
import TableProvider from "./TableProvider.tsx";

export const ScheduleTables = () => {
  const { tableIds } = useScheduleIdContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  return useMemo(() => (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableIds.map((tableId, index) => (
          <TableProvider tableId={tableId}>
            <Stack key={tableId} width="600px">
              <ScheduleTableHeader tableId={tableId} index={index} setSearchInfo={setSearchInfo} />
            
              <ScheduleTable
                key={`schedule-table-${index}`}
                tableId={tableId}
                setSearchInfo={setSearchInfo}
              />
            </Stack>
          </TableProvider>
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)}/>
    </>
  ), [searchInfo, tableIds]);
}
