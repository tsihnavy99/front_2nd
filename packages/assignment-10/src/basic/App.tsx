import { ChakraProvider } from '@chakra-ui/react';
import { ScheduleIdProvider, ScheduleProvider } from './ScheduleContext.tsx';
import { ScheduleTables } from "./ScheduleTables.tsx";

function App() {

  return (
    <ChakraProvider>
      <ScheduleProvider>
        <ScheduleIdProvider>
          <ScheduleTables/>
        </ScheduleIdProvider>
      </ScheduleProvider>
    </ChakraProvider>
  );
}

export default App;
