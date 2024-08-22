import { Flex, Heading, ButtonGroup, Button } from "@chakra-ui/react"
import { useCallback } from "react"
import { useScheduleIdContext } from "./ScheduleContext";
import { useTableContext } from "./TableProvider";

interface Props {
  tableId: string;
  index: number;
  setSearchInfo: React.Dispatch<React.SetStateAction<{
      tableId: string;
      day?: string;
      time?: number;
  } | null>>
}

const ScheduleTableHeader = ({tableId, index, setSearchInfo}: Props) => {
  const { schedules, update } = useTableContext();
  const { tableIds, setTableIds } = useScheduleIdContext();

  const disabledRemoveButton = tableIds.length === 1
  
  const duplicate = useCallback(() => {
    const newId = `schedule-${Date.now()}`
    update(newId, schedules);
    setTableIds((prev) => [...prev, newId])
  }, [schedules, setTableIds, update])

  const remove = useCallback((targetId: string) => {
    update(targetId, null);
    setTableIds((prev) => prev.filter(id => id!==targetId))
  }, [setTableIds, update])

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Heading as="h3" fontSize="lg">시간표 {index + 1}</Heading>
      <ButtonGroup size="sm" isAttached>
        <Button colorScheme="green" onClick={() => setSearchInfo({ tableId })}>시간표 추가</Button>
        <Button colorScheme="green" mx="1px" onClick={duplicate}>복제</Button>
        <Button colorScheme="green" isDisabled={disabledRemoveButton}
                onClick={() => remove(tableId)}>삭제</Button>
      </ButtonGroup>
    </Flex>
  )
}

export default ScheduleTableHeader;