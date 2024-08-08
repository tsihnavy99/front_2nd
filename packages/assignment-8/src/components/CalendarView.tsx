import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { VStack, Heading, HStack, IconButton, Select } from "@chakra-ui/react";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Event } from "../types";
import { fetchHolidays } from "../mockApiHandlers";

interface Props {
  events: Event[];
  searchTerm: string;
  view: "week" | "month";
  currentDate: Date;
  setCurrentDate: Dispatch<SetStateAction<Date>>;
  notifiedEvents: number[];
  setView: Dispatch<SetStateAction<"week" | "month">>;
}

const CalendarView = ({
  events,
  searchTerm,
  view,
  currentDate,
  setCurrentDate,
  notifiedEvents,
  setView,
}: Props) => {
  const [holidays, setHolidays] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const newHolidays = fetchHolidays(year, month);
    setHolidays(newHolidays);
  }, [currentDate]);

  const navigate = (direction: "prev" | "next") => {
    const test = new Date(currentDate)
    console.log('test111', test)
    if(view === 'week') {
      console.log('test week', test.getDate() + (direction === "next" ? 7 : -7))
    } else {
      console.log('test month', test.getMonth() + (direction === "next" ? 1 : -1))
      console.log('test333', test, test.getMonth(), test.getDate())
      test.setMonth(test.getMonth() + (direction === 'next' ? 1 : -1))
      console.log('test333', test, test.getMonth(), test.getDate())
    }
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (view === "week") {
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
      } else if (view === "month") {
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
      }
      return newDate;
    });
  };

  return (
    <VStack flex={1} spacing={5} align='stretch'>
      <Heading>일정 보기</Heading>

      <HStack mx='auto' justifyContent='space-between'>
        <IconButton
          aria-label='Previous'
          icon={<ChevronLeftIcon />}
          onClick={() => navigate("prev")}
        />
        <Select
          aria-label='view'
          value={view}
          onChange={(e) => setView(e.target.value as "week" | "month")}
        >
          <option value='week'>Week</option>
          <option value='month'>Month</option>
        </Select>
        <IconButton
          aria-label='Next'
          icon={<ChevronRightIcon />}
          onClick={() => navigate("next")}
        />
      </HStack>

      {view === "week" && (
        <WeekView
          events={events}
          searchTerm={searchTerm}
          view={view}
          currentDate={currentDate}
          notifiedEvents={notifiedEvents}
        />
      )}
      {view === "month" && (
        <MonthView
          holidays={holidays}
          events={events}
          searchTerm={searchTerm}
          view={view}
          currentDate={currentDate}
          notifiedEvents={notifiedEvents}
        />
      )}
    </VStack>
  );
};

export default CalendarView;
