import { Event } from "./types";

export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getWeekDates = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(monday);
    nextDate.setDate(monday.getDate() + i);
    weekDates.push(nextDate);
  }
  return weekDates;
};

export const formatWeek = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const weekNumber = Math.ceil(date.getDate() / 7);
  return `${year}년 ${month}월 ${weekNumber}주`;
};

export const formatMonth = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
};

export const isDateInRange = (dateToCheck: Date, startDate: Date, endDate: Date): boolean => {
  // 모든 날짜를 Date 객체로 변환
  const check = new Date(dateToCheck);
  const start = new Date(startDate);
  const end = new Date(endDate);

  // 범위 내에 있는지 확인
  return check >= start && check <= end;
}

export const searchEvents = (events: Event[], term: string) => {
  if (!term.trim()) return events;

  return events.filter(event =>
    event.title.toLowerCase().includes(term.toLowerCase()) ||
    event.description.toLowerCase().includes(term.toLowerCase()) ||
    event.location.toLowerCase().includes(term.toLowerCase())
  );
};

export const filteredEvents = (() => {
  return (events: Event[], searchTerm: string, view: 'week' | 'month', currentDate: Date) => {
    const filtered = searchEvents(events, searchTerm);

    return filtered.filter(event => {
      const eventDate = new Date(event.date);

      if (view === 'week') {
        const weekDates = getWeekDates(currentDate);
        return eventDate >= weekDates[0] && eventDate <= weekDates[6];
      } else if (view === 'month') {
        return eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear();
      }
      return true;
    })
  }
})();

// 날짜 문자열을 Date 객체로 변환하는 함수
export const parseDateTime = (date: string, time: string): Date => {
  return new Date(`${date}T${time}`);
};

// 겹치는 일정을 찾는 함수
export const findOverlappingEvents = (events: Event[], newEvent: Event): Event[] => {
  return events.filter(event =>
    event.id !== newEvent.id && isOverlapping(event, newEvent)
  );
}

// 두 일정이 겹치는지 확인하는 함수
export const isOverlapping = (event1: Event, event2: Event): boolean => {
  const start1 = parseDateTime(event1.date, event1.startTime);
  const end1 = parseDateTime(event1.date, event1.endTime);
  const start2 = parseDateTime(event2.date, event2.startTime);
  const end2 = parseDateTime(event2.date, event2.endTime);

  return start1 < end2 && start2 < end1;
};





function isDateExcluded(date: Date, excludeDates: Date[] | undefined): boolean {
  if(!excludeDates) return false;

  excludeDates = excludeDates.map((d) => new Date(d))
  return excludeDates.some(excludeDate => 
    excludeDate.getFullYear() === date.getFullYear() &&
    excludeDate.getMonth() === date.getMonth() &&
    excludeDate.getDate() === date.getDate()
  );
}

export const getDateInfo = (date: Date) => {
  return {
    curYear: date.getFullYear(),
    curMonth: date.getMonth()+1,
    curDate: date.getDate()
  }
}

export function generateEventInstances(event: Event, rangeStart: Date, rangeEnd: Date): Event[] {
  const instances: Event[] = [];
  let currentDate = new Date(event.date);

  rangeEnd.setHours(23, 59, 59);  // currentDate의 시간은 9:00, range들의 시간은 00:00이기 때문에 
                                // 매월 마지막날 반복 일정이 추가되지 않아 종료 시간 설정
  // let count = 0;

  while (currentDate <= rangeEnd) {
    if (currentDate > new Date(event.date) && currentDate > rangeStart && !isDateExcluded(currentDate, event.repeat.excludeDates)) {
      if (shouldIncludeDate(currentDate, event)) {
        const {curYear, curMonth, curDate} = getDateInfo(currentDate)
        const formatDate = `${curYear}-${String(curMonth).padStart(2, '0')}-${String(curDate).padStart(2, '0')}`

        instances.push({...event, isRepeat: true, date: formatDate});
        // count++;

        // if (event.endCondition.type === 'count' && count >= (event.endCondition.value as number)) {
        //   break;
        // }
      }
    }

    if (event.repeat.endDate && (currentDate >= new Date(event.repeat.endDate))) {
      break;
    }
    
    currentDate = getNextDate(currentDate, event);
  }

  return instances;
}

export const filteredRepeatEvents = (() => {
  return (events: Event[], searchTerm: string, view: 'week' | 'month', currentDate: Date) => {
    const filtered = searchEvents(events, searchTerm);
    const {curYear, curMonth} = getDateInfo(currentDate);

    const daysInMonth = getDaysInMonth(curYear, curMonth-1);
    const weekDates = getWeekDates(currentDate);

    const filteredEvents: Event[] = [];

    filtered.forEach(event => {
      if(event.repeat.type !== 'none') {
        // const startRange = view === 'week' ? weekDates[0] : new Date(curYear, curMonth-1, 1);
        // const endRange = view === 'week' ? weekDates[6] : new Date(curYear, curMonth-1, daysInMonth);
        // const repeatEvents = generateEventInstances(event, startRange, endRange)
        const repeatEvents = generateEventInstances(event, new Date(curYear, curMonth-1, 1), new Date(curYear, curMonth-1, daysInMonth))

        filteredEvents.push(...repeatEvents.filter((e) => {
          const eDate = new Date(e.date);

          if (view === 'week') {
            return eDate >= weekDates[0] && eDate <= weekDates[6];
          } else if (view === 'month') {
            return eDate.getMonth() === (curMonth-1) &&
              eDate.getFullYear() === curYear;
          }
          return true;
        }))
      }
      
    })

    return [...filteredEvents]
  }
})();

function shouldIncludeDate(date: Date, event: Event): boolean {
  const eventDate = new Date(event.date);
  switch (event.repeat.type) {
    case 'daily':
      return true;
    case 'weekly':
      return eventDate.getDay() === date.getDay();
    case 'monthly':
      return date.getDate() === eventDate.getDate();
    case 'yearly':
      return date.getMonth() === eventDate.getMonth() && date.getDate() === eventDate.getDate();
    default:
      return false;
  }
}

function getNextDate(date: Date, event: Event): Date {
  const nextDate = new Date(date);
  switch (event.repeat.type) {
    case 'daily':
      nextDate.setDate(date.getDate() + event.repeat.interval);
      break;
    case 'weekly':
      nextDate.setDate(date.getDate() + (7 * event.repeat.interval));
      break;
    case 'monthly':
      nextDate.setMonth(date.getMonth() + event.repeat.interval);
      break;
    case 'yearly':
      nextDate.setFullYear(date.getFullYear() + event.repeat.interval);
      break;
  }
  return nextDate;
}